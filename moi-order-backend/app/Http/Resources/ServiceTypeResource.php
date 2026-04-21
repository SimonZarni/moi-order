<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes the service type HTTP response only.
 * Principle: Security — price exposed as raw satangs; client formats for display.
 *   Never expose is_active, deleted_at, or internal service_id in list context.
 */
class ServiceTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'name_en'      => $this->name_en,
            'name_mm'      => $this->name_mm,
            'price'        => $this->price, // satangs
            'field_schema' => $this->resolvedFieldSchema(),
            'service'      => $this->when(
                $this->relationLoaded('service'),
                fn () => [
                    'id'      => $this->service->id,
                    'name'    => $this->service->name,
                    'name_en' => $this->service->name_en,
                    'name_mm' => $this->service->name_mm,
                ],
            ),
        ];
    }

    /** Fill missing label_en / label_mm on file fields from document_types. */
    private function resolvedFieldSchema(): array
    {
        $schema = $this->field_schema ?? [];

        $missingSlugs = collect($schema)
            ->filter(fn (array $f) => ($f['type'] ?? '') === 'file'
                && ! empty($f['document_type'])
                && (empty($f['label_en']) || empty($f['label_mm'])))
            ->pluck('document_type')
            ->unique()
            ->values()
            ->all();

        if (empty($missingSlugs)) {
            return $schema;
        }

        $docTypes = DocumentType::whereIn('slug', $missingSlugs)
            ->get(['slug', 'name_en', 'name_mm'])
            ->keyBy('slug');

        return array_map(function (array $field) use ($docTypes): array {
            if (($field['type'] ?? '') !== 'file' || empty($field['document_type'])) {
                return $field;
            }

            $dt = $docTypes->get($field['document_type']);
            if (! $dt) {
                return $field;
            }

            if (empty($field['label_en'])) {
                $field['label_en'] = $dt->name_en;
            }
            if (empty($field['label_mm'])) {
                $field['label_mm'] = $dt->name_mm;
            }

            return $field;
        }, $schema);
    }
}
