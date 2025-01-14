<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\User;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Roles/Index', [
            'roles' => Role::with(['permissions', 'users'])->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Roles/Create', [
            'permissions' => Permission::all(),
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $role = Role::create([
            'name' => $request->name,
        ]);

        $role->syncPermissions($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role created successfully');
    }

    public function edit(Role $role)
    {
        return Inertia::render('Roles/Edit', [
            'role' => $role->load('permissions'),
            'permissions' => Permission::all(),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $role->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        $role->syncPermissions($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully');
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'super-admin') {
            return redirect()->back()->with('error', 'Cannot delete super-admin role');
        }

        $role->delete();
        return redirect()->back()->with('success', 'Role deleted successfully');
    }

    public function members(Role $role)
    {
        // Get all users who don't have this role
        $availableUsers = User::whereDoesntHave('roles', function ($query) use ($role) {
            $query->where('id', $role->id);
        })->get();

        return Inertia::render('Roles/Members', [
            'role' => $role->load('users'),
            'availableUsers' => $availableUsers,
        ]);
    }

    public function removeMember(Role $role, User $user)
    {
        $user->removeRole($role);
        return redirect()->back()->with('success', 'Member removed from role');
    }

    public function addMember(Request $request, Role $role)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $user = User::find($validated['user_id']);
        $user->assignRole($role);

        return redirect()->back()->with('success', 'Member added to role');
    }
}
