"use client";

import { useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { bulkDeleteExams } from "./actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ExamsClient({ initialExams }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(initialExams.map(e => e.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (checked, id) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        setIsDeleting(true);
        try {
            const result = await bulkDeleteExams(selectedIds);
            if (result.success) {
                toast.success(`Successfully deleted ${selectedIds.length} exams`);
                setSelectedIds([]);
                setShowConfirm(false);
            } else {
                toast.error(result.error || "Failed to delete exams");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-medium">{selectedIds.length} selected</span>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowConfirm(true)}
                        disabled={isDeleting}
                        className="gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Selected
                    </Button>
                </div>
            )}

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={initialExams.length > 0 && selectedIds.length === initialExams.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Questions</TableHead>
                            <TableHead>Attempts</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialExams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No exams found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialExams.map((exam) => (
                                <TableRow key={exam.id} data-state={selectedIds.includes(exam.id) && "selected"}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(exam.id)}
                                            onCheckedChange={(checked) => handleSelectOne(checked, exam.id)}
                                        />
                                    </TableCell>
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
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/exams/${exam.id}`}>Manage</Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {selectedIds.length} selected exams and ALL associated questions, attempts, and results. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleBulkDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Exams"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
