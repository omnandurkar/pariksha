"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { bulkCreateQuestions } from "./actions"
import { toast } from "sonner"
import { read, utils } from "xlsx"
import Papa from "papaparse"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, FileDown, CheckCircle, AlertCircle, X, FileJson, FileSpreadsheet } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function BulkImport({ examId }) {
    const [open, setOpen] = useState(false)
    const [parsedData, setParsedData] = useState([])
    const [jsonInput, setJsonInput] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState("csv")

    // ... imports moved to top

    // ... imports

    const handleDownloadTemplate = () => {
        const csvContent = "Question Text,Option A,Option B,Option C,Option D,Correct Option (A/B/C/D),Marks\nExample Question?,Answer 1,Answer 2,Answer 3,Answer 4,A,1";
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "exam_questions_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadExcelTemplate = () => {
        const wb = utils.book_new();
        const wsData = [
            ["Question Text", "Option A", "Option B", "Option C", "Option D", "Correct Option (A/B/C/D)", "Marks"],
            ["Example Question?", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "A", 1]
        ];
        const ws = utils.aoa_to_sheet(wsData);
        utils.book_append_sheet(wb, ws, "Template");
        // write file
        import("xlsx").then(xlsx => {
            xlsx.writeFile(wb, "exam_questions_template.xlsx");
        });
    };

    const processParsedData = (data) => {
        const requiredHeaders = ["Question Text", "Option A", "Option B", "Option C", "Option D", "Correct Option (A/B/C/D)", "Marks"];

        // Check headers if possible, though for Excel user might not have row 1 as header if raw, but usually yes.
        // If data is array of objects, keys are headers.
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            const missing = requiredHeaders.filter(h => !headers.includes(h));
            if (missing.length > 0) {
                setError(`Missing columns: ${missing.join(", ")}`);
                return;
            }
        }

        const formatted = data.map((row, index) => {
            const text = row["Question Text"];
            if (!text) return null;

            const options = [
                { text: row["Option A"], isCorrect: String(row["Correct Option (A/B/C/D)"] || "").trim().toUpperCase() === 'A' },
                { text: row["Option B"], isCorrect: String(row["Correct Option (A/B/C/D)"] || "").trim().toUpperCase() === 'B' },
                { text: row["Option C"], isCorrect: String(row["Correct Option (A/B/C/D)"] || "").trim().toUpperCase() === 'C' },
                { text: row["Option D"], isCorrect: String(row["Correct Option (A/B/C/D)"] || "").trim().toUpperCase() === 'D' },
            ];

            const marks = parseInt(row["Marks"]) || 1;
            return { text, options, marks, index };
        }).filter(Boolean);

        setParsedData(formatted);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError("");

        const isCsv = file.name.endsWith(".csv");

        if (isCsv) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        setError(`Error parsing CSV: ${results.errors[0].message}`);
                        return;
                    }
                    processParsedData(results.data);
                },
                error: (err) => {
                    setError("Failed to read file.");
                }
            });
        } else {
            // Excel Handling
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = utils.sheet_to_json(ws);
                processParsedData(data);
            };
            reader.readAsBinaryString(file);
        }
    };

    const parseJsonInput = () => {
        try {
            const questions = JSON.parse(jsonInput);
            if (!Array.isArray(questions)) throw new Error("Root must be an array");

            const formatted = questions.map((q, index) => {
                if (!q.text || !Array.isArray(q.options)) {
                    throw new Error(`Item ${index + 1} is missing text or options array`);
                }
                return {
                    text: q.text,
                    options: q.options,
                    marks: q.marks || 1,
                    index
                };
            });
            setParsedData(formatted);
            setError("");
        } catch (e) {
            setError(e.message || "Invalid JSON format");
        }
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            setJsonInput(JSON.stringify(parsed, null, 2));
            setError("");
        } catch (e) {
            setError("Cannot format: Invalid JSON");
        }
    };

    const handleImport = async () => {
        if (parsedData.length === 0) return;

        setIsPending(true);
        const result = await bulkCreateQuestions(examId, parsedData);

        if (result.success) {
            toast.success(`Successfully added ${result.count} questions.`);
            setOpen(false);
            setParsedData([]);
            setJsonInput("");
        } else {
            toast.error(result.error);
        }
        setIsPending(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Bulk Import
                </Button>
            </DialogTrigger>
            {/* removed w-[95vw] from the below line and made it cool */}
            <DialogContent className=" sm:max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-lg">
                <DialogHeader className="p-6 pb-4 shrink-0">
                    <DialogTitle>Import Questions</DialogTitle>
                    <DialogDescription>
                        Add multiple questions at once using CSV, Excel, or JSON.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="csv" className="flex-1 flex flex-col min-h-0" onValueChange={setActiveTab}>
                    <div className="px-6 shrink-0">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="csv"><FileSpreadsheet className="mr-2 h-4 w-4" /> CSV / Excel</TabsTrigger>
                            <TabsTrigger value="json"><FileJson className="mr-2 h-4 w-4" /> JSON</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 flex flex-col mt-4 min-h-0 overflow-y-auto">
                        <TabsContent value="csv" className="flex-1 flex flex-col space-y-4 px-6 pb-6 data-[state=inactive]:hidden">
                            <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg border border-blue-200 dark:border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                                <div className="text-sm text-blue-900 dark:text-blue-100">
                                    <p className="font-semibold mb-1">Step 1: Get the format</p>
                                    <p className="text-blue-700 dark:text-blue-300">Download the template file to see the required columns.</p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="outline" className="bg-white dark:bg-blue-950/50 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                                            <FileDown className="mr-2 h-4 w-4" /> Download Template <ChevronDown className="ml-2 h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={handleDownloadTemplate}>
                                            <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV Format (.csv)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleDownloadExcelTemplate}>
                                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel Format (.xlsx)
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="bg-muted/30 dark:bg-muted/10 p-6 rounded-lg border border-dashed border-muted-foreground/25 hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors flex flex-col items-center justify-center text-center">
                                <Label htmlFor="csv" className="cursor-pointer space-y-3">
                                    <div className="h-12 w-12 bg-background dark:bg-muted rounded-full flex items-center justify-center mx-auto border shadow-sm">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-foreground">Click to upload CSV or Excel</div>
                                        <div className="text-xs text-muted-foreground">Supported: .csv, .xlsx, .xls</div>
                                    </div>
                                </Label>
                                <Input id="csv" type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                            </div>
                        </TabsContent>

                        <TabsContent value="json" className="flex-1 flex flex-col space-y-4 px-6 pb-6 data-[state=inactive]:hidden">
                            <div className="space-y-2 flex-1 flex flex-col">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="json">Paste JSON Array</Label>
                                    <Button variant="ghost" size="sm" onClick={formatJson} className="h-6 text-xs text-muted-foreground hover:text-primary">
                                        Format / Pretty Print
                                    </Button>
                                </div>
                                <Textarea
                                    id="json"
                                    placeholder={`[\n  {\n    "text": "Question?",\n    "marks": 1,\n    "options": [\n      { "text": "A", "isCorrect": true },\n      { "text": "B", "isCorrect": false }\n    ]\n  }\n]`}
                                    className="flex-1 font-mono text-xs min-h-[200px] resize-none leading-relaxed bg-background"
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                />
                                <Button size="sm" variant="secondary" onClick={parseJsonInput} disabled={!jsonInput}>
                                    Validate & Preview JSON
                                </Button>
                            </div>
                        </TabsContent>

                        {error && (
                            <div className="mx-6 mt-0 mb-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 p-3 rounded-md text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 flex-shrink-0 border border-red-100 dark:border-red-900/50">
                                <AlertCircle className="h-4 w-4" /> {error}
                            </div>
                        )}

                        {parsedData.length > 0 && (
                            <div className=" mx-6 mt-0 mb-6 flex flex-col overflow-hidden border rounded-md animate-in fade-in zoom-in-95 duration-300 flex-shrink-0 h-[300px] shadow-sm bg-background">
                                <div className="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground border-b flex justify-between items-center bg-muted/50 dark:bg-muted/20 backdrop-blur sticky top-0 z-20">
                                    <div className="flex items-center gap-2">
                                        <FileJson className="h-4 w-4 text-primary" />
                                        <span>Preview ({parsedData.length} questions)</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => { setParsedData([]); setError(""); }} className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors">
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                                <ScrollArea className="px-10 flex-1 h-full bg-background">
                                    <Table>
                                        <TableHeader className="bg-muted/50 dark:bg-muted/20 sticky top-0 z-10">
                                            <TableRow className="hover:bg-transparent border-b border-border">
                                                <TableHead className="w-[50px] font-semibold text-foreground">#</TableHead>
                                                <TableHead className="font-semibold text-foreground">Question Details</TableHead>
                                                <TableHead className="w-[70px] font-semibold text-center text-foreground">Marks</TableHead>
                                                <TableHead className="w-[100px] font-semibold text-right pr-4 text-foreground">Validation</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {parsedData.map((q, i) => (
                                                <TableRow key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 group border-b dark:border-slate-800">
                                                    <TableCell className="text-muted-foreground font-mono text-xs">{i + 1}</TableCell>
                                                    <TableCell>
                                                        <div className="font-medium text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">{q.text}</div>
                                                        <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                                                            {q.options?.find(o => o.isCorrect)?.text ? (
                                                                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50 font-medium">
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    <span className="truncate max-w-[200px]">{q.options.find(o => o.isCorrect)?.text}</span>
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20 font-medium">
                                                                    <AlertCircle className="h-3 w-3" /> No correct answer
                                                                </span>
                                                            )}
                                                            <span className="inline-flex items-center gap-1 text-muted-foreground bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-slate-700">
                                                                {q.options?.length || 0} Options
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-mono text-xs">{q.marks}</TableCell>
                                                    <TableCell className="text-right pr-4">
                                                        {q.options?.some(o => o.isCorrect) ? (
                                                            <div className="inline-flex items-center justify-end gap-1.5 text-emerald-600 dark:text-emerald-500">
                                                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                                <span className="text-xs font-medium">Ready</span>
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center justify-end gap-1.5 text-destructive">
                                                                <span className="h-2 w-2 rounded-full bg-destructive" />
                                                                <span className="text-xs font-medium">Error</span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                        )}
                    </div>
                </Tabs>

                <DialogFooter className="gap-4 sm:gap-2 p-6 pt-2 shrink-0">
                    <Button variant="destructive" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleImport}
                        disabled={isPending || parsedData.length === 0 || parsedData.some(q => !q.options?.some(o => o.isCorrect))}
                        className={parsedData.some(q => !q.options?.some(o => o.isCorrect)) ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        {isPending ? "Importing..." : `Import ${parsedData.length} Questions`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
