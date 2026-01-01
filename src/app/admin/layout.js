import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import {
    LayoutDashboard,
    FileText,
    Users,
    BarChart,
    LogOut,
    ShieldAlert,
    UserPlus
} from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { AdminGuard } from "@/components/admin-guard";

export default async function AdminLayout({ children }) {
    const session = await auth();

    return (
        <AdminGuard>
            <div className="min-h-screen flex bg-muted/40 text-foreground">
                {/* Sidebar */}
                <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-background border-r flex flex-col">
                    <div className="h-14 flex items-center px-4 border-b font-semibold text-lg">
                        Pariksha Admin
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link href="/admin/exams" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium">
                            <FileText className="h-4 w-4" />
                            Exams
                        </Link>
                        <Link href="/admin/groups" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium">
                            <Users className="h-4 w-4" />
                            Student Groups
                        </Link>
                        <Link href="/admin/students" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium">
                            <Users className="h-4 w-4" />
                            Students
                        </Link>
                        <Link href="/admin/access-requests" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium">
                            <UserPlus className="h-4 w-4" />
                            Access Requests
                        </Link>
                        <Link href="/admin/results" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium">
                            <BarChart className="h-4 w-4" />
                            Results
                        </Link>
                        <Link href="/admin/access" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium">
                            <ShieldAlert className="h-4 w-4" />
                            Access Control
                        </Link>
                    </nav>
                    <div className="p-4 border-t">
                        <form
                            action={async () => {
                                "use server";
                                await signOut();
                            }}
                        >
                            <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-500 hover:bg-red-50">
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64 flex flex-col">
                    <header className="h-14 flex items-center justify-end px-6 border-b bg-background sticky top-0 z-0 gap-4">
                        <span className="text-sm font-medium text-muted-foreground">
                            {session?.user?.email}
                        </span>
                        <ModeToggle />
                    </header>
                    <div className="p-6 flex-1">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
