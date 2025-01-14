import { User } from '@/types/index';
import { usePage } from '@inertiajs/react';
import { Role } from '@/types/index';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      roles?: string[];
    };
  };
}

export function isSuperAdmin(user: User | null = null): boolean {
  const { auth } = usePage<PageProps>().props;
  const roles = auth?.user?.roles;
  
  return Array.isArray(roles) && roles.includes('super-admin');
}