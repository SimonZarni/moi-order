<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\StoreCompanyRegistrationRequest;
use Illuminate\Http\UploadedFile;

/**
 * Principle: SRP — plain data carrier for one operation; no business logic.
 * Principle: DIP — Controller extracts this from the Request; Service receives only primitives + files.
 * Principle: Immutability — all properties readonly; cannot be mutated after construction.
 */
readonly class CreateCompanyRegistrationDTO
{
    public function __construct(
        public int          $userId,
        public int          $serviceTypeId,
        public string       $fullName,
        public string       $phone,
        public string       $idempotencyKey,
        public UploadedFile $passportBioPage,
        public UploadedFile $visaPage,
        public UploadedFile $identityCardFront,
        public UploadedFile $identityCardBack,
        public UploadedFile $tm30,
    ) {}

    public static function fromRequest(StoreCompanyRegistrationRequest $request): self
    {
        return new self(
            userId:            $request->user()->id,
            serviceTypeId:     $request->integer('service_type_id'),
            fullName:          $request->string('full_name')->toString(),
            phone:             $request->string('phone')->toString(),
            idempotencyKey:    $request->string('idempotency_key')->toString(),
            passportBioPage:   $request->file('passport_bio_page'),
            visaPage:          $request->file('visa_page'),
            identityCardFront: $request->file('identity_card_front'),
            identityCardBack:  $request->file('identity_card_back'),
            tm30:              $request->file('tm30'),
        );
    }
}
