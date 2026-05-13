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
 *   Minimum cached tokens: claude-haiku-4-5 = 4096, claude-sonnet-4-6 = 1024.
 *   The system prompt below is intentionally comprehensive to stay well above 4096.
 */
class ClaudeOcrService implements DocumentOcrInterface
{
    private const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
    private const ANTHROPIC_VERSION = '2023-06-01';
    // Raised from 5 MB: 0.85-quality 4096px JPEGs from the mobile client can exceed 5 MB.
    // Anthropic's base64 image limit is ~8 MB of raw bytes (before base64 expansion).
    private const MAX_IMAGE_BYTES   = 8 * 1024 * 1024;

    private readonly string $apiKey;
    private readonly string $model;

    public function __construct()
    {
        $this->apiKey = config('services.anthropic.api_key', '');
        // Sonnet is used by default: Haiku has poor digit-level OCR accuracy on ID cards and
        // small printed text, producing confusions like 6↔8, 3↔9, 1↔7 even on clear images.
        // Override via ANTHROPIC_MODEL env var if cost is a concern.
        $this->model  = config('services.anthropic.model', 'claude-sonnet-4-6');
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

        // Diagnose what actually arrives before we base64-encode and send.
        $finfo      = new \finfo(FILEINFO_MIME_TYPE);
        $actualMime = $finfo->buffer($imageContent);
        $headerHex  = bin2hex(substr($imageContent, 0, 12));
        $imgSize    = @getimagesize($file->getRealPath());
        Log::info('ClaudeOcrService: image diagnostics', [
            'file_size_kb' => round(strlen($imageContent) / 1024, 1),
            'claimed_mime' => $file->getMimeType(),
            'actual_mime'  => $actualMime,
            'header_hex'   => $headerHex,
            'dimensions'   => $imgSize ? "{$imgSize[0]}x{$imgSize[1]}" : 'unknown',
            'is_jpeg'      => str_starts_with($headerHex, 'ffd8ff'),
            'is_heic_ftyp' => str_starts_with($headerHex, '00000'),
        ]);

        // Auto-rotate based on EXIF orientation so Claude receives an upright image.
        // expo-image-manipulator does not always strip the EXIF orientation tag when
        // re-encoding from HEIC/ph:// URIs, causing Claude to see sideways text.
        [$imageContent, $didRotateByExif] = $this->applyExifRotation($imageContent);

        // For "Other" documents (ID cards, driving licences, CI cards — mostly landscape)
        // photographed in portrait mode, the card content arrives sideways and EXIF=1
        // (the photo is correctly upright, but the card is at 90°). EXIF rotation can't
        // help. Physically rotate 90° CW when height/width > 1.5:
        //   • Student ID / CI card (ISO ID-1): natural ratio 1.585 → rotates ✓
        //   • A4 portrait letter/certificate:  natural ratio 1.414 → stays  ✓
        // Passport and NinetyDayReport are always portrait — never touch them here.
        if (!$didRotateByExif
            && $type === DocumentType::Other
            && ($imgSize[1] ?? 0) > ($imgSize[0] ?? 0) * 1.5
        ) {
            $rotated = $this->rotateImageCcw90($imageContent);
            if ($rotated !== $imageContent) {
                $imageContent = $rotated;
                Log::info('ClaudeOcrService: portrait Other document rotated 90° CCW');
            }
        }

        // Only flag as portrait when no physical rotation was applied — used to
        // inject an extra digit-verification warning into the user instruction.
        $isPortrait = !$didRotateByExif
            && ($imgSize[1] ?? 0) > ($imgSize[0] ?? 0) * 1.3
            && !($type === DocumentType::Other && ($imgSize[1] ?? 0) > ($imgSize[0] ?? 0) * 1.5);

        $mediaType = $this->resolveMediaType($file->getMimeType() ?? 'image/jpeg');
        $base64    = base64_encode($imageContent);

        try {
            $response = Http::withHeaders([
                'x-api-key'         => $this->apiKey,
                'anthropic-version' => self::ANTHROPIC_VERSION,
                'anthropic-beta'    => 'prompt-caching-2024-07-31',
            ])->timeout(30)->post(self::ANTHROPIC_API_URL, [
                'model'       => $this->model,
                // Raised from 2048: complex images (card on table, partial view, background)
                // need more Step 1 reasoning space. Simple clean-card photos won't use
                // the extra capacity — output cost only applies to actual tokens generated.
                'max_tokens'  => 3500,
                // temperature 0 eliminates sampling randomness — critical for OCR where
                // the correct answer is deterministic (the digit printed on the card).
                'temperature' => 0,
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
                            'text' => $this->buildUserInstruction($type, $isPortrait),
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

            Log::info('ClaudeOcrService: raw response', ['text' => $text]);
            Log::info('ClaudeOcrService: cache stats', [
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

    private function buildUserInstruction(DocumentType $type, bool $isPortrait = false): string
    {
        $docInstruction = match ($type) {
            DocumentType::Passport        => 'This is a PASSPORT document. Apply the passport/visa schema.',
            DocumentType::NinetyDayReport => 'This is a THAI 90-DAY NOTIFICATION SLIP (TM47). Apply the ninety_day_slip schema.',
            DocumentType::Other           => 'This is an OTHER OFFICIAL DOCUMENT. Identify the type from the recognised list and apply the matching schema.',
        };

        // Portrait images often contain landscape cards photographed sideways.
        // Mental rotation significantly increases digit-level OCR errors — warn Claude.
        $rotationCaution = $isPortrait
            ? <<<'CAUTION'

        ⚠ PORTRAIT IMAGE — ROTATED CONTENT LIKELY: This image is taller than it is wide.
        If the document content appears rotated 90°, it IS rotated — correct for it immediately.
        Rotated images cause significantly more digit errors (6↔9, 1↔7, 3↔8, 0↔8, 5↔6).
        For EVERY digit sequence in a rotated image you MUST:
          1. State which direction the image is rotated.
          2. Spell each digit left-to-right in the CORRECTED orientation.
          3. State the total digit count.
          4. Read the sequence a SECOND time from scratch and compare.
          5. If there is ANY discrepancy between reads, do a THIRD read and take the majority.
          6. Write the value only after completing all steps above.
        CAUTION
            : '';

        return <<<INSTRUCTION
        {$docInstruction}
        {$rotationCaution}

        STEP 1 — READ (write plain text notes here before the JSON):

        FRAME THE DOCUMENT FIRST — before reading any field:
        Locate the document's four corners and draw a tight mental boundary around it.
        If the image shows background (table, surface, hand, other objects), everything outside those corners is irrelevant — ignore it completely.
        All field extraction happens exclusively within the framed document area.

        Then, within the framed document:
        - Identify the document layout and locate each field.
        - For every number field: spell each digit aloud left to right, state the total digit count, then read a second time to verify. If both reads agree, that is your value. If they differ, do a third read and take the majority.
        - For every name field: spell each letter individually. Do not assume spelling.
        - Consecutive identical digits (00, 11, 33) are separate digits — never merge them.
        - Always write your best reading. Only use null if a field is physically obscured or cut off.

        STEP 2 — JSON (immediately after your Step 1 notes, output the JSON on a new line starting with {):
        Both steps are required. Step 1 is not optional.
        INSTRUCTION;
    }

    private function parseResponse(string $text): OcrResult
    {
        // Strip markdown code fences.
        $cleaned = preg_replace('/```(?:json)?\s*/m', '', $text);
        $cleaned = preg_replace('/```/m', '', $cleaned ?? $text);
        $cleaned = trim($cleaned ?? $text);

        // Try direct parse first (pure JSON response).
        $data = json_decode($cleaned, true);

        // If that fails, scan forward for the first { that starts a valid JSON
        // object containing our required schema key. This handles responses where
        // Claude prefixes prose or reasoning before the JSON block.
        if (!is_array($data)) {
            $pos = 0;
            while (($pos = strpos($cleaned, '{', $pos)) !== false) {
                $candidate = json_decode(substr($cleaned, $pos), true);
                if (is_array($candidate) && array_key_exists('is_valid_document_type', $candidate)) {
                    $data = $candidate;
                    break;
                }
                $pos++;
            }
        }

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

    /**
     * Physically rotate JPEG pixel data to match its EXIF orientation tag.
     *
     * The Anthropic Vision API (and the raw base64 pipeline) ignores EXIF orientation,
     * so a portrait photo taken on iOS arrives with sideways pixels and an EXIF tag
     * saying "rotate 90°" — Claude sees sideways text. This method bakes the rotation
     * into the pixel data and re-encodes at 95 % JPEG quality so the tag is no longer
     * needed. Non-JPEG formats are returned unchanged (they rarely carry EXIF orientation).
     */
    private function rotateImageCcw90(string $imageContent): string
    {
        if (!str_starts_with($imageContent, "\xFF\xD8\xFF")) {
            return $imageContent;
        }
        $img = @imagecreatefromstring($imageContent);
        if ($img === false) {
            return $imageContent;
        }
        // PHP imagerotate is CCW; +90 = 90° CCW, which corrects a 90° CW content rotation.
        $rotated = imagerotate($img, 90, 0);
        if ($rotated === false) {
            imagedestroy($img);
            return $imageContent;
        }
        ob_start();
        imagejpeg($rotated, null, 95);
        $out = ob_get_clean();
        imagedestroy($img);
        imagedestroy($rotated);
        return ($out !== false && $out !== '') ? $out : $imageContent;
    }

    /**
     * @return array{0: string, 1: bool}  [rotated-or-original content, whether rotation was applied]
     */
    private function applyExifRotation(string $imageContent): array
    {
        // JPEG magic bytes: FF D8 FF — only JPEGs carry EXIF orientation.
        if (!str_starts_with($imageContent, "\xFF\xD8\xFF")) {
            return [$imageContent, false];
        }

        $tmp = tmpfile();
        if ($tmp === false) {
            return [$imageContent, false];
        }

        try {
            fwrite($tmp, $imageContent);
            $meta        = stream_get_meta_data($tmp);
            $exif        = @exif_read_data($meta['uri']);
            $orientation = is_array($exif) ? (int) ($exif['Orientation'] ?? 1) : 1;

            Log::info('ClaudeOcrService: EXIF read', [
                'has_exif'    => is_array($exif),
                'orientation' => $orientation,
            ]);

            if ($orientation === 1) {
                return [$imageContent, false];
            }

            $img = @imagecreatefromstring($imageContent);
            if ($img === false) {
                return [$imageContent, false];
            }

            $rotated = match ($orientation) {
                3 => imagerotate($img, 180, 0),
                6 => imagerotate($img, -90, 0),
                8 => imagerotate($img,  90, 0),
                default => null,
            };

            if ($rotated === null || $rotated === false) {
                imagedestroy($img);
                return [$imageContent, false];
            }

            Log::info('ClaudeOcrService: EXIF rotation applied', ['orientation' => $orientation]);

            ob_start();
            imagejpeg($rotated, null, 95);
            $out = ob_get_clean();
            imagedestroy($img);
            imagedestroy($rotated);

            $result = ($out !== false && $out !== '') ? $out : $imageContent;
            return [$result, $result !== $imageContent];

        } finally {
            fclose($tmp); // tmpfile() cleans up the temp file on fclose
        }
    }

    // ---------------------------------------------------------------------------
    // SYSTEM PROMPT — cached once, shared across ALL document types.
    // Must stay above 4096 tokens (claude-haiku-4-5 minimum) to activate caching.
    // The user message specifies which document type to focus on.
    // ---------------------------------------------------------------------------
    private const SYSTEM_PROMPT = <<<'SYSTEM'
You are a document verification and information extraction system specialising in official documents for Myanmar and Southeast Asian nationals living in Thailand. You receive an image of a document and a short instruction specifying which document category to analyse. Your job is to examine the image carefully and return a single JSON object — no markdown, no explanation, no code fences.

GENERAL RULES
- Return ONLY valid JSON. No markdown, no prose, no code fences.
- Use null for any field that cannot be clearly read from the image.
- All dates must be in YYYY-MM-DD format. If only month/year is visible, use the first day of that month.
- The "is_valid_document_type" field is true only if the image matches the requested document category.
- The "validation_message" field is null when valid. When invalid, it must be ONE short sentence only — do NOT describe the image content. Use this format: "This does not appear to be a [document type]. Please upload a [brief description of what is required]." Example: "This does not appear to be a passport. Please upload your passport bio data page or a visa/stamp page."
- Ignore watermarks, stamps, and handwritten annotations unless they are part of the official document fields.
- If a field appears in both English and the local language, prefer the English rendering.
- Be conservative: if you cannot confidently read a field, return null rather than guessing.
- Never hallucinate document numbers, dates, or names. If a value is unclear, return null.
- A photograph of a physical document is acceptable — extract fields exactly as printed.
- Laminated, worn, or partially obscured documents should still be processed; return null only for fields that are genuinely unreadable.
- If the image is completely unreadable (solid colour, corrupted, or obviously not a document at all), return is_valid_document_type: false with an appropriate validation_message.

ACCURACY REQUIREMENTS — READ THIS CAREFULLY BEFORE EXTRACTING ANYTHING
These documents hold personal identification data. A wrong digit or wrong character has serious consequences for the user. Speed does not matter — accuracy does. Follow every step below without exception.

Step 1 — Examine the whole image first.
Before writing any field value, scan the entire document. Identify the layout, locate each field label, and understand what text belongs to each field. Do not start extracting until you have oriented yourself fully.

Step 2 — Extract each field character by character. No rushing.
For every field value, read one character at a time, left to right. Do not read a word or number as a single glance — spell it out in your mind character by character.

Step 3 — Numbers require extra care. Read digit by digit, then verify.
For every numeric sequence (ID number, document number, passport number, card number, any sequence of digits):
  • Read the first digit. Confirm its shape before moving to the next.
  • Continue one digit at a time through the entire sequence.
  • After reaching the end, read the sequence again from left to right to verify you got the same result.
  • Only then write the value.
  Common digit confusions in printed documents: 1 vs 7 vs l, 0 vs 8 vs O, 6 vs 8, 3 vs 8, 5 vs 6, 2 vs 7, 9 vs 4.
  Shape rules: 8 has two fully closed loops top and bottom; 6 has one closed loop at the bottom only; 9 has one closed loop at the top only; 3 opens to the right on both curves; 0 is a single closed oval; 1 is a single vertical stroke, sometimes with a serif base.

Step 4 — Names require the same care. Read letter by letter.
Spell out every name character by character. Common letter confusions in printed documents: I vs l vs 1, O vs 0, rn vs m, cl vs d, li vs h, vv vs w, B vs 8, S vs 5, G vs 6, Z vs 2.
Preserve the exact capitalisation printed on the document.

Step 5 — Dates: verify each component independently.
Read the day, month, and year as separate numbers using the digit-by-digit method from Step 3. If a month name is also printed, cross-check it against the numeric month. Convert Buddhist Era years (> 2500) by subtracting 543.

Step 6 — Final check before writing JSON.
After you have formed all your field values, look at the image one more time. For each field, glance at the source text in the image and confirm your extracted value matches what is printed. If anything does not match, correct it.

Step 7 — When in doubt, return null. Never guess.
If you are not fully confident in a character or digit after careful inspection, return null for that entire field. A null value is always safer than a wrong value for identification documents.

IMAGE QUALITY GUIDANCE
Poor image quality does not automatically make a document invalid. Apply these rules:
- Blurry but partially readable: extract what you can; use null for fields you cannot read.
- Partially cropped: extract visible fields; use null for fields that are cut off.
- Low contrast or faded ink: attempt to read even faint text; return null only if truly indecipherable.
- Glare or reflection on part of the image: extract fields from the unaffected areas normally.
- Rotated or skewed image: mentally correct the orientation and extract as normal.
- Document surrounded by background (table, surface, hand, other objects): locate the document's four corners first and work exclusively within those boundaries. Surface texture, shadows, and objects outside the document are not fields — do not let them influence extraction.
- Black-and-white scan or photocopy: fully valid; extract all fields normally.
- Multiple documents visible in one image: focus on the document matching the requested category.
- Holographic overlays and security foils: these are not data fields — ignore them.
- A missing or obscured holder photo does not make the document invalid.
- Camera screenshots and screen photos of documents are acceptable inputs.

OUTPUT SHAPE (always this exact structure):
{
  "is_valid_document_type": true | false,
  "validation_message": null | "human-readable reason",
  "subtype": "slug_string" | null,
  "extracted_data": { ...type-specific fields... },
  "expiry_date": "YYYY-MM-DD" | null,
  "extension_date": "YYYY-MM-DD" | null
}

FIELD DEFAULTS AND NULL HANDLING
- Never omit a key from extracted_data. Every documented field must be present; use null if not visible.
- Date fields: YYYY-MM-DD strictly. Thai Buddhist Era dates must be converted: subtract 543 from the Thai year to get the Gregorian year. Example: Thai year 2568 = Gregorian 2025. Thai year 2567 = Gregorian 2024. Check whether the printed year is greater than 2500 to detect Buddhist Era.
- Name fields: return exactly as printed, preserving capitalisation from the source document.
- Document number fields: include all alphanumeric characters and hyphens exactly as printed; strip spaces.
- Nationality: return the English demonym (e.g. "Myanmar", "Thai", "Cambodian", "Lao", "Vietnamese", "Chinese", "Indian", "Bangladeshi", "Filipino", "Indonesian", "Malaysian").
- Money and numeric fields: return as a plain string, not a number type.
- Boolean fields: return true or false (JSON boolean), not strings.

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
  "type" — the document-type code from the MRZ first field (1–2 characters: "P" standard, "PR" restricted, "PV" visa, "PE" emergency, "PD" diplomatic, "LP" laissez-passer).
  "country_code" — 3-letter ISO 3166-1 alpha-3 code from the MRZ (e.g. "MMR" Myanmar, "THA" Thailand, "GBR" United Kingdom, "USA" United States, "SGP" Singapore, "KHM" Cambodia, "LAO" Laos, "VNM" Vietnam, "CHN" China, "IND" India, "BGD" Bangladesh, "NPL" Nepal, "LKA" Sri Lanka, "PHL" Philippines, "IDN" Indonesia, "MYS" Malaysia, "UNO" UN laissez-passer).
  "passport_number" — alphanumeric, as printed in the MRZ or the document number field. Strip spaces but preserve hyphens.
  "full_name" — prefer the MRZ line 2 name field. Replace MRZ filler characters (<<) with a single space. Strip leading and trailing filler characters (<).
  "date_of_birth" — from MRZ or printed field. MRZ format is YYMMDD. Century rule: YY >= 30 → 19xx; YY < 30 → 20xx.
  "expiry_date" — from MRZ or printed expiry field. Same century rule as date_of_birth.
  MRZ disagreement: if MRZ and printed field disagree, prefer the MRZ value.

Passport edge cases:
- Emergency passports ("PE"): same schema as bio_page; validity is typically 1 year.
- Diplomatic passports ("PD"): extract normally; note type as "PD".
- Old Myanmar passports (green cover): same fields apply even though the layout differs from newer ePassports.
- Myanmar passports may say "UNION OF MYANMAR" or "REPUBLIC OF THE UNION OF MYANMAR" — both are valid.
- Laissez-passer (UN travel document): type = "LP", country_code = "UNO". Extract name, number, DOB, expiry as normal.
- Some older passports have a single-line MRZ (OCR-A format rather than two-line TD3) — extract the data as best you can.

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
Visa field notes:
  "visa_type" — the full type string as printed (e.g. "Tourist Visa", "Non-Immigrant B", "Non-Immigrant L-A", "Transit Visa", "METV", "Retirement Visa", "Education Visa").
  "country" — the country that issued the visa.
  "entries" — "Single", "Double", or "Multiple" as printed on the visa sticker.
  "issue_date" — the date the visa was issued (not the date of entry).
  "expiry_date" — the date by which the holder must enter, or the final permitted day of stay.
  Entry/exit stamps only (no visa sticker): subtype is still "visa_page"; set visa_type to null.
  Multiple visas on one page: return the most recently issued visa.

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
  - May be printed in Thai language only — this is still a valid TM47.
  - The online TM47 acknowledgement from the Thai immigration e-Report website is valid and has the same fields.
  - Some slips are stamped directly into the passport booklet; if the stamp contains a next-report date, it is valid.

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
Date conversion: Thai Immigration prints dates in Buddhist Era. Subtract 543 to get the Gregorian year. Example: วันที่ 01/07/2568 → 2025-07-01. The year field may be 4-digit Thai year (> 2500) or 4-digit Gregorian year (< 2100); check the range to determine which convention was used.
If only the next_report_date is legible and previous_report_date is not visible, return null for previous_report_date.

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
Identify the document from the list of recognised subtypes below. If it matches one, use that subtype slug. If it is an official/government document not on the list, use a descriptive snake_case slug. If it is NOT any kind of official, legal, or government-issued document, return is_valid_document_type: false.

FIELD EXTRACTION — OPEN-ENDED
Do not apply a fixed field list. Extract every key-value pair clearly printed on the document into extracted_data using descriptive snake_case keys. The subtype notes help you identify the document — they do not constrain what you extract. Always capture at minimum:
  • holder name (full_name, or name_en / name_th if both scripts appear)
  • every number that uniquely identifies the document or holder — card number, ID number, permit number, licence number, reference number, etc. Never skip these even if not explicitly listed.
  • issue_date and expiry_date, or their nearest equivalents
  • issuing_office or issuing_authority
  • any other dates or important fields printed on the document

SUBTYPE IDENTIFICATION RULES
- Read the document title, header, or any official label first.
- If the document is bilingual (Thai + English), the English title takes priority for subtype identification.
- If you cannot identify the type from the title, look for issuing authority logos, seals, or department stamps.
- A laminated plastic card issued by a Thai government authority with a holder photo is almost certainly an identity card — check the issuing ministry name to narrow the subtype.
- Documents with "กรมการจัดหางาน" (Dept. of Employment) are work-related (work_permit or certificate_of_employment).
- Documents with "กรมการปกครอง" (Dept. of Provincial Administration) are national ID or household registration.
- Documents with "ตรวจคนเข้าเมือง" (Immigration Bureau) are immigration-related (tm30_receipt, tm6, residence_certificate).
- Documents with "กรมขนส่งทางบก" (Land Transport Dept.) are driving_license or international_driving_permit.
- Documents with "สำนักงานประกันสังคม" (Social Security Office) are social_security_card.

RECOGNISED SUBTYPES:

1. ci_pink_card — Thai Confirmation of Identity (บัตรประจำตัวบุคคลไม่มีสัญชาติไทย / CI Pink Card)
   Notes: Pink/light-red laminated card issued by the Thai Interior Ministry to stateless persons and ethnic minorities. The CI number is 13 digits.

2. non_la_visa — Thai Non-Immigrant L-A Labour Visa (visa sticker inside passport)
   Notes: Issued specifically for Myanmar workers under the MOU labour agreement. The visa sticker will say "NON-IMMIGRANT L-A" or "NON-IMMI. L-A".

3. driving_license — Thai Driving Licence (ใบอนุญาตขับขี่)
   Notes: licence_class values: "รย.1" (motorcycle ≤125cc), "รย.2" (motorcycle >125cc), "รย.3" (car), "รย.4" (taxi), "ท.1" (truck), "ป.1" (bus). Return the class code exactly as printed. Driving licences are valid for 2 years (new) or 5 years (renewal).

4. international_driving_permit — International Driving Permit (IDP)
   Notes: A grey booklet with the UN emblem and the title "International Driving Permit". Valid for 1 year from issue date.

5. student_id — Student ID Card
   Notes: May be issued by any accredited school, college, or university. The institution name is usually prominent on the front. Always extract the student ID number printed on the card.

6. work_permit — Thai Work Permit (ใบอนุญาตทำงาน)
   Notes: Blue booklet format. Permit number prefix indicates the issuing province. Extract the employer name and occupation as printed on the permit.

7. thai_national_id — Thai National ID Card (บัตรประชาชน)
   Notes: White plastic card with the Thai government emblem. The ID number is 13 digits. Return null for expiry_date if the card reads "ตลอดชีพ" (lifetime validity).

8. social_security_card — Thai Social Security Card / SSO membership card
   Notes: Issued by the Social Security Office (สำนักงานประกันสังคม). May mention the assigned hospital or benefit type.

9. health_insurance_card — Private or government health insurance card
   Notes: May be from a private insurer (BUPA, AXA, Cigna, Allianz) or the government 30-Baht Universal Coverage scheme (บัตรทอง). Capture the plan name or benefit tier if visible.

10. marriage_certificate — Marriage certificate (any country)
    Notes: Thai marriage certificates are issued by the district office (สำนักงานเขต / ที่ว่าการอำเภอ). marriage_date is when the couple wed; issue_date is when the certificate was printed. These may differ if the certificate was issued long after the marriage.

11. birth_certificate — Birth certificate (any country)
    Notes: Thai birth certificate is "สูติบัตร". Myanmar equivalent is the "Birth Certificate" or "ကိုယ်ရေးမှတ်တမ်း". Extract the place of birth if printed.

12. residence_certificate — Certificate of residence / address certificate
    Notes: Issued by a local Thai authority (district office or police station) to confirm the holder's address. Typically valid for 30–90 days from issue date.

13. tax_id_card — Tax Identification card (Thailand or home country)
    Notes: Thai individual TIN is 13 digits (same format as national ID). Corporate TIN is also 13 digits. Issued by the Revenue Department (กรมสรรพากร).

14. border_pass — Border pass / border crossing card
    Notes: Issued at official border crossing points. Extract the Thai provinces or areas the holder is permitted to enter. Common for Myanmar-Thailand cross-border day workers and seasonal labourers.

15. tor_ror_13 — TOR ROR 13 (ท.ร.13) — Thai household registration extract for non-citizens
    Notes: Printed on yellow paper. Issued by the district office (อำเภอ) to register non-citizen residents. The non-citizen equivalent of the Thai tabien baan (ทะเบียนบ้าน).

16. tm6_departure_card — Thai TM6 Arrival/Departure card
    Notes: White card filled in on arrival at a Thai port of entry. The bottom stub is the departure record retained in the passport. arrival_date and departure_date may be on separate stubs of the same card.

17. tm30_receipt — Thai TM30 receipt (landlord/host notification)
    Notes: Landlords and hosts notify immigration of a foreign guest's address within 24 hours of arrival. Often a small thermal-printed slip with an official stamp.

18. certificate_of_employment — Employment certificate or letter
    Notes: A formal letter or certificate from an employer confirming the holder's employment status and position. Not a government form but still official for immigration and visa purposes.

19. bank_statement_page — Bank statement page
    Notes: account_number must show only the last 4 digits masked (e.g. "****1234"). Extract the statement period date range as printed.

20. diploma_or_transcript — Academic diploma, degree certificate, or official transcript
    Notes: Issued by a school or university. Extract the qualification name (e.g. "Bachelor of Science"), field of study, and graduation date.

21. police_clearance_certificate — Police clearance / criminal record certificate
    Notes: Always extract the result field ("No criminal record" or equivalent). Thai version: "หนังสือรับรองความประพฤติ". Myanmar version issued by Myanmar Police Force.

22. un_refugee_card — UNHCR Refugee Card or Asylum Seeker Certificate
    Notes: Issued by UNHCR. A yellow or blue laminated card. The card number is the UNHCR case number.

23. Any other official government or legal document not listed above:
    Use a descriptive snake_case subtype slug (e.g. "bank_reference_letter", "embassy_letter", "military_id", "refugee_certificate", "power_of_attorney"). Extract all visible fields.

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

EXAMPLE RESPONSE for work_permit:
{
  "is_valid_document_type": true,
  "validation_message": null,
  "subtype": "work_permit",
  "extracted_data": {
    "full_name": "MA MA",
    "permit_number": "CM-2567-123456",
    "employer_name": "Northern Thai Restaurant Co., Ltd.",
    "occupation": "Cook",
    "issue_date": "2024-03-01",
    "expiry_date": "2025-03-01",
    "issuing_office": "Chiang Mai Labour Office"
  },
  "expiry_date": "2025-03-01",
  "extension_date": null
}

EXAMPLE RESPONSE for tm30_receipt:
{
  "is_valid_document_type": true,
  "validation_message": null,
  "subtype": "tm30_receipt",
  "extracted_data": {
    "full_name": "JOHN DOE",
    "nationality": "Myanmar",
    "address": "123 Moo 5, Tambon Nong Hoi, Amphoe Mueang, Chiang Mai 50000",
    "report_date": "2025-06-15",
    "issuing_office": "Chiang Mai Immigration"
  },
  "expiry_date": null,
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
