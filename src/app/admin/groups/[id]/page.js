import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, UserPlus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AddMemberDialog } from "./add-member-dialog"
import { RemoveMemberButton } from "./remove-member-button"

export default async function GroupDetailsPage({ params }) {
    const { id } = await params

    const group = await prisma.group.findUnique({
        where: { id },
        include: {
            members: {
                include: { user: true },
                orderBy: { joinedAt: 'desc' }
            }
        }
    })

    if (!group) return notFound()

    // Fetch all students to allow adding new ones (exclude existing members)
    const allStudents = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        orderBy: { name: 'asc' }
    })

    const memberIds = new Set(group.members.map(m => m.userId))
    const availableStudents = allStudents.filter(s => !memberIds.has(s.id))

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/groups"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">{group.name}</h1>
                    <p className="text-muted-foreground">{group.description}</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Members ({group.members.length})</h2>
                <AddMemberDialog groupId={group.id} availableStudents={availableStudents} />
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined At</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {group.members.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No members in this group.
                                </TableCell>
                            </TableRow>
                        ) : (
                            group.members.map(member => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">{member.user.name}</TableCell>
                                    <TableCell>{member.user.email}</TableCell>
                                    <TableCell>{format(new Date(member.joinedAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell className="text-right">
                                        <RemoveMemberButton memberId={member.id} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
