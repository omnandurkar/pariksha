import prisma from "@/lib/prisma"
import { createAnnouncement, deleteAnnouncement, toggleAnnouncement } from "@/actions/announcement-actions"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Trash2, Megaphone } from "lucide-react"

async function AnnouncementList() {
    const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold">Active Announcements</h2>
            {announcements.length === 0 && <p className="text-muted-foreground">No announcements found.</p>}

            <div className="grid gap-4">
                {announcements.map((a) => (
                    <Card key={a.id} className="p-4 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold">{a.title}</h3>
                                {!a.isActive && <span className="text-xs bg-muted px-2 py-0.5 rounded">Draft</span>}
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.message}</p>
                            {a.expiresAt && <p className="text-xs text-muted-foreground mt-2">Expires: {new Date(a.expiresAt).toLocaleDateString()}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <form action={toggleAnnouncement.bind(null, a.id, a.isActive)}>
                                <Button size="sm" variant="ghost">
                                    {a.isActive ? "Deactivate" : "Activate"}
                                </Button>
                            </form>
                            <form action={deleteAnnouncement.bind(null, a.id)}>
                                <Button size="icon" variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default function AnnouncementsPage() {
    return (
        <div className="max-w-4xl mx-auto py-10 space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Megaphone className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Announcements</h1>
                    <p className="text-muted-foreground">Broadcast messages to all students.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Announcement</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createAnnouncement} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input name="title" placeholder="e.g. Server Maintenance" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea name="message" placeholder="Details..." required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                                <Input type="date" name="expiresAt" />
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <Switch name="isActive" defaultChecked={true} id="active" />
                                <Label htmlFor="active">Publish Immediately</Label>
                            </div>
                        </div>
                        <Button type="submit">Post Announcement</Button>
                    </form>
                </CardContent>
            </Card>

            <AnnouncementList />
        </div>
    )
}
