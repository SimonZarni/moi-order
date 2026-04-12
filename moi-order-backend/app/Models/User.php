<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Principle: Encapsulation — state changes via domain methods only.
 * Principle: SRP — single entity with its own domain methods and scopes.
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     * Principle: Security — $fillable closed; never $guarded=[].
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'date_of_birth',
    ];

    /**
     * The attributes that should be hidden for serialization.
     * Principle: Security — sensitive fields never exposed.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'date_of_birth'     => 'date:Y-m-d',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function favoritePlaces(): BelongsToMany
    {
        return $this->belongsToMany(Place::class, 'favorite_places')->withTimestamps();
    }

    public function favoritePlaceRecords(): HasMany
    {
        return $this->hasMany(FavoritePlace::class);
    }

    public function serviceSubmissions(): HasMany
    {
        return $this->hasMany(ServiceSubmission::class);
    }
}
