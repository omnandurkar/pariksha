"use client"

import { useActionState } from "react"
import { submitAccessRequest } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function RequestAccessPage() {
    const [state, action, isPending] = useActionState(submitAccessRequest, null)

    if (state?.success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
                    <div className="flex justify-center text-green-500">
                        <CheckCircle className="h-16 w-16" />
                    </div>
                    <h1 className="text-2xl font-bold">Request Submitted!</h1>
                    <p className="text-muted-foreground">
                        Your request for access has been sent to the administrator.
                        You will be notified once your account is approved.
                    </p>
                    <Button asChild className="w-full mt-4">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-center bg-black text-white p-12">
                <div className="max-w-md mx-auto space-y-6">
                    <h1 className="text-4xl font-bold">Join Pariksha Enterprise</h1>
                    <p className="text-lg text-gray-400">
                        Secure, reliable, and comprehensive examination platform for modern institutions.
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center p-8 bg-muted/20">
                <div className="max-w-sm w-full space-y-6">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold">Request Access</h2>
                        <p className="text-muted-foreground">Enter your details to apply for a student account.</p>
                    </div>

                    <form action={action} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                            {state?.error?.name && <p className="text-red-500 text-sm">{state.error.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                            {state?.error?.email && <p className="text-red-500 text-sm">{state.error.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input id="phone" name="phone" placeholder="+1234567890" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Desired Password</Label>
                            <PasswordInput id="password" name="password" required />
                            {state?.error?.password && <p className="text-red-500 text-sm">{state.error.password}</p>}
                        </div>

                        {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Submitting..." : "Submit Request"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="underline hover:text-primary">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
