import { Head, useForm } from "@inertiajs/react";
import { Role, Permission } from "@/types";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ArrowLeft, Shield, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Props {
  role: Role;
  permissions: Permission[];
}

export default function Edit({ role, permissions }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, setData, put, processing, errors } = useForm({
    name: role.name,
    description: role.description || "",
    permissions: role.permissions.map(p => p.name),
  });

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const permissionGroups = filteredPermissions.reduce((groups, permission) => {
    const group = permission.name.split(' ')[0];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("roles.update", role.id));
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Edit Role: ${role.name}`} />

      <div className="min-h-screen bg-muted/20 rounded-xl">
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
                <h2 className="text-3xl font-bold tracking-tight">Edit Role: {role.name}</h2>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-6">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Role Information</CardTitle>
                      <CardDescription>
                        Update role details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input
                          id="name"
                          value={data.name}
                          onChange={(e) => setData("name", e.target.value)}
                          placeholder="Enter role name"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={data.description}
                          onChange={(e) => setData("description", e.target.value)}
                          placeholder="Brief description of the role"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Selected Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[180px]">
                        <div className="flex flex-wrap gap-1.5">
                          {data.permissions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No permissions selected
                            </p>
                          ) : (
                            data.permissions.map((permission) => (
                              <Badge
                                key={permission}
                                variant="secondary"
                                className="text-xs px-2 py-0.5 font-normal"
                              >
                                {permission}
                              </Badge>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={processing}
                      className="flex-1"
                    >
                      Update Role
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Available Permissions</span>
                    <Badge variant="secondary" className="text-xs">
                      {data.permissions.length} Selected
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Select the permissions for this role
                  </CardDescription>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search permissions..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-8 pr-4">
                      {Object.entries(permissionGroups).map(([group, perms]) => (
                        <div key={group} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium capitalize">
                                {group}
                              </h4>
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0.5"
                              >
                                {perms.length}
                              </Badge>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2"
                              onClick={() => {
                                const allSelected = perms.every(p =>
                                  data.permissions.includes(p.name)
                                );
                                if (allSelected) {
                                  setData(
                                    "permissions",
                                    data.permissions.filter(
                                      p => !perms.find(perm => perm.name === p)
                                    )
                                  );
                                } else {
                                  const newPermissions = [...data.permissions];
                                  perms.forEach(p => {
                                    if (!newPermissions.includes(p.name)) {
                                      newPermissions.push(p.name);
                                    }
                                  });
                                  setData("permissions", newPermissions);
                                }
                              }}
                            >
                              {perms.every(p => data.permissions.includes(p.name))
                                ? "Deselect All"
                                : "Select All"}
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                            {perms.map((permission) => (
                              <div
                                key={permission.id}
                                className={`
                                                                    flex items-center space-x-2 rounded-lg border 
                                                                    p-2 transition-colors duration-150
                                                                    ${data.permissions.includes(permission.name)
                                    ? 'bg-primary/5 border-primary/20'
                                    : 'hover:bg-muted/50'
                                  }
                                                                `}
                              >
                                <Checkbox
                                  id={`permission-${permission.id}`}
                                  checked={data.permissions.includes(
                                    permission.name
                                  )}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setData("permissions", [
                                        ...data.permissions,
                                        permission.name,
                                      ]);
                                    } else {
                                      setData(
                                        "permissions",
                                        data.permissions.filter(
                                          (p) => p !== permission.name
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-sm flex-1 cursor-pointer truncate"
                                >
                                  {permission.name}
                                </Label>
                                {data.permissions.includes(permission.name) && (
                                  <Check className="h-4 w-4 text-primary shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 