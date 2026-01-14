"use client"

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteQuestion } from "./actions"
import { toast } from "sonner"
import { useState } from "react"
import { MathText } from "@/components/math-text"

export function QuestionList({ questions, examId }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this question?")) return;
        setDeletingId(id);
        const result = await deleteQuestion(id, examId);
        setDeletingId(null);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Question deleted");
        }
    }

    if (questions.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No questions added yet.</div>
    }

    return (
        <div className="space-y-4">
            {questions.map((q, index) => (
                <Card key={q.id}>
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <div className="font-semibold text-lg flex gap-2">
                            <span className="text-muted-foreground">{index + 1}.</span>
                            <MathText text={q.text} />
                        </div>
                        <Button variant="ghost" size="icon" disabled={deletingId === q.id} onClick={() => handleDelete(q.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        {q.options.map((opt) => (
                            <div key={opt.id} className={`flex items-center gap-2 px-3 py-2 rounded border ${opt.isCorrect ? 'bg-green-50 border-green-200' : 'bg-background'}`}>
                                <div className={`h-2 w-2 rounded-full ${opt.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <div className={`h-2 w-2 rounded-full ${opt.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className={opt.isCorrect ? 'font-medium text-green-700' : ''}><MathText text={opt.text} /></span>
                                {opt.isCorrect && <Badge variant="secondary" className="ml-auto text-xs bg-green-100 text-green-800 hover:bg-green-100">Correct</Badge>}
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground pt-0">
                        Marks: {q.marks}
                    </CardFooter>
                </Card>
            ))
            }
        </div >
    )
}
