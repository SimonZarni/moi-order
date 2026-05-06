<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmergencyContactPhoto extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'emergency_contact_id',
        'path',
        'is_cover',
        'position',
    ];

    protected function casts(): array
    {
        return [
            'is_cover' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(EmergencyContact::class, 'emergency_contact_id');
    }
}
