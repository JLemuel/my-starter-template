import { Head, Link, useForm } from "@inertiajs/react";
import { User } from "@/types";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash, MoreHorizontal, Users, Search, Filter, UserIcon, Mail } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Props {
    users: User[];
}

export default function Index({ users }: Props) {
    const [openDialog, setOpenDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const { toast } = useToast();
    const { delete: destroy } = useForm();
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const handleDelete = (user: User) => {
        if (user.roles?.some(role => role.name === 'super-admin')) {
            toast({
                title: "Error",
                description: "Cannot delete super-admin user",
                variant: "destructive",
            });
            return;
        }
        setUserToDelete(user);
        setOpenDialog(true);
    };

    const confirmDelete = () => {
        if (!userToDelete) return;

        destroy(route('users.destroy', userToDelete.id), {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "User deleted successfully",
                });
            },
            onFinish: () => {
                setOpenDialog(false);
                setUserToDelete(null);
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        setOpenDialog(open);
        if (!open) {
            setUserToDelete(null);
        }
    };

    function getInitials(name: string) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    }

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || 
            (user.roles && user.roles.some(role => role.name === roleFilter));
        return matchesSearch && matchesRole;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Users" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center bg-card p-6 rounded-lg ">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Users className="h-10 w-10 text-primary" />
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                                <p className="text-muted-foreground">
                                    {filteredUsers.length} total users
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button asChild size="lg" className="gap-2">
                        <Link href={route('users.create')}>
                            <Plus className="w-5 h-5" />
                            New User
                        </Link>
                    </Button>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search users..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="super-admin">Super Admin</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {filteredUsers.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredUsers.map((user) => (
                            <Card key={user.id} className="group hover:shadow-lg transition-all duration-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-14 w-14 ring-2 ring-offset-2 ring-primary/10 transition-all duration-300 group-hover:ring-primary/30">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary/5 to-primary/10 text-primary font-medium">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl font-semibold">
                                                {user.name}
                                            </CardTitle>
                                            <div className="flex items-center text-sm text-muted-foreground gap-1">
                                                <Mail className="h-3.5 w-3.5" />
                                                <span>{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={route('users.edit', user.id)}>
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Edit User
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(user)}
                                                className="text-red-600 dark:text-red-400"
                                            >
                                                <Trash className="w-4 h-4 mr-2" />
                                                Delete User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {user.roles && user.roles.map((role) => (
                                            <Badge 
                                                key={role.id} 
                                                variant={role.name === 'super-admin' ? 'default' : 'secondary'}
                                                className={`capitalize px-3 py-1 ${
                                                    role.name === 'super-admin' 
                                                        ? 'bg-primary/10 text-primary hover:bg-primary/15' 
                                                        : ''
                                                }`}
                                            >
                                                {role.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="bg-primary/5 p-4 rounded-full">
                                <UserIcon className="w-12 h-12 text-primary/60" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">No users found</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    {searchQuery || roleFilter !== 'all' 
                                        ? "No users match your search criteria. Try adjusting your filters."
                                        : "There are no users in the system yet. Create your first user to get started."}
                                </p>
                            </div>
                            <Button asChild className="mt-4">
                                <Link href={route('users.create')}>
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add New User
                                </Link>
                            </Button>
                        </div>
                    </Card>
                )}
            </div>

            <ConfirmDialog
                open={openDialog}
                onOpenChange={handleOpenChange}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                onConfirm={confirmDelete}
            />
        </AuthenticatedLayout>
    );
} 