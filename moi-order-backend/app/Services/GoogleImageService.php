<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ImageProviderInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Principle: SRP — one concern: fetch images from Google Custom Search API.
 * Principle: DIP — bound via ImageProviderInterface; swap provider without touching callers.
 */
class GoogleImageService implements ImageProviderInterface
{
    private const API_URL = 'https://www.googleapis.com/customsearch/v1';

    public function __construct(
        private readonly string $apiKey,
        private readonly string $searchEngineId,
    ) {}

    /**
     * {@inheritdoc}
     */
    public function fetchImages(string $query, int $count = 5): array
    {
        $response = Http::timeout(15)->get(self::API_URL, [
            'key'        => $this->apiKey,
            'cx'         => $this->searchEngineId,
            'q'          => $query,
            'searchType' => 'image',
            'num'        => min($count, 10),
            'imgType'    => 'photo',
            'safe'       => 'active',
        ]);

        if ($response->failed()) {
            throw new RuntimeException("Google Custom Search API returned {$response->status()} for query [{$query}]");
        }

        $items = $response->json('items', []);
        $files = [];

        foreach ($items as $item) {
            $url = $item['link'] ?? null;
            if ($url === null) {
                continue;
            }

            try {
                $imageResponse = Http::timeout(30)->get($url);
                if ($imageResponse->failed()) {
                    continue;
                }

                $contentType = $imageResponse->header('Content-Type') ?? 'image/jpeg';
                $mime        = explode(';', $contentType)[0];

                if (! in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], strict: true)) {
                    continue;
                }

                $extension = match ($mime) {
                    'image/png'  => 'png',
                    'image/webp' => 'webp',
                    default      => 'jpg',
                };

                $tempPath = tempnam(sys_get_temp_dir(), 'gcs_');
                file_put_contents($tempPath, $imageResponse->body());

                $files[] = new UploadedFile(
                    $tempPath,
                    Str::uuid()->toString().'.'.$extension,
                    $mime,
                    null,
                    true,
                );
            } catch (\Throwable $e) {
                Log::debug('GoogleImageService: skipping image', ['url' => $url, 'error' => $e->getMessage()]);
                continue;
            }
        }

        return $files;
    }
}
