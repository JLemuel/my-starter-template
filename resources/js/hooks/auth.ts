import { usePage } from '@inertiajs/react';

export function useAuth() {
    const { auth } = usePage().props as any;
    return {
        user: auth.user,
    };
} 