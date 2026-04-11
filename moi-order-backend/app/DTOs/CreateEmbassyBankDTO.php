<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\StoreEmbassyBankRequest;
use Illuminate\Http\UploadedFile;

/**
 * Principle: SRP — plain data carrier for one operation; no business logic.
 * Principle: DIP — Controller extracts this from the Request; Service receives only primitives + files.
 * Principle: Immutability — all properties readonly; cannot be mutated after construction.
 */
readonly class CreateEmbassyBankDTO
{
    public function __construct(
        public int          $userId,
        public int          $serviceTypeId,
        public string       $idempotencyKey,
        public string       $fullName,
        public string       $passportNo,
        public string       $identityCardNo,
        public ?string      $currentJob,
        public ?string      $company,
        public string       $myanmarAddress,
        public string       $thaiAddress,
        public string       $phone,
        public string       $bankName,
        public UploadedFile $passportSizePhoto,
        public UploadedFile $passportBioPage,
        public UploadedFile $visaPage,
        public UploadedFile $identityCardFront,
        public UploadedFile $identityCardBack,
        public UploadedFile $tm30,
    ) {}

    public static function fromRequest(StoreEmbassyBankRequest $request): self
    {
        return new self(
            userId:            $request->user()->id,
            serviceTypeId:     $request->integer('service_type_id'),
            idempotencyKey:    $request->string('idempotency_key')->toString(),
            fullName:          $request->string('full_name')->toString(),
            passportNo:        $request->string('passport_no')->toString(),
            identityCardNo:    $request->string('identity_card_no')->toString(),
            currentJob:        $request->filled('current_job') ? $request->string('current_job')->toString() : null,
            company:           $request->filled('company') ? $request->string('company')->toString() : null,
            myanmarAddress:    $request->string('myanmar_address')->toString(),
            thaiAddress:       $request->string('thai_address')->toString(),
            phone:             $request->string('phone')->toString(),
            bankName:          $request->string('bank_name')->toString(),
            passportSizePhoto: $request->file('passport_size_photo'),
            passportBioPage:   $request->file('passport_bio_page'),
            visaPage:          $request->file('visa_page'),
            identityCardFront: $request->file('identity_card_front'),
            identityCardBack:  $request->file('identity_card_back'),
            tm30:              $request->file('tm30'),
        );
    }
}
