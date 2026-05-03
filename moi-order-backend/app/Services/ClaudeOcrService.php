<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\DocumentOcrInterface;
use App\DTOs\OcrResult;
use App\Enums\DocumentType;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — adapter that wraps the Anthropic vision API for document OCR.
 *   Business logic (storage, validation) lives in DocumentService.
 * Principle: DIP — callers depend on DocumentOcrInterface, not this concrete class.
 *
 * Prompt caching strategy:
 *   The system prompt contains ALL document-type schemas and is identical on every
 *   request, so it is cached after the first call (5-minute TTL, auto-renewed on hit).
 *   The user message carries only the image + a short type instruction — these are
 *   never cached. This layout cuts input token costs by ~80–90% per OCR call once
 *   the cache is warm.
 *
 *   Minimum cached tokens: claude-haiku-4-5 = 2048, claude-sonnet-4-6 = 1024.
 *   The system prompt below is intentionally comprehensive to stay well above 2048.
 */
class ClaudeOcrService implements DocumentOcrInterface
{
    private const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
    private const ANTHROPIC_VERSION = '2023-06-01';
    private const MAX_IMAGE_BYTES   = 5 * 1024 * 1024;

    private readonly string $apiKey;
    private readonly string $model;

    public function __construct()
    {
        $this->apiKey = config('services.anthropic.api_key', '');
        $this->model  = config('services.anthropic.model', 'claude-haiku-4-5-20251001');
    }

    public function analyze(UploadedFile $file, DocumentType $type): OcrResult
    {
        if ($this->apiKey === '') {
            Log::warning('ClaudeOcrService: ANTHROPIC_API_KEY not configured — skipping OCR.');
            return $this->uncheckedResult();
        }

        $imageContent = file_get_contents($file->getRealPath());
        if ($imageContent === false || strlen($imageContent) > self::MAX_IMAGE_BYTES) {
            Log::warning('ClaudeOcrService: file unreadable or too large for vision API.');
            return $this->uncheckedResult();
        }

        $mediaType = $this->resolveMediaType($file->getMimeType() ?? 'image/jpeg');
        $base64    = base64_encode($imageContent);

        try {
            $response = Http::withHeaders([
                'x-api-key'         => $this->apiKey,
                'anthropic-version' => self::ANTHROPIC_VERSION,
                'anthropic-beta'    => 'prompt-caching-2024-07-31',
            ])->timeout(30)->post(self::ANTHROPIC_API_URL, [
                'model'      => $this->model,
                'max_tokens' => 1024,
                // System prompt carries ALL document-type schemas with cache_control.
                // It is identical on every request so the cache is always hit once warm.
                'system'     => [
                    [
                        'type'          => 'text',
                        'text'          => self::SYSTEM_PROMPT,
                        'cache_control' => ['type' => 'ephemeral'],
                    ],
                ],
                'messages'   => [[
                    'role'    => 'user',
                    'content' => [
                        // Image is unique per upload — never cached.
                        [
                            'type'   => 'image',
                            'source' => [
                                'type'       => 'base64',
                                'media_type' => $mediaType,
                                'data'       => $base64,
                            ],
                        ],
                        // Short type instruction — tells the model which schema to apply.
                        [
                            'type' => 'text',
                            'text' => $this->buildUserInstruction($type),
                        ],
                    ],
                ]],
            ]);

            if (!$response->successful()) {
                Log::error('ClaudeOcrService: API error', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return $this->uncheckedResult();
            }

            $text = $response->json('content.0.text', '');

            Log::debug('ClaudeOcrService: cache stats', [
                'cache_creation_input_tokens' => $response->json('usage.cache_creation_input_tokens', 0),
                'cache_read_input_tokens'     => $response->json('usage.cache_read_input_tokens', 0),
                'input_tokens'                => $response->json('usage.input_tokens', 0),
                'output_tokens'               => $response->json('usage.output_tokens', 0),
            ]);

            return $this->parseResponse($text);

        } catch (\Throwable $e) {
            Log::error('ClaudeOcrService: request failed', ['error' => $e->getMessage()]);
            return $this->uncheckedResult();
        }
    }

    private function buildUserInstruction(DocumentType $type): string
    {
        return match ($type) {
            DocumentType::Passport        => 'Analyze the image above as a PASSPORT document. Apply the passport/visa schema and return the JSON.',
            DocumentType::NinetyDayReport => 'Analyze the image above as a THAI 90-DAY NOTIFICATION SLIP (TM47). Apply the ninety_day_slip schema and return the JSON.',
            DocumentType::Other           => 'Analyze the image above as an OTHER OFFICIAL DOCUMENT. Identify which document type it is from the recognised list, apply the matching schema, and return the JSON.',
        };
    }

    private function parseResponse(string $text): OcrResult
    {
        $json = preg_replace('/^```(?:json)?\s*/m', '', $text);
        $json = preg_replace('/\s*```$/m', '', $json ?? $text);

        $data = json_decode(trim($json ?? $text), true);

        if (!is_array($data)) {
            Log::warning('ClaudeOcrService: could not parse JSON response', ['text' => $text]);
            return OcrResult::invalid('Could not analyse the document. Please try a clearer photo.');
        }

        return new OcrResult(
            isValidDocumentType: (bool) ($data['is_valid_document_type'] ?? false),
            validationMessage:   $data['validation_message'] ?? null,
            subtype:             $data['subtype'] ?? null,
            extractedData:       is_array($data['extracted_data'] ?? null) ? $data['extracted_data'] : [],
            expiryDate:          $this->safeDate($data['expiry_date'] ?? null),
            extensionDate:       $this->safeDate($data['extension_date'] ?? null),
        );
    }

    private function resolveMediaType(string $mimeType): string
    {
        return match (strtolower($mimeType)) {
            'image/png'  => 'image/png',
            'image/webp' => 'image/webp',
            'image/gif'  => 'image/gif',
            default      => 'image/jpeg',
        };
    }

    private function safeDate(mixed $value): ?string
    {
        if (!is_string($value) || $value === 'null' || $value === '') {
            return null;
        }
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) !== 1) {
            return null;
        }
        return $value;
    }

    private function uncheckedResult(): OcrResult
    {
        return new OcrResult(
            isValidDocumentType: true,
            validationMessage:   null,
            subtype:             null,
            extractedData:       [],
            expiryDate:          null,
            extensionDate:       null,
        );
    }

    // ---------------------------------------------------------------------------
    // SYSTEM PROMPT — cached once, shared across ALL document types.
    // Must stay above 2048 tokens (claude-haiku-4-5 minimum) to activate caching.
    // The user message specifies which document type to focus on.
    // ---------------------------------------------------------------------------
    private const SYSTEM_PROMPT = <<<'SYSTEM'
You are a document verification and information extraction system specialising in official documents for Myanmar and Southeast Asian nationals living in Thailand. You receive an image of a document and a short instruction specifying which document category to analyse. Your job is to examine the image carefully and return a single JSON object — no markdown, no explanation, no code fences.

GENERAL RULES
- Return ONLY valid JSON. No markdown, no prose, no code fences.
- Use null for any field that cannot be clearly read from the image.
- All dates must be in YYYY-MM-DD format. If only month/year is visible, use the first day of that month.
- The "is_valid_document_type" field is true only if the image matches the requested document category.
- The "validation_message" field is null when valid, and a user-facing error string when invalid.
- Ignore watermarks, stamps, and handwritten annotations unless they are part of the official document fields.
- If a field appears in both English and the local language, prefer the English rendering.
- Be conservative: if you cannot confidently read a field, return null rather than guessing.

OUTPUT SHAPE (always this exact structure):
{
  "is_valid_document_type": true | false,
  "validation_message": null | "human-readable reason",
  "subtype": "slug_string" | null,
  "extracted_data": { ...type-specific fields... },
  "expiry_date": "YYYY-MM-DD" | null,
  "extension_date": "YYYY-MM-DD" | null
}

══════════════════════════════════════════════════════════════
DOCUMENT CATEGORY 1 — PASSPORT
══════════════════════════════════════════════════════════════
A valid passport document is EITHER:
  (A) A passport bio data page — contains the MRZ zone at the bottom (two lines of machine-readable characters), a photo of the holder, and personal information fields (name, date of birth, nationality, passport number, expiry date, issuing country).
  (B) A visa or entry/exit stamp page — contains visa stickers, entry stamps, exit stamps, or immigration records printed or affixed inside a passport booklet.

Subtype A — bio_page
{
  "is_valid_document_type": true,
  "validation_message": null,
  "subtype": "bio_page",
  "extracted_data": {
    "full_name": "JOHN DOE",
    "type": "P",
    "country_code": "MMR",
    "passport_number": "AB123456",
    "nationality": "Myanmar",
    "date_of_birth": "1990-01-15",
    "expiry_date": "2030-01-14",
    "issuing_country": "Myanmar"
  },
  "expiry_date": "2030-01-14",
  "extension_date": null
}
Field notes:
  "type" — the document-type code from the MRZ first field (1–2 characters: "P" standard, "PR" restricted, "PV" visa, "PE" emergency, "PD" diplomatic).
  "country_code" — 3-letter ISO 3166-1 alpha-3 code from the MRZ (e.g. "MMR", "THA", "GBR", "USA", "SGP").
  "passport_number" — alphanumeric, as printed in the MRZ or the document number field.

Subtype B — visa_page
{
  "is_valid_document_type": true,
  "validation_message": null,
  "subtype": "visa_page",
  "extracted_data": {
    "visa_type": "Tourist Visa",
    "country": "Thailand",
    "issue_date": "2025-01-01",
    "expiry_date": "2025-07-01",
    "entries": "Multiple"
  },
  "expiry_date": "2025-07-01",
  "extension_date": null
}

If NOT a passport document:
{
  "is_valid_document_type": false,
  "validation_message": "This does not appear to be a passport document. Please upload a passport bio data page or a visa/stamp page.",
  "subtype": null,
  "extracted_data": {},
  "expiry_date": null,
  "extension_date": null
}

══════════════════════════════════════════════════════════════
DOCUMENT CATEGORY 2 — THAI 90-DAY NOTIFICATION SLIP (TM47)
══════════════════════════════════════════════════════════════
A valid 90-day slip is a Thai Immigration Department form TM47 or its printed/stamped equivalent. It confirms that a foreign national residing in Thailand has notified immigration of their address. Key identifiers:
  - Heading: "Notification of Staying" or "แบบ ตม. 47" or similar Thai immigration text.
  - Contains a "next notification date" (วันที่ต้องแจ้งอยู่ครั้งต่อไป) and holder personal details.
  - May be a physical slip, a counter receipt, or an online acknowledgement printout.

Subtype — ninety_day_slip
{
  "is_valid_document_type": true,
  "validation_message": null,
  "subtype": "ninety_day_slip",
  "extracted_data": {
    "full_name": "JOHN DOE",
    "previous_report_date": "2025-01-01",
    "next_report_date": "2025-04-01"
  },
  "expiry_date": null,
  "extension_date": "2025-04-01"
}
Note: "extension_date" holds the next_report_date — this is the actionable deadline for the holder.

If NOT a 90-day notification slip:
{
  "is_valid_document_type": false,
  "validation_message": "This does not appear to be a Thai 90-day notification slip. Please upload your TM47 or notification receipt from Thai Immigration.",
  "subtype": null,
  "extracted_data": {},
  "expiry_date": null,
  "extension_date": null
}

══════════════════════════════════════════════════════════════
DOCUMENT CATEGORY 3 — OTHER OFFICIAL DOCUMENTS
══════════════════════════════════════════════════════════════
Identify the document from the list of recognised subtypes below. If it matches one, use that subtype slug and extract the listed fields. If it is an official/government document not on the list, use a descriptive snake_case slug and extract whatever fields are present. If it is NOT any kind of official, legal, or government-issued document, return is_valid_document_type: false.

RECOGNISED SUBTYPES AND FIELDS:

1. ci_pink_card — Thai Confirmation of Identity (บัตรประจำตัวบุคคลไม่มีสัญชาติไทย / CI Pink Card)
   Fields: full_name, ci_number, nationality, date_of_birth, issue_date, expiry_date, issuing_office

2. non_la_visa — Thai Non-Immigrant L-A Labour Visa (visa sticker inside passport)
   Fields: full_name, visa_type ("Non-Immigrant L-A"), entries, issue_date, expiry_date, issuing_embassy, passport_number

3. driving_license — Thai Driving Licence (ใบอนุญาตขับขี่)
   Fields: full_name, license_number, license_class, date_of_birth, issue_date, expiry_date, issuing_office

4. international_driving_permit — International Driving Permit (IDP)
   Fields: full_name, permit_number, date_of_birth, issue_date, expiry_date, issuing_country

5. student_id — Student ID Card
   Fields: full_name, student_id, institution_name, faculty, issue_date, expiry_date

6. work_permit — Thai Work Permit (ใบอนุญาตทำงาน)
   Fields: full_name, permit_number, employer_name, occupation, issue_date, expiry_date, issuing_office

7. thai_national_id — Thai National ID Card (บัตรประชาชน)
   Fields: full_name, id_number, date_of_birth, issue_date, expiry_date

8. social_security_card — Thai Social Security Card / SSO membership card
   Fields: full_name, card_number, issue_date, expiry_date, coverage_notes

9. health_insurance_card — Private or government health insurance card
   Fields: full_name, card_number, insurer_name, issue_date, expiry_date, coverage_notes

10. marriage_certificate — Marriage certificate (any country)
    Fields: full_name, spouse_name, document_number, marriage_date, issue_date, issuing_office

11. birth_certificate — Birth certificate (any country)
    Fields: full_name, document_number, date_of_birth, place_of_birth, issue_date, issuing_office

12. residence_certificate — Certificate of residence / address certificate
    Fields: full_name, address, document_number, issue_date, issuing_office

13. tax_id_card — Tax Identification card (Thailand or home country)
    Fields: full_name, tax_id, issue_date, expiry_date, issuing_authority

14. border_pass — Border pass / border crossing card
    Fields: full_name, document_number, nationality, issue_date, expiry_date, issuing_office, permitted_areas

15. tor_ror_13 — TOR ROR 13 (ท.ร.13) — Thai household registration extract for non-citizens
    Fields: full_name, id_number, address, date_of_birth, issue_date, issuing_office

16. Any other official government or legal document not listed above:
    Use a descriptive snake_case subtype slug (e.g. "bank_reference_letter", "embassy_letter", "military_id").
    Fields: document_name, full_name, document_number, issue_date, expiry_date, issuing_office, notes

EXAMPLE RESPONSE for ci_pink_card:
{
  "is_valid_document_type": true,
  "validation_message": null,
  "subtype": "ci_pink_card",
  "extracted_data": {
    "full_name": "JOHN DOE",
    "ci_number": "1234567890123",
    "nationality": "Myanmar",
    "date_of_birth": "1990-01-15",
    "issue_date": "2023-01-01",
    "expiry_date": "2026-01-01",
    "issuing_office": "Chiang Mai Immigration"
  },
  "expiry_date": "2026-01-01",
  "extension_date": null
}

If the image is NOT any kind of official, legal, or government-issued document:
{
  "is_valid_document_type": false,
  "validation_message": "This does not appear to be an official document. Please upload a legal or official government-issued document.",
  "subtype": null,
  "extracted_data": {},
  "expiry_date": null,
  "extension_date": null
}
SYSTEM;
}
