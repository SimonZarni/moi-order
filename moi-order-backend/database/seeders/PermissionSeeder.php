<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\AdminRole;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /** @var array<array{key:string,label:string,group:string}> */
    private const PERMISSIONS = [
        ['key' => 'services.create',        'label' => 'Create Services',       'group' => 'Services'],
        ['key' => 'services.update',         'label' => 'Edit Services',         'group' => 'Services'],
        ['key' => 'services.delete',         'label' => 'Delete Services',       'group' => 'Services'],
        ['key' => 'service_types.create',    'label' => 'Create Service Types',  'group' => 'Service Types'],
        ['key' => 'service_types.update',    'label' => 'Edit Service Types',    'group' => 'Service Types'],
        ['key' => 'service_types.delete',    'label' => 'Delete Service Types',  'group' => 'Service Types'],
        ['key' => 'submissions.view',        'label' => 'View Submissions',      'group' => 'Submissions'],
        ['key' => 'submissions.manage',      'label' => 'Manage Submissions',    'group' => 'Submissions'],
        ['key' => 'payments.view',           'label' => 'View Payments',         'group' => 'Payments'],
        ['key' => 'payments.manage',         'label' => 'Manage Payments',       'group' => 'Payments'],
        ['key' => 'users.manage',            'label' => 'Manage Users',          'group' => 'Users'],
        ['key' => 'users.delete',            'label' => 'Delete Users',          'group' => 'Users'],
        ['key' => 'admins.manage',           'label' => 'Manage Admin Roles',    'group' => 'Admins'],
        ['key' => 'places.create',           'label' => 'Create Places',         'group' => 'Places'],
        ['key' => 'places.update',           'label' => 'Edit Places',           'group' => 'Places'],
        ['key' => 'places.delete',           'label' => 'Delete Places',         'group' => 'Places'],
        ['key' => 'restaurants.manage',      'label' => 'Manage Restaurants',    'group' => 'Restaurants'],
        ['key' => 'document_types.manage',   'label' => 'Manage Document Types', 'group' => 'Document Types'],
    ];

    public function run(): void
    {
        foreach (self::PERMISSIONS as $data) {
            Permission::firstOrCreate(['key' => $data['key']], $data);
        }

        $superAdmin = AdminRole::firstOrCreate(
            ['slug' => 'super_admin'],
            ['label' => 'Super Admin'],
        );

        $admin = AdminRole::firstOrCreate(
            ['slug' => 'admin'],
            ['label' => 'Admin'],
        );

        $allIds = Permission::pluck('id')->all();

        // Super admin always has all permissions; admin starts with all (super admin unchecks from UI).
        $superAdmin->permissions()->sync($allIds);
        $admin->permissions()->sync($allIds);

        // Assign all existing admin users the super_admin role as a safe migration default.
        User::where('is_admin', true)
            ->whereNull('admin_role_id')
            ->update(['admin_role_id' => $superAdmin->id]);
    }
}
