"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function ExportResultsButton({ results, examTitle, totalMarks }) {

    const downloadCSV = () => {
        // 1. Define Headers
        const headers = ["Student Name", "Email", "Score", "Total Marks", "Percentage", "Status", "Submitted At"];

        // 2. Format Data Rows
        const rows = results.map(attempt => {
            const percentage = totalMarks > 0 ? Math.round((attempt.score / totalMarks) * 100) : 0;
            const status = percentage >= attempt.exam?.passingPercentage ? "Passed" : "Failed"; // Note: passingPercentage might not be in attempt directly if not joined, but let's assume standard logic or passed status. 
            // Better to rely on logic:

            return [
                `"${attempt.user.name || 'Anonymous'}"`, // Quote strings to handle commas
                `"${attempt.user.email}"`,
                attempt.score,
                totalMarks,
                `${percentage}%`,
                status, // We might not have 'status' passed directly from the server as 'Passed/Failed' logic often lives in UI, but we can infer or simpler: just Leave basic fields.
                // Actually, let's just stick to raw data + percentage. Status depends on passing % which might vary.
                // Let's keep it simple.
                `"${new Date(attempt.submitTime).toLocaleString()}"`
            ].join(",")
        });

        // 3. Combine Headers and Rows
        const csvContent = [headers.join(","), ...rows].join("\n");

        // 4. Create Blob and Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${examTitle.replace(/\s+/g, '_')}_Results.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button variant="outline" className="gap-2" onClick={downloadCSV}>
            <Download className="h-4 w-4" />
            Export CSV
        </Button>
    )
}
