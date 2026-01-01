import prisma from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RequestRow } from "./request-row"

export default async function AccessRequestsPage() {
    const requests = await prisma.accessRequest.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" }
    })

    const groups = await prisma.group.findMany({
        select: { id: true, name: true }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Access Requests</h1>
            </div>

            <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No pending requests.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <RequestRow key={req.id} request={req} groups={groups} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
