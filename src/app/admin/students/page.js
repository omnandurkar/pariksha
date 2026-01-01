import prisma from "@/lib/prisma"
import { AddStudentForm } from "./add-student-form"
import { BulkStudentImport } from "./bulk-import"
import { EditStudentDialog } from "./edit-student-dialog"
import { DeleteStudentButton } from "./delete-student-button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function StudentsPage() {
    const students = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        orderBy: { createdAt: 'desc' }
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

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <EditStudentDialog student={student} />
                                        <DeleteStudentButton id={student.id} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
