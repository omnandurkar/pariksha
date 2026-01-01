"use client"

import { useState } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Check, X, Loader2 } from "lucide-react"
import { approveRequest, rejectRequest } from "./actions"
import { toast } from "sonner"

export function RequestRow({ request, groups }) {
    const [selectedGroup, setSelectedGroup] = useState("none")
    const [isApproving, setIsApproving] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleApprove = async () => {
        setIsApproving(true)
        const result = await approveRequest(request.id, selectedGroup)
        setIsApproving(false)
        if (result.success) {
            toast.success("Request approved and user created")
            setDialogOpen(false)
        } else {
            toast.error(result.error)
        }
    }

    const handleReject = async () => {
        if (!confirm("Are you sure you want to reject this request? It will be deleted permanently.")) return
        setIsRejecting(true)
        const result = await rejectRequest(request.id)
        setIsRejecting(false)
        if (result.success) {
            toast.success("Request rejected")
        } else {
            toast.error(result.error)
        }
    }

    return (
        <TableRow>
            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="font-medium">{request.name}</TableCell>
            <TableCell>{request.email}</TableCell>
            <TableCell>{request.phone || "-"}</TableCell>
            <TableCell className="text-right space-x-2">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                            <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Approve Access Request</DialogTitle>
                            <DialogDescription>
                                Create an account for <strong>{request.name}</strong> ({request.email}).
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Assign to Group (Optional)</Label>
                                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None (No Group)</SelectItem>
                                        {groups.map(g => (
                                            <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleApprove} disabled={isApproving} className="bg-green-600 hover:bg-green-700 text-white">
                                {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Approval
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleReject} disabled={isRejecting}>
                    {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                    Reject
                </Button>
            </TableCell>
        </TableRow>
    )
}
