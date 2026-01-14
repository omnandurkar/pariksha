"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Users,
    BarChart,
    ShieldAlert,
    UserPlus,
    MessageSquare,
    Megaphone
} from "lucide-react";

const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/exams", label: "Exams", icon: FileText },
    { href: "/admin/groups", label: "Student Groups", icon: Users },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/access-requests", label: "Access Requests", icon: UserPlus },
    { href: "/admin/results", label: "Results", icon: BarChart },
    { href: "/admin/access", label: "Access Control", icon: ShieldAlert },
    { href: "/admin/feedback", label: "Feedback (Inbox)", icon: MessageSquare },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export function AdminSidebarNav({ className, onNavClick }) {
    const pathname = usePathname();

    return (
        <nav className={cn("flex flex-col space-y-1", className)}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavClick}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                            isActive
                                ? "bg-primary/10 text-primary hover:bg-primary/15"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
