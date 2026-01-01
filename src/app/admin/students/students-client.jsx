"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { bulkDeleteStudents } from "./actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EditStudentDialog } from "./edit-student-dialog";
import { DeleteStudentButton } from "./delete-student-button";
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

export function StudentsClient({ initialStudents }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(initialStudents.map(s => s.id));
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
            const result = await bulkDeleteStudents(selectedIds);
            if (result.success) {
                toast.success(`Successfully deleted ${selectedIds.length} students`);
                setSelectedIds([]);
                setShowConfirm(false);
            } else {
                toast.error(result.error || "Failed to delete students");
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
                                    checked={initialStudents.length > 0 && selectedIds.length === initialStudents.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialStudents.map((student) => (
                                <TableRow key={student.id} data-state={selectedIds.includes(student.id) && "selected"}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(student.id)}
                                            onCheckedChange={(checked) => handleSelectOne(checked, student.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <EditStudentDialog student={student} />
                                            <DeleteStudentButton id={student.id} />
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
                            This will permanently delete {selectedIds.length} selected students and all their data (results, attempts). This action cannot be undone.
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
                            {isDeleting ? "Deleting..." : "Delete Students"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
