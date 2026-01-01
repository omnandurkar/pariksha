import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function AdminGuard({ children }) {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-red-600">Access Denied</h1>
                <p className="text-xl font-medium text-muted-foreground">
                    Better luck next time you new bee 🐝
                </p>
            </div>
        )
    }

    return <>{children}</>;
}
