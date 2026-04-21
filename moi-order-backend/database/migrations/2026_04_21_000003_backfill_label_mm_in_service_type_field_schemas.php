<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $docTypes = DB::table('document_types')
            ->whereNull('deleted_at')
            ->get(['slug', 'name_en', 'name_mm'])
            ->keyBy('slug');

        DB::table('service_types')
            ->whereNotNull('field_schema')
            ->cursor()
            ->each(function (object $row) use ($docTypes): void {
                $schema = json_decode($row->field_schema, true);
                if (! is_array($schema)) {
                    return;
                }

                $updated = false;

                foreach ($schema as &$field) {
                    if (($field['type'] ?? '') !== 'file') {
                        continue;
                    }

                    $slug = $field['document_type'] ?? null;
                    if (! $slug) {
                        continue;
                    }

                    $dt = $docTypes->get($slug);
                    if (! $dt) {
                        continue;
                    }

                    if (empty($field['label_en']) && $dt->name_en) {
                        $field['label_en'] = $dt->name_en;
                        $updated = true;
                    }

                    if (empty($field['label_mm']) && $dt->name_mm) {
                        $field['label_mm'] = $dt->name_mm;
                        $updated = true;
                    }
                }
                unset($field);

                if ($updated) {
                    DB::table('service_types')
                        ->where('id', $row->id)
                        ->update(['field_schema' => json_encode($schema)]);
                }
            });
    }

    public function down(): void
    {
        // Intentionally not reversed — restoring null labels would discard
        // any valid Burmese content that may have been present before.
    }
};
