<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index()
    {
        return Inertia::render('Permissions/Index', [
            'permissions' => Permission::with('roles')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Permissions/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        Permission::create([
            'name' => $validated['name'],
            'guard_name' => 'web'
        ]);

        return redirect()->back()
            ->with('success', 'Permission created successfully');
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('Permissions/Edit', [
            'permission' => $permission->load('roles'),
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update([
            'name' => $validated['name'],
            // guard_name remains unchanged
        ]);

        return redirect()->back()
            ->with('success', 'Permission updated successfully');
    }

    public function destroy(Permission $permission)
    {
        // Prevent deletion of critical permissions
        if (in_array($permission->name, ['manage roles', 'manage permissions'])) {
            return redirect()->back()
                ->with('error', 'Cannot delete critical system permissions');
        }

        $permission->delete();
        
        return redirect()->back()
            ->with('success', 'Permission deleted successfully');
    }
} 