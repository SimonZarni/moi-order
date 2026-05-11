<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AppAlertFrequency;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int                $id
 * @property string             $title
 * @property string             $message
 * @property string|null        $image_path
 * @property AppAlertFrequency  $frequency
 * @property bool               $is_active
 * @property int|null           $created_by
 * @property \Carbon\Carbon     $created_at
 * @property \Carbon\Carbon     $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class InAppAlert extends Model
{
    use SoftDeletes;

    protected $table = 'in_app_alerts';

    /** @var list<string> */
    protected $fillable = [
        'title',
        'message',
        'image_path',
        'frequency',
        'is_active',
        'created_by',
    ];

    /** @return array<string, mixed> */
    protected function casts(): array
    {
        return [
            'frequency' => AppAlertFrequency::class,
            'is_active' => 'boolean',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
