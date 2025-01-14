import { Head, useForm } from "@inertiajs/react";
import { Role, User } from "@/types/index";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ArrowLeft, Shield, UserPlus, Mail, Calendar, Trash2, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/auth";
import { isSuperAdmin } from "@/utils/auth";

interface Props {
  role: Role & {
    users: User[];
  };
  availableUsers?: User[]; // Users not in this role
}

export default function Members({ role, availableUsers = [] }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { toast } = useToast();
  const { delete: destroy, post } = useForm();
  const { user } = useAuth();

  const filteredUsers = role.users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  const handleRemoveMember = (user: User) => {
    if (!isSuperAdmin(user)) {
      toast({
        title: "Permission Denied",
        description: "Only super-admins can remove members from roles",
        variant: "destructive",
      });
      return;
    }

    if (role.name === 'super-admin' && role.users.length === 1) {
      toast({
        title: "Error",
        description: "Cannot remove the last super-admin",
        variant: "destructive",
      });
      return;
    }

    destroy(route('roles.members.remove', { role: role.id, user: user.id }), {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Member removed successfully",
        });
      },
    });
  };

  const handleAddMember = (userId: string) => {
    post(route('roles.members.add', role.id), {
      data: { user_id: userId },
      onSuccess: () => {
        setIsAddMemberOpen(false);
        toast({
          title: "Success",
          description: "Member added successfully",
        });
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={`${role.name} Members`} />

      <div className="min-h-screen ">
        <div className="flex flex-col gap-6 p-6">
          {/* Header */}
          <div>
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">{role.name} Members</h2>
                  <p className="text-muted-foreground">
                    Manage users with the {role.name.toLowerCase()} role
                  </p>
                </div>
              </div>
            </div>
            {/* <Dialog 
              open={isAddMemberOpen} 
              onOpenChange={setIsAddMemberOpen}
            >
              <DialogTrigger asChild disabled={!isSuperAdmin(user)}>
                <Button className="gap-2" disabled={!isSuperAdmin(user)}>
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Member</DialogTitle>
                  <DialogDescription>
                    Add a new member to the {role.name} role
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    {availableUsers.length > 0 ? (
                      <Select onValueChange={handleAddMember}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No available users to add to this role.
                      </p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog> */}
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Members</CardTitle>
                  <CardDescription>
                    {role.users.length} users with this role
                  </CardDescription>
                </div>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {filteredUsers.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{user.name}</span>
                              {user.email_verified_at && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Joined {formatDate(user.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* {isSuperAdmin(user) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(user)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            // disabled={!isSuperAdmin(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )} */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No members found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery 
                        ? "No members match your search criteria" 
                        : `This role doesn't have any members yet. Add members using the "Add Member" button above.`
                      }
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 