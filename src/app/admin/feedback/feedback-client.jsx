"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Star, FileDown, CheckCircle, RefreshCcw, Filter } from "lucide-react";
import { toast } from "sonner";
import { updateFeedbackStatus } from "@/actions/feedback";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export function FeedbackClient({ initialFeedbacks }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isUpdating, setIsUpdating] = useState(false);

    // Filter states
    const statusFilter = searchParams.get("status") || "ALL";
    const categoryFilter = searchParams.get("category") || "ALL";
    const ratingFilter = searchParams.get("rating") || "ALL";

    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value === "ALL") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`?${params.toString()}`);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setIsUpdating(true);
        try {
            await updateFeedbackStatus(id, newStatus);
            toast.success("Status updated");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleExport = () => {
        // Convert initialFeedbacks to CSV
        const headers = ["ID", "Category", "Rating", "Text", "User Email", "Status", "Date"];
        const rows = initialFeedbacks.map(f => [
            f.id,
            f.category || "N/A",
            f.rating || "N/A",
            `"${f.text.replace(/"/g, '""')}"`, // Escape quotes
            f.user?.email || (f.isAnonymous ? "Anonymous" : "Unknown"),
            f.status,
            new Date(f.createdAt).toISOString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `pariksha_feedback_${format(new Date(), "yyyy-MM-dd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex flex-wrap gap-2 items-center">
                    <Filter className="h-4 w-4 text-muted-foreground mr-2" />

                    <Select value={statusFilter} onValueChange={(v) => handleFilterChange("status", v)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="REVIEWED">Reviewed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={categoryFilter} onValueChange={(v) => handleFilterChange("category", v)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Categories</SelectItem>
                            <SelectItem value="EXPERIENCE">Experience</SelectItem>
                            <SelectItem value="SUGGESTION">Suggestion</SelectItem>
                            <SelectItem value="BUG">Bug</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={ratingFilter} onValueChange={(v) => handleFilterChange("rating", v)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Rating" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Ratings</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Clear Filters Button could go here */}
                </div>

                <Button variant="outline" onClick={handleExport} className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {/* List */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead className="w-[120px]">Category</TableHead>
                                <TableHead className="w-[100px]">Rating</TableHead>
                                <TableHead>Feedback</TableHead>
                                <TableHead className="w-[200px]">User</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead className="w-[100px] text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialFeedbacks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        No feedback found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                initialFeedbacks.map((item) => (
                                    <TableRow key={item.id} className="group">
                                        <TableCell className="text-muted-foreground text-xs">
                                            {format(new Date(item.createdAt), "MMM d, yyyy HH:mm")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                item.category === 'BUG' ? "bg-red-50 text-red-700 border-red-200" :
                                                    item.category === 'SUGGESTION' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                        "bg-green-50 text-green-700 border-green-200"
                                            }>
                                                {item.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item.rating ? (
                                                <div className="flex gap-0.5">
                                                    {[...Array(item.rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                            ) : <span className="text-muted-foreground text-xs">-</span>}
                                        </TableCell>
                                        <TableCell className="max-w-[400px]">
                                            <p className="line-clamp-2 group-hover:line-clamp-none transition-all duration-200">
                                                {item.text}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                {item.isAnonymous ? (
                                                    <span className="text-muted-foreground italic">Anonymous</span>
                                                ) : (
                                                    <span className="font-medium text-sm">{item.user?.email}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'NEW' ? 'default' : 'secondary'}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.status === 'NEW' ? (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleStatusUpdate(item.id, 'REVIEWED')}
                                                    title="Mark as Received/Reviewed"
                                                    disabled={isUpdating}
                                                >
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleStatusUpdate(item.id, 'NEW')}
                                                    title="Mark as New"
                                                    disabled={isUpdating}
                                                >
                                                    <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
