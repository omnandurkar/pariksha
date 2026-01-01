'use server'

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function authenticate(prevState, formData) {
    try {
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        // Check if it's a redirect error (Next.js internals)
        if (error.message === "NEXT_REDIRECT" || error.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }

        console.error("Login Error:", error);
        throw error;
    }
}
