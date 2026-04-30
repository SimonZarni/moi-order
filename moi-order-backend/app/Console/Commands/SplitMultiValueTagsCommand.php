<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Tag;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SplitMultiValueTagsCommand extends Command
{
    protected $signature   = 'tags:split-multi-value';
    protected $description = 'Split rows in the tags table that contain multiple ၊-separated values into individual tag rows and fix place_tag links.';

    public function handle(): int
    {
        $multiValueTags = Tag::where('name_my', 'like', '%၊%')->get();

        if ($multiValueTags->isEmpty()) {
            $this->info('No multi-value tags found. Nothing to do.');
            return self::SUCCESS;
        }

        $this->info("Found {$multiValueTags->count()} multi-value tag(s) to split.");

        DB::transaction(function () use ($multiValueTags): void {
            foreach ($multiValueTags as $oldTag) {
                $nameMys = array_values(array_filter(array_map('trim', preg_split('/[,၊]/', $oldTag->name_my))));
                $nameEns = array_values(array_filter(array_map('trim', preg_split('/[,၊]/', $oldTag->name_en))));
                $nameThs = array_values(array_filter(array_map('trim', preg_split('/[,၊]/', $oldTag->name_th))));

                $placeIds = DB::table('place_tag')->where('tag_id', $oldTag->id)->pluck('place_id');

                $newTagIds = [];
                foreach ($nameMys as $i => $nameMy) {
                    $nameEn = $this->sanitize($nameEns[$i] ?? $nameMy);
                    $nameTh = $this->sanitize($nameThs[$i] ?? $nameMy);
                    $nameMy = $this->sanitize($nameMy);

                    if ($nameMy === '') continue;

                    $tag = Tag::firstOrCreate(
                        ['name_en' => $nameEn],
                        [
                            'name_my' => $nameMy,
                            'name_th' => $nameTh,
                            'slug'    => $this->uniqueSlug($nameEn),
                        ]
                    );

                    $newTagIds[] = $tag->id;
                    $this->line("  → '{$nameMy}' (id={$tag->id})");
                }

                // Re-link each place to every individual split tag.
                // insertOrIgnore handles the case where an individual tag was already linked.
                if ($placeIds->isNotEmpty()) {
                    $rows = [];
                    foreach ($placeIds as $placeId) {
                        foreach ($newTagIds as $tagId) {
                            $rows[] = ['place_id' => $placeId, 'tag_id' => $tagId];
                        }
                    }
                    DB::table('place_tag')->insertOrIgnore($rows);
                }

                // Remove old place_tag links first (FK prevents forceDelete otherwise).
                DB::table('place_tag')->where('tag_id', $oldTag->id)->delete();
                $oldTag->forceDelete();

                $this->info("  Split tag id={$oldTag->id} into " . count($newTagIds) . ' individual tag(s).');
            }
        });

        $this->info('Done.');
        return self::SUCCESS;
    }

    private function sanitize(string $str): string
    {
        // Pure-PHP UTF-8 validator — strips only invalid byte sequences while
        // preserving all valid ones (including 3-byte Myanmar characters).
        // Avoids iconv/mbstring locale issues on Windows.
        $out = '';
        $len = strlen($str);
        $i   = 0;
        while ($i < $len) {
            $b = ord($str[$i]);
            if ($b < 0x80) {
                // Single-byte ASCII
                $out .= $str[$i++];
            } elseif ($b < 0xC2) {
                // Invalid start byte (lone continuation or overlong)
                $i++;
            } elseif ($b < 0xE0) {
                // 2-byte sequence
                if ($i + 1 < $len && (ord($str[$i + 1]) & 0xC0) === 0x80) {
                    $out .= substr($str, $i, 2);
                    $i   += 2;
                } else { $i++; }
            } elseif ($b < 0xF0) {
                // 3-byte sequence (covers all Myanmar U+1000–U+109F)
                if ($i + 2 < $len && (ord($str[$i + 1]) & 0xC0) === 0x80 && (ord($str[$i + 2]) & 0xC0) === 0x80) {
                    $out .= substr($str, $i, 3);
                    $i   += 3;
                } else { $i++; }
            } elseif ($b < 0xF8) {
                // 4-byte sequence (emoji / supplementary planes)
                if ($i + 3 < $len && (ord($str[$i + 1]) & 0xC0) === 0x80 && (ord($str[$i + 2]) & 0xC0) === 0x80 && (ord($str[$i + 3]) & 0xC0) === 0x80) {
                    $out .= substr($str, $i, 4);
                    $i   += 4;
                } else { $i++; }
            } else {
                $i++;
            }
        }
        return $out;
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base !== '' ? $base : 'tag-' . Str::random(6);
        $i    = 1;

        while (DB::table('tags')->where('slug', $slug)->whereNull('deleted_at')->exists()) {
            $slug = ($base !== '' ? $base : 'tag') . "-{$i}";
            $i++;
        }

        return $slug;
    }
}
