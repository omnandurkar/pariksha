import { CreateExamForm } from "./create-form"

export default function CreateExamPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create Exam</h1>
            </div>
            <div className="border p-6 rounded-lg bg-card">
                <CreateExamForm />
            </div>
        </div>
    )
}
