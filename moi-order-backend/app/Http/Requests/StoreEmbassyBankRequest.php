<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

/**
 * Principle: SRP — owns all validation + authorisation for an embassy bank submission.
 * Principle: Security — MIME validated in rules(); service ownership validated in withValidator().
 *   All identity documents and passport size photo: images only.
 *   TM30: images + PDF (digital TM30s are commonly issued as PDF).
 */
class StoreEmbassyBankRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'idempotency_key'     => ['required', 'string', 'uuid'],
            'service_type_id'     => ['required', 'integer', 'exists:service_types,id'],
            'full_name'           => ['required', 'string', 'max:255'],
            'passport_no'         => ['required', 'string', 'max:50'],
            'identity_card_no'    => ['required', 'string', 'max:50'],
            'current_job'         => ['nullable', 'string', 'max:255'],
            'company'             => ['nullable', 'string', 'max:255'],
            'myanmar_address'     => ['required', 'string', 'max:500'],
            'thai_address'        => ['required', 'string', 'max:500'],
            'phone'               => ['required', 'string', 'max:30'],
            'bank_name'           => ['required', 'string', 'max:255'],
            'passport_size_photo' => ['required', File::image()->max(10 * 1024)],
            'passport_bio_page'   => ['required', File::image()->max(10 * 1024)],
            'visa_page'           => ['required', File::image()->max(10 * 1024)],
            'identity_card_front' => ['required', File::image()->max(10 * 1024)],
            'identity_card_back'  => ['required', File::image()->max(10 * 1024)],
            'tm30'                => ['required', File::types(['jpg', 'jpeg', 'png', 'webp', 'pdf'])->max(10 * 1024)],
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

            if ($type->service->slug !== 'embassy-bank-service') {
                $v->errors()->add(
                    'service_type_id',
                    'The selected service type does not belong to the Embassy Bank service.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'idempotency_key.uuid'         => 'The idempotency key must be a valid UUID.',
            'service_type_id.exists'       => 'The selected service type does not exist.',
            'passport_size_photo.image'    => 'The passport size photo must be an image file.',
            'passport_bio_page.image'      => 'The passport bio page must be an image file.',
            'visa_page.image'              => 'The visa page must be an image file.',
            'identity_card_front.image'    => 'The identity card front must be an image file.',
            'identity_card_back.image'     => 'The identity card back must be an image file.',
            'tm30.mimes'                   => 'The TM30 must be an image or PDF file.',
        ];
    }

    public function attributes(): array
    {
        return [
            'service_type_id'     => 'service type',
            'full_name'           => 'full name',
            'passport_no'         => 'passport number',
            'identity_card_no'    => 'identity card number',
            'current_job'         => 'current job',
            'myanmar_address'     => 'Myanmar address',
            'thai_address'        => 'Thai address',
            'bank_name'           => 'bank name',
            'passport_size_photo' => 'passport size photo',
            'passport_bio_page'   => 'passport bio page',
            'visa_page'           => 'visa page',
            'identity_card_front' => 'identity card front',
            'identity_card_back'  => 'identity card back',
            'tm30'                => 'TM30',
        ];
    }
}
