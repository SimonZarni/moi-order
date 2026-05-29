<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\V1;

use App\Enums\AddressLabel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function prepareForValidation(): void
    {
        foreach (['address', 'building', 'floor', 'landmark', 'province', 'contact_name', 'contact_phone'] as $field) {
            if ($this->has($field) && $this->input($field) !== null) {
                $this->merge([$field => strip_tags(trim((string) $this->input($field)))]);
            }
        }
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'label'      => ['sometimes', Rule::enum(AddressLabel::class)],
            'address'    => ['sometimes', 'string', 'max:500'],
            'building'   => ['sometimes', 'nullable', 'string', 'max:255'],
            'floor'      => ['sometimes', 'nullable', 'string', 'max:100'],
            'landmark'   => ['sometimes', 'nullable', 'string', 'max:255'],
            'province'       => ['sometimes', 'nullable', 'string', 'max:100'],
            'contact_name'   => ['sometimes', 'nullable', 'string', 'max:255'],
            'contact_phone'  => ['sometimes', 'nullable', 'string', 'max:50'],
            'latitude'       => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude'  => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'address.max' => 'Address must not exceed 500 characters.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'label'    => 'address label',
            'address'  => 'street address',
            'building' => 'building or unit',
            'landmark' => 'landmark',
        ];
    }
}
