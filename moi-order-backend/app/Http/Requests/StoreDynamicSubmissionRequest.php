<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\FieldType;
use App\Models\ServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

/**
 * Principle: SRP — owns validation for dynamic-schema submissions only.
 * Principle: Security — field_schema loaded from DB (trusted); submitted field keys
 *   stripped to schema-defined keys only in the DTO — no arbitrary key injection.
 */
class StoreDynamicSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'service_type_id' => ['required', 'integer', 'exists:service_types,id'],
            'idempotency_key' => ['required', 'string', 'uuid'],
            'fields'          => ['sometimes', 'array'],
            'files'           => ['sometimes', 'array'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            if ($v->errors()->has('service_type_id')) {
                return;
            }

            $type = ServiceType::where('is_active', true)
                ->find($this->integer('service_type_id'));

            if ($type === null) {
                $v->errors()->add('service_type_id', 'The selected service type is inactive.');
                return;
            }

            if (empty($type->field_schema)) {
                $v->errors()->add('service_type_id', 'This service type does not accept dynamic submissions.');
                return;
            }

            foreach ($type->field_schema as $field) {
                $key      = $field['key'];
                $fieldType = FieldType::from($field['type']);
                $required  = (bool) $field['required'];
                $labelEn   = $field['label_en'];

                if ($fieldType === FieldType::File) {
                    $this->validateFileField($v, $key, $labelEn, $required, $field['accepts'] ?? ['image']);
                } else {
                    $this->validateTextField($v, $key, $labelEn, $required, $fieldType, $field);
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'service_type_id.exists' => 'The selected service type does not exist.',
            'idempotency_key.uuid'   => 'The idempotency key must be a valid UUID.',
        ];
    }

    public function attributes(): array
    {
        return [
            'service_type_id' => 'service type',
            'idempotency_key' => 'idempotency key',
        ];
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function validateFileField(
        Validator $v,
        string $key,
        string $labelEn,
        bool $required,
        array $accepts,
    ): void {
        $file = $this->file("files.{$key}");

        if ($required && $file === null) {
            $v->errors()->add("files.{$key}", "The {$labelEn} file is required.");
            return;
        }

        if ($file === null) {
            return;
        }

        $allowedMimes = $this->resolveMimes($accepts);

        if (! in_array($file->getMimeType(), $allowedMimes, strict: true)) {
            $accepted = implode(', ', $accepts);
            $v->errors()->add("files.{$key}", "The {$labelEn} must be a valid file type ({$accepted}).");
        }
    }

    private function validateTextField(
        Validator $v,
        string $key,
        string $labelEn,
        bool $required,
        FieldType $fieldType,
        array $field,
    ): void {
        $value = $this->input("fields.{$key}");

        if ($required && ($value === null || $value === '')) {
            $v->errors()->add("fields.{$key}", "The {$labelEn} field is required.");
            return;
        }

        if ($value === null || $value === '') {
            return;
        }

        $error = match ($fieldType) {
            FieldType::Email    => filter_var($value, FILTER_VALIDATE_EMAIL) === false
                                        ? "The {$labelEn} must be a valid email address." : null,
            FieldType::Number   => ! is_numeric($value)
                                        ? "The {$labelEn} must be a number." : null,
            FieldType::Date     => strtotime((string) $value) === false
                                        ? "The {$labelEn} must be a valid date." : null,
            FieldType::Boolean  => ! in_array($value, [true, false, 1, 0, '1', '0', 'true', 'false'], strict: true)
                                        ? "The {$labelEn} must be true or false." : null,
            FieldType::Select   => ! in_array($value, $field['options'] ?? [], strict: true)
                                        ? "The selected {$labelEn} is invalid." : null,
            default             => null,
        };

        if ($error !== null) {
            $v->errors()->add("fields.{$key}", $error);
        }
    }

    /** Maps accepts values (image, pdf, doc) to concrete MIME types. */
    private function resolveMimes(array $accepts): array
    {
        $map = [
            'image' => ['image/jpeg', 'image/png', 'image/webp'],
            'pdf'   => ['application/pdf'],
            'doc'   => [
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],
        ];

        return array_merge(...array_map(
            fn (string $a) => $map[$a] ?? [],
            $accepts,
        ));
    }
}
