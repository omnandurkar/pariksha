"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

const requestSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    message: z.string().optional(),
})

export async function submitAccessRequest(prevState, formData) {
    const validatedFields = requestSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone'),
        message: formData.get('message'),
    })

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors }
    }

    const { email, password, name, phone, message } = validatedFields.data

    try {
        // Check existing user
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) return { message: "Email already registered." }

        // Check existing request
        const existingRequest = await prisma.accessRequest.findUnique({ where: { email } })
        if (existingRequest) return { message: "Request already pending for this email." }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.accessRequest.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                message
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Access Request Error:", error)
        return { message: "Failed to submit request." }
    }
}
