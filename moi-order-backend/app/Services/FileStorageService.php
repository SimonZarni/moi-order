<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use InvalidArgumentException;

/**
 * Principle: SRP — one concern: store and serve files on the local private disk.
 * Principle: OCP — swap to S3 by creating an S3FileStorageService and rebinding.
 * Principle: DIP — receives Filesystem via constructor; never calls Storage::disk() directly.
 *
 * Security:
 *  - Files stored in storage/app/private/ (outside public/).
 *  - Original filename never persisted — UUID-renamed.
 *  - MIME validated server-side against allowed list (not just extension).
 *  - URLs are signed with a 30-minute TTL by default.
 */
class FileStorageService implements FileStorageInterface
{
    /** Allowed MIME types for image uploads. */
    private const ALLOWED_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ];

    public function __construct(private readonly FilesystemAdapter $disk) {}

    /**
     * {@inheritdoc}
     *
     * @throws InvalidArgumentException if the MIME type is not allowed.
     */
    public function store(UploadedFile $file, string $directory, array $allowedMimes = []): string
    {
        $this->validateMime($file, $allowedMimes);

        $extension = $file->extension();
        $filename  = Str::uuid()->toString().'.'.$extension;
        $path      = ltrim($directory, '/').'/'.$filename;

        $this->disk->putFileAs(ltrim($directory, '/'), $file, $filename);

        return $path;
    }

    /**
     * {@inheritdoc}
     */
    public function url(string $path, int $minutesTtl = 30): string
    {
        try {
            return $this->disk->temporaryUrl($path, now()->addMinutes($minutesTtl));
        } catch (\RuntimeException) {
            // Local/public disk drivers do not support temporary URLs.
            // Fall back to a permanent public URL (acceptable for local dev;
            // in production swap the binding to an S3 adapter).
            return $this->disk->url($path);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function delete(string $path): void
    {
        $this->disk->delete($path);
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    /**
     * @param  array<string>  $allowedMimes  Per-call override; falls back to ALLOWED_MIMES when empty.
     */
    private function validateMime(UploadedFile $file, array $allowedMimes = []): void
    {
        $list = empty($allowedMimes) ? self::ALLOWED_MIMES : $allowedMimes;
        $mime = $file->getMimeType(); // reads file content, not just extension

        if (! in_array($mime, $list, strict: true)) {
            throw new InvalidArgumentException(
                "Unsupported MIME type [{$mime}]. Allowed: ".implode(', ', $list)
            );
        }
    }
}
