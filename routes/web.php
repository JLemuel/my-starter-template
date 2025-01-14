<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PermissionController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->middleware('permission:view dashboard')->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/roles/{role}/members', [RoleController::class, 'members'])->name('roles.members');
    Route::delete('/roles/{role}/members/{user}', [RoleController::class, 'removeMember'])->name('roles.members.remove');
    Route::post('/roles/{role}/members', [RoleController::class, 'addMember'])->name('roles.members.add');

    Route::resource('roles', RoleController::class);

    // User management routes with specific permissions
    Route::resource('users', UserController::class);

    Route::resource('permissions', PermissionController::class);
});

require __DIR__.'/auth.php';
