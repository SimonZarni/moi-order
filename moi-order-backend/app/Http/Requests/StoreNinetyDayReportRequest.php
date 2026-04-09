<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

/**
 * Principle: SRP — owns all validation + authorisation for a 90-day report submission.
 * Principle: Security — MIME validated in rules(); service ownership validated in withValidator().
 *   File rules use Laravel's File rule builder for explicit MIME + size control.
 */
class StoreNinetyDayReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Auth enforced by middleware; any authenticated user may submit.
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'idempotency_key'  => ['required', 'string', 'uuid'],
            'service_type_id'  => ['required', 'integer', 'exists:service_types,id'],
            'full_name'        => ['required', 'string', 'max:255'],
            'phone'            => ['required', 'string', 'max:30'],
            'passport_bio_page' => [
                'required',
                File::image()->max(10 * 1024), // 10 MB
            ],
            'visa_page' => [
                'required',
                File::image()->max(10 * 1024),
            ],
            'old_slip' => [
                'required',
                File::image()->max(10 * 1024),
            ],
        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator): void
    {
        $validator->after(function (\Illuminate\Validation\Validator $v): void {
            // Skip cross-field check if basic field validation already failed.
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

            if ($type->service->slug !== '90-day-report') {
                $v->errors()->add(
                    'service_type_id',
                    'The selected service type does not belong to the 90-Day Report service.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'idempotency_key.uuid'     => 'The idempotency key must be a valid UUID.',
            'service_type_id.exists'   => 'The selected service type does not exist.',
            'passport_bio_page.image'  => 'The passport bio page must be an image file.',
            'visa_page.image'          => 'The visa page must be an image file.',
            'old_slip.image'           => 'The old slip must be an image file.',
        ];
    }

    public function attributes(): array
    {
        return [
            'service_type_id'  => 'service type',
            'full_name'        => 'full name',
            'passport_bio_page' => 'passport bio page image',
            'visa_page'        => 'visa page image',
            'old_slip'         => 'old 90-day report slip image',
        ];
    }
}
