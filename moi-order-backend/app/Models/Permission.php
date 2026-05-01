<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    protected $fillable = ['key', 'label', 'group'];

    public function adminRoles(): BelongsToMany
    {
        return $this->belongsToMany(AdminRole::class, 'role_permissions');
    }
}
