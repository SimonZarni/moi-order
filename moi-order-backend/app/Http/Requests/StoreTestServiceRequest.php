<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

/**
 * Principle: SRP — owns all validation + authorisation for a test service submission.
 * Principle: Security — MIME validated in rules(); service ownership validated in withValidator().
 */
class StoreTestServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'idempotency_key' => ['required', 'string', 'uuid'],
            'service_type_id' => ['required', 'integer', 'exists:service_types,id'],
            'full_name'       => ['required', 'string', 'max:255'],
            'phone'           => ['required', 'string', 'max:30'],
            'photo'           => [
                'required',
                File::image()->max(10 * 1024), // 10 MB — images only
            ],
        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator): void
    {
        $validator->after(function (\Illuminate\Validation\Validator $v): void {
            if ($v->errors()->has('service_type_id')) {
                return;
            }

            /** @var ServiceType|null $type */
            $type = ServiceType::with('service')
                ->where('is_active', true)
                ->find($this->integer('service_type_id'));

            if ($type === null) {
                $v->errors()->add('service_type_id', 'The selected service type is inactive.');
                return;
            }

            if ($type->service->slug !== 'test-service') {
                $v->errors()->add(
                    'service_type_id',
                    'The selected service type does not belong to the Test Service.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'idempotency_key.uuid'   => 'The idempotency key must be a valid UUID.',
            'service_type_id.exists' => 'The selected service type does not exist.',
            'photo.image'            => 'The photo must be an image file.',
        ];
    }

    public function attributes(): array
    {
        return [
            'service_type_id' => 'service type',
            'full_name'       => 'full name',
        ];
    }
}
