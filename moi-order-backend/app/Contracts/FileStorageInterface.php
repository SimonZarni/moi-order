<?php

declare(strict_types=1);

namespace App\Contracts;

use Illuminate\Http\UploadedFile;

/**
 * Principle: ISP — only what consumers need: store, serve, delete.
 * Principle: DIP — callers depend on this abstraction, not Storage::disk() directly.
 */
interface FileStorageInterface
{
    /**
     * Store an uploaded file outside public/, UUID-named.
     * Returns the stored path (opaque — never expose to clients).
     */
    public function store(UploadedFile $file, string $directory): string;

    /**
     * Generate a signed temporary URL for the given stored path.
     *
     * @param  int  $minutesTtl  Defaults to 30 minutes per security policy.
     */
    public function url(string $path, int $minutesTtl = 30): string;

    /**
     * Delete the file at the given stored path.
     */
    public function delete(string $path): void;
}
