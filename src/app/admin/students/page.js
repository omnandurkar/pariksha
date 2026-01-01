import prisma from "@/lib/prisma"
import { AddStudentForm } from "./add-student-form"
import { BulkStudentImport } from "./bulk-import"
import { StudentsClient } from "./students-client"

export default async function StudentsPage() {
    const students = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            role: true
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Students</h1>
                <div className="flex gap-2">
                    <BulkStudentImport />
                    <AddStudentForm />
                </div>
            </div>

            <StudentsClient initialStudents={students} />
        </div>
    )
}
