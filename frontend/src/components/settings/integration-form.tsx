"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    assetsApi,
    IntegrationConfig,
    CreateIntegrationConfigData,
} from "@/lib/api/assets";
import { useToast } from "@/hooks/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Info, Key, Globe, Database, Shield } from "lucide-react";

const integrationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    integrationType: z.enum(["cmdb", "asset_management_system", "rest_api", "webhook"]),
    endpointUrl: z.string().url("Must be a valid URL"),
    authenticationType: z.enum(["api_key", "bearer_token", "basic_auth", "oauth2"]),
    apiKey: z.string().optional(),
    bearerToken: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    syncInterval: z.string().optional(),
    notes: z.string().optional(),
    fieldMapping: z.record(z.string()).optional(),
});

type IntegrationFormData = z.infer<typeof integrationSchema>;

interface IntegrationFormProps {
    initialData?: IntegrationConfig | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function IntegrationForm({
    initialData,
    onSuccess,
    onCancel,
}: IntegrationFormProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<IntegrationFormData>({
        resolver: zodResolver(integrationSchema),
        defaultValues: {
            name: initialData?.name || "",
            integrationType: initialData?.integrationType || "rest_api",
            endpointUrl: initialData?.endpointUrl || "",
            authenticationType: initialData?.authenticationType || "api_key",
            apiKey: initialData?.apiKey || "",
            bearerToken: initialData?.bearerToken || "",
            username: initialData?.username || "",
            password: initialData?.password || "",
            syncInterval: initialData?.syncInterval || "24h",
            notes: initialData?.notes || "",
            fieldMapping: initialData?.fieldMapping || {
                uniqueIdentifier: "id",
                assetDescription: "name",
                manufacturer: "vendor",
            },
        },
    });

    const authType = form.watch("authenticationType");

    const mutation = useMutation({
        mutationFn: (data: IntegrationFormData) => {
            const payload: CreateIntegrationConfigData = {
                name: data.name,
                endpointUrl: data.endpointUrl,
                integrationType: data.integrationType as any,
                authenticationType: data.authenticationType as any,
                apiKey: data.apiKey,
                bearerToken: data.bearerToken,
                username: data.username,
                password: data.password,
                syncInterval: data.syncInterval,
                notes: data.notes,
                fieldMapping: data.fieldMapping,
            };
            if (initialData) {
                return assetsApi.updateIntegration(initialData.id, payload);
            }
            return assetsApi.createIntegration(payload);
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: `Integration ${initialData ? "updated" : "created"} successfully`,
            });
            queryClient.invalidateQueries({ queryKey: ["integrations"] });
            onSuccess();
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || `Failed to ${initialData ? "update" : "create"} integration`,
                variant: "destructive",
            });
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Integration Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., ServiceNow CMDB" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="integrationType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="cmdb">CMDB / ITOM</SelectItem>
                                        <SelectItem value="asset_management_system">Asset Management System</SelectItem>
                                        <SelectItem value="rest_api">Generic REST API</SelectItem>
                                        <SelectItem value="webhook">Incoming Webhook</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="syncInterval"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sync Interval</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select interval" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1h">Hourly</SelectItem>
                                        <SelectItem value="6h">Every 6 Hours</SelectItem>
                                        <SelectItem value="12h">Every 12 Hours</SelectItem>
                                        <SelectItem value="24h">Daily</SelectItem>
                                        <SelectItem value="7d">Weekly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>How often to poll the external system</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endpointUrl"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Endpoint URL *</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9" placeholder="https://api.example.com/v1/assets" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="authenticationType"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Authentication Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="api_key">API Key (X-API-Key Header)</SelectItem>
                                        <SelectItem value="bearer_token">Bearer Token (Authorization Header)</SelectItem>
                                        <SelectItem value="basic_auth">Basic Auth (Username / Password)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {authType === "api_key" && (
                        <FormField
                            control={form.control}
                            name="apiKey"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>API Key</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input type="password" title="API Key" className="pl-9" placeholder="Enter API key" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {authType === "bearer_token" && (
                        <FormField
                            control={form.control}
                            name="bearerToken"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Bearer Token</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input type="password" title="Bearer Token" className="pl-9" placeholder="Enter token" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {authType === "basic_auth" && (
                        <>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" title="Password" placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Optional internal notes..." rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            initialData ? "Update Integration" : "Create Integration"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
