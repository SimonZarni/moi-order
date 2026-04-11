<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

/**
 * Principle: SRP — owns all validation + authorisation for an airport fast track submission.
 * Principle: Security — MIME validated in rules(); service ownership validated in withValidator().
 *   upper_body_photo: images only.
 *   airplane_ticket: images + PDF (the only file type in this project that accepts PDFs).
 */
class StoreAirportFastTrackRequest extends FormRequest
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
            'upper_body_photo' => [
                'required',
                File::image()->max(10 * 1024), // 10 MB — images only
            ],
            'airplane_ticket'  => [
                'required',
                File::types(['jpg', 'jpeg', 'png', 'webp', 'pdf'])->max(10 * 1024), // images + PDF
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

            if ($type->service->slug !== 'airport-fast-track') {
                $v->errors()->add(
                    'service_type_id',
                    'The selected service type does not belong to the Airport Fast Track service.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'idempotency_key.uuid'      => 'The idempotency key must be a valid UUID.',
            'service_type_id.exists'    => 'The selected service type does not exist.',
            'upper_body_photo.image'    => 'The upper body photo must be an image file.',
            'airplane_ticket.mimes'     => 'The airplane ticket must be an image or PDF file.',
        ];
    }

    public function attributes(): array
    {
        return [
            'service_type_id'  => 'service type',
            'full_name'        => 'full name',
            'upper_body_photo' => 'upper half body photo',
            'airplane_ticket'  => 'airplane ticket',
        ];
    }
}
