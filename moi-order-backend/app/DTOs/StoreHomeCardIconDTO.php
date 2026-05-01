<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\StoreHomeCardIconRequest;
use Illuminate\Http\UploadedFile;

readonly class StoreHomeCardIconDTO
{
    public function __construct(
        public string       $key,
        public string       $label,
        public UploadedFile $image,
    ) {}

    public static function fromRequest(StoreHomeCardIconRequest $request): self
    {
        return new self(
            key:   $request->string('key')->toString(),
            label: $request->string('label')->toString(),
            image: $request->file('image'),
        );
    }
}
