import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Plus } from "lucide-react";

export default async function ExamsPage() {
    const exams = await prisma.exam.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { questions: true, attempts: true } } }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Exams</h1>
                <Button asChild>
                    <Link href="/admin/exams/create">
                        <Plus className="mr-2 h-4 w-4" /> Create Exam
                    </Link>
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Questions</TableHead>
                            <TableHead>Attempts</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No exams found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            exams.map((exam) => (
                                <TableRow key={exam.id}>
                                    <TableCell className="font-medium">{exam.title}</TableCell>
                                    <TableCell>{exam.duration} mins</TableCell>
                                    <TableCell>{exam._count.questions}</TableCell>
                                    <TableCell>{exam._count.attempts}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${exam.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'}`}>
                                            {exam.isActive ? 'Active' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/exams/${exam.id}`}>Manage</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
