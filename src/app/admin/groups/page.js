import prisma from "@/lib/prisma"
import Link from "next/link"
import { CreateGroupDialog } from "./create-group-dialog"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ArrowRight } from "lucide-react"

export default async function AdminGroupsPage() {
    const groups = await prisma.group.findMany({
        include: {
            _count: { select: { members: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Student Groups</h1>
                <CreateGroupDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groups.length === 0 ? (
                    <div className="col-span-full text-center py-12 border rounded-lg bg-muted/40">
                        <div className="flex justify-center mb-4">
                            <Users className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No groups here yet</h3>
                        <p className="text-muted-foreground mt-1">Create a group to organize students into batches.</p>
                    </div>
                ) : (
                    groups.map(group => (
                        <Card key={group.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <span className="truncate">{group.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {group.description || "No description provided."}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium bg-muted/50 p-2 rounded w-fit">
                                    <Users className="h-4 w-4" />
                                    <span>{group._count.members} Members</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="secondary" className="w-full">
                                    <Link href={`/admin/groups/${group.id}`}>
                                        Manage Members <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
