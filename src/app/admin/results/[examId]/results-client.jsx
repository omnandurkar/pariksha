"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileDown, RefreshCcw } from "lucide-react"
import { GrantReattemptButton } from "./grant-reattempt-button"
import { format } from "date-fns"

export function ResultsClient({ exam, attempts, totalMarks }) {

    // Sort attempts for consistent display (already sorted by score desc in server)
    const sortedAttempts = [...attempts];

    const handleExport = () => {
        const headers = ["Rank", "Student Name", "Email", "Score", "Total Marks", "Percentage", "Status", "Submitted At"];

        const rows = sortedAttempts.map((attempt, index) => {
            const percentage = Math.round((attempt.score / totalMarks) * 100);
            const isPassed = percentage >= exam.passingPercentage;

            return [
                index + 1,
                attempt.user.name || "N/A",
                attempt.user.email,
                attempt.score,
                totalMarks,
                `${percentage}%`,
                isPassed ? "PASSED" : "FAILED",
                format(new Date(attempt.submitTime), "dd/MM/yyyy hh:mm a")
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `results_${exam.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedAttempts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No attempts recorded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedAttempts.map((attempt, index) => {
                                const percentage = Math.round((attempt.score / totalMarks) * 100);
                                const isPassed = percentage >= exam.passingPercentage;

                                return (
                                    <TableRow key={attempt.id}>
                                        <TableCell className="font-medium">#{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{attempt.user.name}</div>
                                            <div className="text-xs text-muted-foreground">{attempt.user.email}</div>
                                        </TableCell>
                                        <TableCell>{attempt.score} / {totalMarks}</TableCell>
                                        <TableCell>{percentage}%</TableCell>
                                        <TableCell>
                                            <Badge variant={isPassed ? "default" : "destructive"}>
                                                {isPassed ? "PASSED" : "FAILED"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(attempt.submitTime), "dd/MM/yyyy")}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/results/${exam.id}/${attempt.id}`}>
                                                    Review
                                                </Link>
                                            </Button>
                                            <GrantReattemptButton userId={attempt.userId} examId={exam.id} />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
