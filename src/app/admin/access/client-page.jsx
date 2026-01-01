"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toggleAdminRole } from "./actions"
import { toast } from "sonner"
import { Search, Shield, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AccessPage({ users }) {
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [isPending, setIsPending] = useState(false);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearch(term);
        setFilteredUsers(users.filter(u =>
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
        ));
    }

    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN';
        if (!confirm(`Change role to ${newRole}?`)) return;

        setIsPending(true);
        const result = await toggleAdminRole(userId, newRole);
        setIsPending(false);

        if (result.error) toast.error(result.error);
        else {
            toast.success("Role updated");
            // Optimistic update acceptable, but ideally revalidate handles it.
            // For this client component we might need router.refresh() 
            // but for simplicity we rely on revalidatePath in action + standard Next.js behavior.
            window.location.reload(); // Simple refresh to fetch new data
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Access Control</h1>

            <div className="flex items-center space-x-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." value={search} onChange={handleSearch} />
            </div>

            <div className="border rounded-lg">
                <div className="p-4 grid gap-4">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {user.role === 'ADMIN' ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                </div>
                                <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant={user.role === 'ADMIN' ? 'default' : 'outline'}>
                                    {user.role}
                                </Badge>
                                <Button
                                    size="sm"
                                    variant={user.role === 'ADMIN' ? "destructive" : "secondary"}
                                    onClick={() => handleRoleChange(user.id, user.role)}
                                    disabled={isPending}
                                >
                                    {user.role === 'ADMIN' ? "Demote" : "Promote to Admin"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
