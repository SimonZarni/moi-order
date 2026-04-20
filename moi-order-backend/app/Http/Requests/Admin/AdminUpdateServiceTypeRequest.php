<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\DocumentType;
use App\Enums\FieldType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class AdminUpdateServiceTypeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'      => ['sometimes', 'string', 'max:255'],
            'name_en'   => ['sometimes', 'string', 'max:255'],
            'name_mm'   => ['sometimes', 'nullable', 'string', 'max:255'],
            'price'     => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],

            'field_schema'              => ['sometimes', 'nullable', 'array'],
            'field_schema.*.key'        => ['required', 'string', 'max:100', 'regex:/^[a-z][a-z0-9_]*$/'],
            'field_schema.*.label'      => ['required', 'string', 'max:255'],
            'field_schema.*.label_en'   => ['required', 'string', 'max:255'],
            'field_schema.*.label_mm'   => ['nullable', 'string', 'max:255'],
            'field_schema.*.type'       => ['required', Rule::enum(FieldType::class)],
            'field_schema.*.required'   => ['required', 'boolean'],
            'field_schema.*.sort_order' => ['required', 'integer', 'min:1'],
            'field_schema.*.options'    => ['nullable', 'array', 'min:1'],
            'field_schema.*.options.*'  => ['string', 'max:100'],
            'field_schema.*.accepts'         => ['nullable', 'array', 'min:1'],
            'field_schema.*.accepts.*'       => ['string', Rule::in(['image', 'pdf', 'doc'])],
            'field_schema.*.document_type'   => ['nullable', Rule::enum(DocumentType::class)],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            $schema = $this->input('field_schema');

            if (! is_array($schema) || empty($schema)) {
                return;
            }

            $this->assertUniqueKeys($v, $schema);
            $this->assertTypeConditionals($v, $schema);
        });
    }

    public function messages(): array
    {
        return [
            'field_schema.*.key.regex'    => 'Field key must be lowercase snake_case (e.g. passport_no).',
            'field_schema.*.type.enum'    => 'Field type must be one of: text, textarea, number, email, phone, date, boolean, select, file.',
            'field_schema.*.accepts.*.in' => 'Accepted file type must be one of: image, pdf, doc.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name_en'      => 'English name',
            'name_mm'      => 'Myanmar name',
            'price'        => 'price (satangs)',
            'is_active'    => 'active status',
            'field_schema' => 'field schema',
        ];
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function assertUniqueKeys(Validator $v, array $schema): void
    {
        $keys = array_column($schema, 'key');

        if (count($keys) !== count(array_unique($keys))) {
            $v->errors()->add('field_schema', 'Field keys must be unique within the schema.');
        }
    }

    private function assertTypeConditionals(Validator $v, array $schema): void
    {
        foreach ($schema as $index => $field) {
            $type = FieldType::tryFrom($field['type'] ?? '');

            if ($type === null) {
                continue;
            }

            if ($type->requiresOptions() && empty($field['options'])) {
                $v->errors()->add(
                    "field_schema.{$index}.options",
                    'Select fields must have at least one option.'
                );
            }

            if ($type->requiresAccepts() && empty($field['accepts'])) {
                $v->errors()->add(
                    "field_schema.{$index}.accepts",
                    'File fields must specify at least one accepted file type (image, pdf, doc).'
                );
            }

            if ($type === FieldType::File && empty($field['document_type'])) {
                $v->errors()->add(
                    "field_schema.{$index}.document_type",
                    'File fields must specify a document type.'
                );
            }
        }
    }
}
