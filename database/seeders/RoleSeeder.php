<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin Role
        $superAdmin = Role::create([
            'name' => 'super-admin',
            'description' => 'Full access to all features'
        ]);

        // Assign all permissions to super-admin
        $superAdmin->givePermissionTo(Permission::all());

        // Create Admin Role
        $admin = Role::create([
            'name' => 'admin',
            'description' => 'Administrative access with some restrictions'
        ]);

        // Assign specific permissions to admin
        $admin->givePermissionTo([
            'view users',
            'create users',
            'edit users',
            'view roles',
            'view settings',
        ]);
    }
}
