<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'type',
        'file_path',
        'subtype',
        'extracted_data',
        'expiry_date',
        'extension_date',
        'is_valid_type',
        'validation_message',
        'is_admin_created',
    ];

    protected $casts = [
        'type'             => DocumentType::class,
        'file_path'        => 'encrypted',
        'extracted_data'   => 'encrypted:array',
        'expiry_date'      => 'date:Y-m-d',
        'extension_date'   => 'date:Y-m-d',
        'is_valid_type'    => 'boolean',
        'is_admin_created' => 'boolean',
    ];

    protected $hidden = ['file_path'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser(Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }

    public function scopeOfType(Builder $query, DocumentType $type): void
    {
        $query->where('type', $type->value);
    }
}
