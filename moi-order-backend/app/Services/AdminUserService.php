<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminUpdateUserDTO;
use App\Http\Requests\Admin\AdminUserIndexRequest;
use App\Models\User;
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

    public function destroy(User $user): void
    {
        // Revoke all tokens before soft-deleting — defence in depth.
        $user->tokens()->delete();
        $user->delete();
    }
}
