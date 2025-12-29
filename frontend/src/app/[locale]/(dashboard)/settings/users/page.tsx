"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { invitationsApi } from "@/lib/api/invitations"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    UserPlus,
    Mail,
    MoreHorizontal,
    Trash2,
    Clock,
    CheckCircle2,
    XCircle,
    Users as UsersIcon
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InviteUserDialog } from "@/components/users/invite-user-dialog"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export default function UsersSettingsPage() {
    const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false)
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const { data: invitations, isLoading } = useQuery({
        queryKey: ["invitations"],
        queryFn: invitationsApi.getAll,
    })

    const revokeInvitation = useMutation({
        mutationFn: (id: string) => invitationsApi.revoke(id),
        onSuccess: () => {
            toast({
                title: "Invitation revoked",
                description: "The invitation is no longer valid.",
            })
            queryClient.invalidateQueries({ queryKey: ["invitations"] })
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to revoke invitation",
            })
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
                    <p className="text-muted-foreground">
                        Manage your organization's members and pending invitations.
                    </p>
                </div>
                <Button onClick={() => setInviteDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            Pending Invitations
                        </CardTitle>
                        <CardDescription>
                            Users who have been invited but haven't joined yet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            Loading invitations...
                                        </TableCell>
                                    </TableRow>
                                ) : !invitations || invitations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No pending invitations.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invitations.map((invitation) => (
                                        <TableRow key={invitation.id}>
                                            <TableCell className="font-medium">{invitation.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {invitation.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {invitation.status === 'pending' && (
                                                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                            <Clock className="mr-1 h-3 w-3" />
                                                            Pending
                                                        </Badge>
                                                    )}
                                                    {invitation.status === 'accepted' && (
                                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Accepted
                                                        </Badge>
                                                    )}
                                                    {invitation.status === 'expired' && (
                                                        <Badge variant="destructive">
                                                            <XCircle className="mr-1 h-3 w-3" />
                                                            Expired
                                                        </Badge>
                                                    )}
                                                    {invitation.status === 'revoked' && (
                                                        <Badge variant="outline">Revoked</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {format(new Date(invitation.expiresAt), "MMM d, h:mm a")}
                                            </TableCell>
                                            <TableCell>
                                                {invitation.status === 'pending' && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => revokeInvitation.mutate(invitation.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Revoke
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Existing Users Table Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UsersIcon className="h-5 w-5 text-primary" />
                            Active Members
                        </CardTitle>
                        <CardDescription>
                            Manage existing members and their organization access.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
                            Member list integration coming soon. Use invitations to add new members.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <InviteUserDialog
                open={inviteDialogOpen}
                onOpenChange={setInviteDialogOpen}
            />
        </div>
    )
}
