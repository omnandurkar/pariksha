import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";
import { Menu, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { AdminGuard } from "@/components/admin-guard";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { AdminSidebarNav } from "@/components/admin-sidebar-nav";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default async function AdminLayout({ children }) {
    const session = await auth();

    return (
        <AdminGuard>
            <div className="min-h-screen flex bg-muted/40 text-foreground">
                {/* Desktop Sidebar */}
                <aside className="hidden md:flex fixed inset-y-0 left-0 z-10 w-64 bg-background border-r flex-col">
                    <div className="h-14 flex items-center px-4 border-b font-semibold text-lg">
                        Pariksha Admin
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        <AdminSidebarNav />
                    </div>
                    <div className="p-4 border-t space-y-2">
                        <FeedbackDialog
                            trigger={
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium text-left text-muted-foreground hover:text-foreground">
                                    <MessageSquare className="h-4 w-4" />
                                    Send Feedback
                                </button>
                            }
                        />
                        <Link href="/about" className="block px-3 py-1 text-xs text-muted-foreground hover:text-primary">
                            Behind Pariksha
                        </Link>
                        <SignOutButton />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 flex flex-col min-w-0">
                    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b bg-background sticky top-0 z-20 gap-4">
                        {/* Mobile Sidebar Trigger */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-ml-2">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[80vw] sm:w-[350px] p-0 flex flex-col">
                                    <SheetHeader className="px-4 py-4 border-b text-left">
                                        <SheetTitle>Pariksha Admin</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto py-4 px-2">
                                        <AdminSidebarNav />
                                    </div>
                                    <div className="p-4 border-t space-y-2">
                                        <FeedbackDialog
                                            trigger={
                                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium text-left text-muted-foreground hover:text-foreground">
                                                    <MessageSquare className="h-4 w-4" />
                                                    Send Feedback
                                                </button>
                                            }
                                        />
                                        <Link href="/about" className="block px-3 py-1 text-xs text-muted-foreground hover:text-primary">
                                            Behind Pariksha
                                        </Link>
                                        <SignOutButton />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <div className="flex items-center gap-4 ml-auto">
                            <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                                {session?.user?.email}
                            </span>
                            <ModeToggle />
                        </div>
                    </header>
                    <div className="p-4 md:p-6 flex-1 overflow-x-hidden">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
