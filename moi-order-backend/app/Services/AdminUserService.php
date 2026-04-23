<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminCreateUserDTO;
use App\DTOs\AdminUpdateUserDTO;
use App\Enums\UserStatusEnum;
use App\Exceptions\DomainException;
use App\Http\Requests\Admin\AdminUserIndexRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Principle: SRP — owns admin user management logic only.
 * Security: soft-delete revokes all tokens (principle of least privilege).
 */
class AdminUserService
{
    public function index(AdminUserIndexRequest $request): LengthAwarePaginator
    {
        $query = User::withTrashed()
            ->withCount('serviceSubmissions')
            ->latest();

        if ($request->filled('search')) {
            $term = $request->string('search')->toString();
            $query->where(function ($q) use ($term): void {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->string('date_from')->toString());
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->string('date_to')->toString());
        }

        return $query->paginate($request->integer('per_page', 20));
    }

    public function show(User $user): User
    {
        return $user->load('serviceSubmissions.serviceType.service');
    }

    public function update(User $user, AdminUpdateUserDTO $dto): User
    {
        $user->update(array_filter([
            'name'          => $dto->name,
            'email'         => $dto->email,
            'date_of_birth' => $dto->dateOfBirth,
        ], fn ($v) => $v !== null));

        return $user->fresh();
    }

    public function store(AdminCreateUserDTO $dto): User
    {
        return User::create([
            'name'          => $dto->name,
            'email'         => $dto->email,
            'password'      => $dto->password,
            'date_of_birth' => $dto->dateOfBirth,
            'is_admin'      => $dto->isAdmin,
        ]);
    }

    public function restore(int $id): User
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        return $user->fresh();
    }

    public function toggleAdmin(User $user): User
    {
        // Prevent the only admin from revoking their own admin role — system would become unmanageable.
        if ($user->is_admin && User::where('is_admin', true)->count() === 1) {
            throw new DomainException('user.last_admin_cannot_be_demoted');
        }

        $user->update(['is_admin' => ! $user->is_admin]);

        return $user->fresh();
    }

    public function destroy(User $user, User $actor): void
    {
        if ($actor->id === $user->id) {
            throw new DomainException('user.cannot_delete_self');
        }

        if ($user->is_admin && $this->isLastActiveAdmin($user)) {
            throw new DomainException('user.last_admin_cannot_be_deleted');
        }

        // Revoke all tokens before soft-deleting — defence in depth.
        $user->tokens()->delete();
        $user->delete();
    }

    public function suspend(User $user, User $actor, ?Carbon $until): User
    {
        if ($actor->id === $user->id) {
            throw new DomainException('user.cannot_restrict_self');
        }

        if ($user->deleted_at !== null) {
            throw new DomainException('user.cannot_restrict_deleted_user');
        }

        if ($user->is_admin && $this->isLastActiveAdmin($user)) {
            throw new DomainException('user.last_admin_cannot_be_restricted');
        }

        $user->tokens()->delete();
        $user->suspend($until);

        return $user->fresh();
    }

    public function ban(User $user, User $actor): User
    {
        if ($actor->id === $user->id) {
            throw new DomainException('user.cannot_restrict_self');
        }

        if ($user->deleted_at !== null) {
            throw new DomainException('user.cannot_restrict_deleted_user');
        }

        if ($user->is_admin && $this->isLastActiveAdmin($user)) {
            throw new DomainException('user.last_admin_cannot_be_restricted');
        }

        $user->tokens()->delete();
        $user->ban();

        return $user->fresh();
    }

    public function activate(User $user): User
    {
        $user->activate();

        return $user->fresh();
    }

    /** True when this admin is the only one who is active and not soft-deleted. */
    private function isLastActiveAdmin(User $user): bool
    {
        return $user->is_admin
            && User::where('is_admin', true)
                ->where('status', UserStatusEnum::Active->value)
                ->whereNull('deleted_at')
                ->count() === 1;
    }
}
