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
 * Uses Http::post() because this class IS the external API adapter (same role as
 * StripePaymentService wrapping the Stripe SDK).
 */
class ClaudeOcrService implements DocumentOcrInterface
{
    private const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
    private const ANTHROPIC_VERSION = '2023-06-01';
    private const MAX_IMAGE_BYTES   = 5 * 1024 * 1024; // 5 MB sent to vision API

    private readonly string $apiKey;
    private readonly string $model;

    public function __construct()
    {
        $this->apiKey = config('services.anthropic.api_key', '');
        $this->model  = config('services.anthropic.model', 'claude-opus-4-7');
    }

    public function analyze(UploadedFile $file, DocumentType $type): OcrResult
    {
        if ($this->apiKey === '') {
            Log::warning('ClaudeOcrService: ANTHROPIC_API_KEY not configured — skipping OCR.');
            return $this->uncheckedResult($type);
        }

        $imageContent = file_get_contents($file->getRealPath());
        if ($imageContent === false || strlen($imageContent) > self::MAX_IMAGE_BYTES) {
            Log::warning('ClaudeOcrService: file unreadable or too large for vision API.');
            return $this->uncheckedResult($type);
        }

        $mediaType = $this->resolveMediaType($file->getMimeType() ?? 'image/jpeg');
        $base64    = base64_encode($imageContent);
        $prompt    = $this->buildPrompt($type);

        try {
            $response = Http::withHeaders([
                'x-api-key'         => $this->apiKey,
                'anthropic-version' => self::ANTHROPIC_VERSION,
                // Prompt caching: instruction text is identical per document type,
                // so it is cached after the first request. Image is unique and not cached.
                // Cache reads cost 10% of normal input price → ~18% cheaper per OCR call.
                'anthropic-beta'    => 'prompt-caching-2024-07-31',
            ])->timeout(30)->post(self::ANTHROPIC_API_URL, [
                'model'      => $this->model,
                'max_tokens' => 1024,
                'messages'   => [[
                    'role'    => 'user',
                    'content' => [
                        // Instruction text first with cache_control — cached across all
                        // requests for this document type (5-minute TTL, auto-renewed).
                        [
                            'type'          => 'text',
                            'text'          => $prompt,
                            'cache_control' => ['type' => 'ephemeral'],
                        ],
                        // Image after the cache boundary — unique per upload, never cached.
                        [
                            'type'   => 'image',
                            'source' => [
                                'type'       => 'base64',
                                'media_type' => $mediaType,
                                'data'       => $base64,
                            ],
                        ],
                    ],
                ]],
            ]);

            if (!$response->successful()) {
                Log::error('ClaudeOcrService: API error', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return $this->uncheckedResult($type);
            }

            $text = $response->json('content.0.text', '');
            return $this->parseResponse($text);

        } catch (\Throwable $e) {
            Log::error('ClaudeOcrService: request failed', ['error' => $e->getMessage()]);
            return $this->uncheckedResult($type);
        }
    }

    private function parseResponse(string $text): OcrResult
    {
        // Strip markdown code fences if present
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

    private function buildPrompt(DocumentType $type): string
    {
        return match($type) {
            DocumentType::Passport => <<<'PROMPT'
You are a document verification system. Analyse this image and determine if it is a passport document.

A valid passport document is EITHER:
1. A passport bio data page (MRZ zone at bottom, photo, personal information fields)
2. A visa or entry stamp page (visa stickers, entry/exit stamps, immigration records)

Respond ONLY with a JSON object — no markdown, no explanation. Use this exact structure:

For a bio data page:
{"is_valid_document_type":true,"validation_message":null,"subtype":"bio_page","extracted_data":{"full_name":"JOHN DOE","type":"P","country_code":"MMR","passport_number":"AB123456","nationality":"Myanmar","date_of_birth":"1990-01-15","expiry_date":"2030-01-14","issuing_country":"Myanmar"},"expiry_date":"2030-01-14","extension_date":null}

The "type" field is the document type code from the MRZ — 1 or 2 characters (e.g. "P" for regular, "PR" for restricted, "PV" for visa, "PE" for emergency, "PD" for diplomatic). The "country_code" is the 3-letter ISO country code from the MRZ (e.g. "MMR", "THA", "GBR").

For a visa/stamp page:
{"is_valid_document_type":true,"validation_message":null,"subtype":"visa_page","extracted_data":{"visa_type":"Tourist Visa","country":"Thailand","issue_date":"2025-01-01","expiry_date":"2025-07-01","entries":"Multiple"},"expiry_date":"2025-07-01","extension_date":null}

If NOT a passport document:
{"is_valid_document_type":false,"validation_message":"This does not appear to be a passport document. Please upload a passport bio data page or visa page.","subtype":null,"extracted_data":{},"expiry_date":null,"extension_date":null}

Use null for fields that cannot be clearly read. All dates as YYYY-MM-DD.
PROMPT,

            DocumentType::NinetyDayReport => <<<'PROMPT'
You are a document verification system. Analyse this image and determine if it is a Thai 90-day notification slip (Form TM47 or immigration notification receipt).

A valid 90-day slip contains: "Notification of Staying" or similar Thai immigration text, a next notification date, and personal details.

Respond ONLY with a JSON object — no markdown, no explanation. Use this exact structure:

For a valid 90-day slip:
{"is_valid_document_type":true,"validation_message":null,"subtype":"ninety_day_slip","extracted_data":{"full_name":"JOHN DOE","previous_report_date":"2025-01-01","next_report_date":"2025-04-01"},"expiry_date":null,"extension_date":"2025-04-01"}

If NOT a 90-day notification slip:
{"is_valid_document_type":false,"validation_message":"This does not appear to be a Thai 90-day notification slip. Please upload your TM47 or notification receipt from Thai Immigration.","subtype":null,"extracted_data":{},"expiry_date":null,"extension_date":null}

Use null for fields that cannot be clearly read. All dates as YYYY-MM-DD.
PROMPT,

            DocumentType::Other => <<<'PROMPT'
You are a document information extraction system for Myanmar and Southeast Asian nationals living in Thailand. Analyse this image and identify the document type, then extract the relevant fields.

Recognised document types and their subtypes:

1. CI PINK CARD (Thai Confirmation of Identity / บัตรประจำตัวบุคคลไม่มีสัญชาติไทย)
   subtype: "ci_pink_card"
   extract: full_name, ci_number, nationality, date_of_birth, issue_date, expiry_date, issuing_office

2. NON-IMMIGRANT LA VISA (Thai Non-Immigrant L-A / Labour visa sticker in passport)
   subtype: "non_la_visa"
   extract: full_name, visa_type ("Non-Immigrant L-A"), entries, issue_date, expiry_date, issuing_embassy, passport_number

3. THAI DRIVING LICENSE (ใบอนุญาตขับขี่)
   subtype: "driving_license"
   extract: full_name, license_number, license_class, date_of_birth, issue_date, expiry_date, issuing_office

4. INTERNATIONAL DRIVING PERMIT
   subtype: "international_driving_permit"
   extract: full_name, permit_number, date_of_birth, issue_date, expiry_date, issuing_country

5. STUDENT ID CARD
   subtype: "student_id"
   extract: full_name, student_id, institution_name, faculty, issue_date, expiry_date

6. WORK PERMIT (ใบอนุญาตทำงาน / Thailand Work Permit)
   subtype: "work_permit"
   extract: full_name, permit_number, employer_name, occupation, issue_date, expiry_date, issuing_office

7. THAI NATIONAL ID CARD (บัตรประชาชน)
   subtype: "thai_national_id"
   extract: full_name, id_number, date_of_birth, issue_date, expiry_date

8. SOCIAL SECURITY CARD / HEALTH INSURANCE CARD
   subtype: "social_security_card" or "health_insurance_card"
   extract: full_name, card_number, issue_date, expiry_date, coverage_notes

9. MARRIAGE / BIRTH CERTIFICATE
   subtype: "marriage_certificate" or "birth_certificate"
   extract: full_name, document_number, issue_date, issuing_office, notes

10. ANY OTHER OFFICIAL DOCUMENT not listed above
    subtype: descriptive slug (e.g. "residence_certificate", "tax_id_card", "bank_book")
    extract: document_name, full_name, document_number, issue_date, expiry_date, issuing_office, notes

Respond ONLY with a JSON object — no markdown, no explanation:
{"is_valid_document_type":true,"validation_message":null,"subtype":"ci_pink_card","extracted_data":{"full_name":"JOHN DOE","ci_number":"1234567890123","nationality":"Myanmar","date_of_birth":"1990-01-15","issue_date":"2023-01-01","expiry_date":"2026-01-01","issuing_office":"Chiang Mai"},"expiry_date":"2026-01-01","extension_date":null}

If the image is not any kind of official, legal, or government-issued document:
{"is_valid_document_type":false,"validation_message":"This does not appear to be an official document. Please upload a legal or official document.","subtype":null,"extracted_data":{},"expiry_date":null,"extension_date":null}

Use null for any field that cannot be clearly read. All dates must be YYYY-MM-DD format.
PROMPT,
        };
    }

    private function resolveMediaType(string $mimeType): string
    {
        return match(strtolower($mimeType)) {
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
        // Validate YYYY-MM-DD format
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) !== 1) {
            return null;
        }
        return $value;
    }

    /** When OCR cannot run, accept the document without validation. */
    private function uncheckedResult(DocumentType $type): OcrResult
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
}
