<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\UserStatusEnum;
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
        'is_admin',
        'status',
        'google_id',
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
            'is_admin'          => 'boolean',
            'status'            => UserStatusEnum::class,
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    /** Principle: Tell-Don't-Ask — consumers ask the model, not the raw flag. */
    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }

    /** Returns true for suspended or banned — any state that blocks access. */
    public function isRestricted(): bool
    {
        return $this->status->isRestricted();
    }

    public function suspend(): void
    {
        $this->update(['status' => UserStatusEnum::Suspended]);
    }

    public function ban(): void
    {
        $this->update(['status' => UserStatusEnum::Banned]);
    }

    public function activate(): void
    {
        $this->update(['status' => UserStatusEnum::Active]);
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
