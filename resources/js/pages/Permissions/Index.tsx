import { Head, Link } from "@inertiajs/react";
import { Permission } from "@/types";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash, MoreHorizontal, Shield } from "lucide-react";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionFormDialog } from "@/components/Permissions/PermissionFormDialog";

interface Props {
    permissions: Permission[];
}

export default function Index({ permissions }: Props) {
    const [openDialog, setOpenDialog] = useState(false);
    const [openPermissionForm, setOpenPermissionForm] = useState(false);
    const [permissionToEdit, setPermissionToEdit] = useState<Permission | null>(null);
    const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
    const { toast } = useToast();

    // Group permissions by their prefix (first word)
    const permissionGroups = permissions.reduce((groups, permission) => {
        const group = permission.name.split(' ')[0];
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(permission);
        return groups;
    }, {} as Record<string, Permission[]>);

    const handleDelete = (permission: Permission) => {
        // Prevent deletion of critical permissions
        if (permission.name === 'manage roles' || permission.name === 'manage permissions') {
            toast({
                title: "Error",
                description: "Cannot delete system permissions",
                variant: "destructive",
            });
            return;
        }
        setPermissionToDelete(permission);
        setOpenDialog(true);
    };

    const handleOpenChange = (open: boolean) => {
        setOpenDialog(open);
        if (!open) {
            setPermissionToDelete(null);
        }
    };

    const handleEdit = (permission: Permission) => {
        setPermissionToEdit(permission);
        setOpenPermissionForm(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Permissions Management" />

            <div className="p-6 space-y-8">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <h2 className="text-3xl font-bold tracking-tight">Permissions</h2>
                        </div>
                        <p className="text-muted-foreground text-lg">
                            Manage system permissions and capabilities
                        </p>
                    </div>
                    <Button 
                        size="lg" 
                        className="gap-2"
                        onClick={() => {
                            setPermissionToEdit(null);
                            setOpenPermissionForm(true);
                        }}
                    >
                        <Plus className="w-5 h-5" />
                        New Permission
                    </Button>
                </div>

                <div className="grid gap-6">
                    {Object.entries(permissionGroups).map(([group, perms]) => (
                        <Card key={group}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="capitalize">{group}</CardTitle>
                                        <Badge variant="outline">
                                            {perms.length}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {perms.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-primary" />
                                                <span className="font-medium">
                                                    {permission.name}
                                                </span>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(permission)}>
                                                        <Pencil className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(permission)}
                                                        className="text-red-600 dark:text-red-400"
                                                    >
                                                        <Trash className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <ConfirmDialog
                open={openDialog}
                onOpenChange={handleOpenChange}
                title="Delete Permission"
                description="Are you sure you want to delete this permission? This action cannot be undone and may affect users who currently have this permission."
                confirmText="Delete"
                variant="destructive"
                onConfirm={() => {
                    // Add delete logic here
                    if (permissionToDelete) {
                        // Handle permission deletion
                    }
                }}
            />

            <PermissionFormDialog
                open={openPermissionForm}
                onOpenChange={(open) => {
                    setOpenPermissionForm(open);
                    if (!open) {
                        setPermissionToEdit(null);
                    }
                }}
                permission={permissionToEdit}
            />
        </AuthenticatedLayout>
    );
} 