<?php

declare(strict_types=1);

namespace App\Contracts;

use Illuminate\Http\UploadedFile;

interface ImageProviderInterface
{
    /**
     * Fetch $count images for the given search query.
     *
     * @return array<UploadedFile>
     */
    public function fetchImages(string $query, int $count = 5): array;
}
