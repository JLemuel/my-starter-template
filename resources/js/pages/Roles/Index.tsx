import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Role, Permission } from "@/types";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash, MoreHorizontal, Shield, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Props {
    roles: Role[];
    permissions: Permission[];
}

export default function Index({ roles, permissions }: Props) {
    const [openDialog, setOpenDialog] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const { toast } = useToast();
    const { delete: destroy } = useForm();
    const { auth } = usePage().props as any;

    // Log the auth user info
    // console.log('Authenticated User:', auth.user);

    function getInitials(name: string) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    }

    const handleDelete = (role: Role) => {
        if (role.name === 'super-admin') {
            toast({
                title: "Error",
                description: "Cannot delete super-admin role",
                variant: "destructive",
            });
            return;
        }
        setRoleToDelete(role);
        setOpenDialog(true);
    };

    const confirmDelete = () => {
        if (!roleToDelete) return;

        destroy(route('roles.destroy', roleToDelete.id), {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Role deleted successfully",
                });
            },
            onFinish: () => {
                setOpenDialog(false);
                setRoleToDelete(null);
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        setOpenDialog(open);
        if (!open) {
            setRoleToDelete(null);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Roles & Permissions" />

            <div className="p-6 space-y-8">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions</h2>
                        </div>
                        <p className="text-muted-foreground text-lg">
                            Manage access control and user capabilities
                        </p>
                    </div>
                    <Button asChild size="lg" className="gap-2">
                        <Link href={route('roles.create')}>
                            <Plus className="w-5 h-5" />
                            New Role
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => (
                        <Card key={role.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>
                                            {getInitials(role.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-xl font-semibold">
                                            {role.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-3.5 w-3.5" />
                                            <span>{role.users?.length || 0} members</span>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={route('roles.edit', role.id)}>
                                                <Pencil className="w-4 h-4 mr-2" />
                                                Edit Role
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={route('roles.members', role.id)}>
                                                <Users className="w-4 h-4 mr-2" />
                                                Members
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(role)}
                                            className="text-red-600 dark:text-red-400"
                                        >
                                            <Trash className="w-4 h-4 mr-2" />
                                            Delete Role
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium text-muted-foreground">
                                            Permissions
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {role.permissions.length}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {role.permissions.map((permission) => (
                                            <Badge
                                                key={permission.id}
                                                variant="secondary"
                                                className="text-xs px-2 py-0.5 font-normal"
                                            >
                                                {permission.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <ConfirmDialog
                open={openDialog}
                onOpenChange={handleOpenChange}
                title="Delete Role"
                description="Are you sure you want to delete this role? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                onConfirm={confirmDelete}
            />
        </AuthenticatedLayout>
    );
} 