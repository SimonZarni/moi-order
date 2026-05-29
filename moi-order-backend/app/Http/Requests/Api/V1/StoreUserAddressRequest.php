<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\V1;

use App\Enums\AddressLabel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserAddressRequest extends FormRequest
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
            'label'      => ['required', Rule::enum(AddressLabel::class)],
            'address'    => ['required', 'string', 'max:500'],
            'building'   => ['nullable', 'string', 'max:255'],
            'floor'      => ['nullable', 'string', 'max:100'],
            'landmark'   => ['nullable', 'string', 'max:255'],
            'province'       => ['required', 'string', 'max:100'],
            'contact_name'   => ['required', 'string', 'max:255'],
            'contact_phone'  => ['required', 'string', 'max:50'],
            'latitude'       => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'  => ['nullable', 'numeric', 'between:-180,180'],
            'is_default' => ['boolean'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'address.required'      => 'Street address is required.',
            'address.max'           => 'Address must not exceed 500 characters.',
            'label.required'        => 'Label is required.',
            'contact_name.required' => 'Contact name is required.',
            'contact_phone.required'=> 'Contact phone is required.',
            'province.required'     => 'Province or city is required.',
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
