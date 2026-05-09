<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\UserRole;
use App\Enums\UserStatusEnum;
use Carbon\Carbon;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Document;
use App\Models\TicketOrder;
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
        'locale',
        'phone_number',
        'password',
        'date_of_birth',
        'is_admin',
        'admin_role_id',
        'is_merchant',
        'status',
        'suspended_until',
        'google_id',
        'apple_id',
        'line_id',
        'profile_picture_path',
        'last_active_at',
        'user_role',
        'simulated_date',
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
            'is_merchant'       => 'boolean',
            'status'            => UserStatusEnum::class,
            'user_role'         => UserRole::class,
            'suspended_until'   => 'datetime',
            'last_active_at'    => 'datetime',
            'simulated_date'    => 'date:Y-m-d',
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    /** Principle: Tell-Don't-Ask — consumers ask the model, not the raw flag. */
    public function isPrivileged(): bool
    {
        return $this->user_role === UserRole::Privileged;
    }

    /**
     * The date to use for 90-day notification calculations.
     * Privileged users may override with a simulated date for testing;
     * all other users — and privileged users with no override — get Thai time today.
     */
    public function effectiveDate(): Carbon
    {
        if ($this->isPrivileged() && $this->simulated_date !== null) {
            return $this->simulated_date;
        }

        return Carbon::today();
    }

    public function grantRole(UserRole $role): void
    {
        $this->update(['user_role' => $role->value]);
    }

    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }

    public function isSuperAdmin(): bool
    {
        return $this->adminRole?->slug === 'super_admin';
    }

    public function isMerchant(): bool
    {
        return $this->is_merchant === true;
    }

    /**
     * Banned  → always restricted.
     * Suspended → restricted only while suspended_until is null (indefinite) or in the future.
     *             A past suspended_until means the suspension has naturally expired.
     */
    public function isRestricted(): bool
    {
        return match ($this->status) {
            UserStatusEnum::Banned    => true,
            UserStatusEnum::Suspended => $this->suspended_until === null || $this->suspended_until->isFuture(),
            UserStatusEnum::Active    => false,
        };
    }

    public function suspend(?Carbon $until = null): void
    {
        $this->update([
            'status'          => UserStatusEnum::Suspended,
            'suspended_until' => $until,
        ]);
    }

    public function ban(): void
    {
        $this->update([
            'status'          => UserStatusEnum::Banned,
            'suspended_until' => null,
        ]);
    }

    public function activate(): void
    {
        $this->update([
            'status'          => UserStatusEnum::Active,
            'suspended_until' => null,
        ]);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function adminRole(): BelongsTo
    {
        return $this->belongsTo(AdminRole::class, 'admin_role_id');
    }

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

    public function deviceTokens(): HasMany
    {
        return $this->hasMany(DeviceToken::class);
    }

    public function restaurant(): HasOne
    {
        return $this->hasOne(Restaurant::class);
    }

    public function kycApplication(): HasOne
    {
        return $this->hasOne(KycApplication::class)->latestOfMany();
    }

    public function foodOrders(): HasMany
    {
        return $this->hasMany(FoodOrder::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function ticketOrders(): HasMany
    {
        return $this->hasMany(TicketOrder::class);
    }

    /** Online = made an API request within the last 5 minutes. */
    public function isOnline(): bool
    {
        return $this->last_active_at !== null
            && $this->last_active_at->isAfter(now()->subMinutes(5));
    }
}
