export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    roles?: Role[];
}

export interface Role {
    id: number;
    name: string;
    description: string | null;
    permissions: Permission[];
    users?: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        email_verified_at: string | null;
        created_at: string;
    }[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  roles?: Role[];
  // ... other fields
}