import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { AddQuestionForm } from "./add-question-form"
import { QuestionList } from "./question-list"
import { BulkImport } from "./bulk-import"
import { BulkAssignStudents } from "./bulk-assign"
import { SelectStudentsDialog } from "./select-students-dialog"
import { AssignedStudentsList } from "./assigned-list"
import { PublishResultsToggle } from "./publish-toggle"
import { EditExamDialog } from "./edit-exam-dialog"
import { AssignGroupDialog } from "./assign-group-dialog"
import { Badge } from "@/components/ui/badge"

export default async function ManageExamPage({ params }) {
    const { id } = await params

    const exam = await prisma.exam.findUnique({
        where: { id },
        include: {
            questions: {
                include: { options: true }
            },
            assignments: {
                include: { user: true }
            }
        }
    })

    if (!exam) return notFound()

    // Fetch all students to filter unassigned ones
    const allStudents = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        orderBy: { name: 'asc' }
    });

    const assignedUserIds = new Set(exam.assignments.map(a => a.userId));
    const availableStudents = allStudents.filter(s => !assignedUserIds.has(s.id));

    const groups = await prisma.group.findMany({
        include: { _count: { select: { members: true } } },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold">{exam.title}</h1>
                        <EditExamDialog exam={exam} />
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <Badge variant={exam.isActive ? "default" : "secondary"}>
                            {exam.isActive ? "Active" : "Draft"}
                        </Badge>
                        <span>{exam.duration} mins</span>
                        <span>•</span>
                        <span>Pass: {exam.passingPercentage}%</span>
                        <span>•</span>
                        <span>{exam.questions.length} Questions</span>
                    </div>
                </div>
                <PublishResultsToggle examId={exam.id} initialStatus={exam.publishResults} />
            </div>

            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Questions</h2>
                    <QuestionList questions={exam.questions} examId={exam.id} />
                </div>
                <div>
                    <div className="sticky top-20 space-y-4">
                        <AddQuestionForm examId={exam.id} />
                        <BulkImport examId={exam.id} />
                        <div className="pt-4 border-t">
                            <h3 className="font-semibold mb-2">Assignments</h3>
                            <BulkAssignStudents examId={exam.id} />
                            <SelectStudentsDialog examId={exam.id} availableStudents={availableStudents} />
                            <AssignGroupDialog examId={exam.id} groups={groups} />
                            <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Assigned Students</h4>
                                <AssignedStudentsList assignments={exam.assignments} examId={exam.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
