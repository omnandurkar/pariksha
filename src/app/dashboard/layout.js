import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { BookOpen, LogOut } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle";
import { DashboardFooter } from "@/components/dashboard-footer";
import { SignOutButton } from "@/components/sign-out-button";

export default async function StudentLayout({ children }) {
    const session = await auth()

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                        <BookOpen className="h-6 w-6" />
                        <span>Pariksha</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:block">
                            {session?.user?.email}
                        </span>
                        <ModeToggle />
                        <SignOutButton />
                    </div>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <DashboardFooter />
        </div>
    )
}
