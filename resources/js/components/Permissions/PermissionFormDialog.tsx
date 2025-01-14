import { Permission } from "@/types";
import { Dialog } from '@headlessui/react';
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { X, Shield } from "lucide-react";

interface PermissionFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    permission: Permission | null;
}

export function PermissionFormDialog({ open, onOpenChange, permission }: PermissionFormDialogProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: permission?.name ?? '',
        guard_name: 'web',
    });

    useEffect(() => {
        setData({
            name: permission?.name ?? '',
            guard_name: 'web',
        });
    }, [permission]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (permission) {
            put(route('permissions.update', permission.id), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post(route('permissions.store'), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onClose={() => onOpenChange(false)} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="relative mx-auto max-w-md w-full rounded-xl bg-white dark:bg-gray-800/90 shadow-xl border dark:border-gray-700">
                    {/* Header */}
                    <div className="flex items-center gap-4 p-6 border-b dark:border-gray-700">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {permission ? 'Edit Permission' : 'New Permission'}
                            </Dialog.Title>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {permission ? 'Modify existing permission settings' : 'Create a new system permission'}
                            </p>
                        </div>
                        {/* <button
                            onClick={() => onOpenChange(false)}
                            className="h-8 w-8 rounded-lg border dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button> */}
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Permission Name
                                </Label>
                                <FormInput
                                    id="name"
                                    placeholder="Enter permission name..."
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    error={errors.name}
                                    className="w-full"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 rounded-b-xl">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="px-4"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="px-4"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                        Processing...
                                    </span>
                                ) : permission ? 'Save Changes' : 'Create Permission'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 