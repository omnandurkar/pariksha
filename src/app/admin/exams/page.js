import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import { ExamsClient } from "./exams-client";

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

            <ExamsClient initialExams={exams} />
        </div>
    );
}
