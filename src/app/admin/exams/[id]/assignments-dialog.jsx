"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserPlus, Search, Users, FileJson, CheckSquare } from "lucide-react"
import { bulkCreateAndAssign } from "./assign-actions"
import { assignGroupToExam } from "./assign-group-action"
import { toast } from "sonner"

export function AssignmentsDialog({ examId, availableStudents, groups }) {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("select")

    // --- State: Select Existing ---
    const [search, setSearch] = useState("")
    const [selectedIds, setSelectedIds] = useState(new Set())
    const [isAssigningSelect, setIsAssigningSelect] = useState(false)

    // --- State: Bulk Create/Assign (JSON) ---
    const [jsonInput, setJsonInput] = useState("")
    const [isAssigningJson, setIsAssigningJson] = useState(false)

    // --- State: Assign Group ---
    const [selectedGroupId, setSelectedGroupId] = useState("")
    const [isAssigningGroup, setIsAssigningGroup] = useState(false)


    // ------------------------------------------------------------------
    // Handler: Select Existing
    // ------------------------------------------------------------------
    const filteredStudents = availableStudents.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleToggleSelect = (studentId) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(studentId)) newSelected.delete(studentId)
        else newSelected.add(studentId)
        setSelectedIds(newSelected)
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredStudents.length) setSelectedIds(new Set())
        else setSelectedIds(new Set(filteredStudents.map(s => s.id)))
    }

    const handleAssignSelected = async () => {
        if (selectedIds.size === 0) return toast.error("Please select students")
        setIsAssigningSelect(true)
        const emails = availableStudents.filter(s => selectedIds.has(s.id)).map(s => s.email)
        const result = await bulkCreateAndAssign(examId, emails)
        setIsAssigningSelect(false)
        if (result.error) toast.error(result.error)
        else {
            toast.success(result.message)
            setOpen(false)
            setSelectedIds(new Set())
        }
    }

    // ------------------------------------------------------------------
    // Handler: Bulk JSON
    // ------------------------------------------------------------------
    const handleAssignJson = async () => {
        try {
            const parsed = JSON.parse(jsonInput)
            if (!Array.isArray(parsed)) throw new Error("Input must be array")
            setIsAssigningJson(true)
            const result = await bulkCreateAndAssign(examId, parsed)
            setIsAssigningJson(false)
            if (result.error) toast.error(result.error)
            else {
                toast.success(result.message)
                setOpen(false)
                setJsonInput("")
            }
        } catch (e) {
            toast.error("Invalid JSON")
        }
    }

    // ------------------------------------------------------------------
    // Handler: Group
    // ------------------------------------------------------------------
    const handleAssignGroup = async () => {
        if (!selectedGroupId) return
        setIsAssigningGroup(true)
        const result = await assignGroupToExam(examId, selectedGroupId)
        setIsAssigningGroup(false)
        if (result.error) toast.error(result.error)
        else {
            toast.success("Group assigned successfully")
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" /> Assign Students...
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-y-auto sm:overflow-hidden rounded-lg">
                <DialogHeader className="p-6 pb-4 shrink-0">
                    <DialogTitle>Assign Students to Exam</DialogTitle>
                    <DialogDescription>
                        Choose a method to assign students.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 shrink-0">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="select"><CheckSquare className="mr-2 h-4 w-4" /> Select Existing</TabsTrigger>
                            <TabsTrigger value="json"><FileJson className="mr-2 h-4 w-4" /> Bulk / Create</TabsTrigger>
                            <TabsTrigger value="group"><Users className="mr-2 h-4 w-4" /> Assign Group</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Tab 1: Select Existing */}
                    <TabsContent value="select" className="flex-1 flex flex-col min-h-0 mt-4 data-[state=inactive]:hidden">
                        <div className="px-6 shrink-0 mb-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0 px-6">
                            <div className="border rounded-md">
                                {filteredStudents.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">No students found.</div>
                                ) : (
                                    <div className="divide-y">
                                        <div className="flex items-center space-x-3 p-3 hover:bg-muted transition-colors cursor-pointer bg-muted/80 backdrop-blur supports-backdrop-filter:bg-muted/60 sticky top-0 z-10 border-b" onClick={toggleSelectAll}>
                                            <Checkbox checked={selectedIds.size > 0 && selectedIds.size === filteredStudents.length} />
                                            <div className="text-sm font-medium">Select All</div>
                                        </div>
                                        {filteredStudents.map(student => (
                                            <div key={student.id} className="flex items-center space-x-3 p-3 hover:bg-muted/80 transition-colors cursor-pointer group" onClick={() => handleToggleSelect(student.id)}>
                                                <Checkbox checked={selectedIds.has(student.id)} />
                                                <div className="overflow-hidden">
                                                    <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{student.name}</div>
                                                    <div className="text-xs text-muted-foreground truncate">{student.email}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 pt-4 border-t mt-auto shrink-0 bg-background z-20">
                            <Button onClick={handleAssignSelected} disabled={isAssigningSelect || selectedIds.size === 0} className="w-full">
                                {isAssigningSelect ? "Assigning..." : `Assign ${selectedIds.size} Selected Students`}
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Tab 2: Bulk JSON */}
                    <TabsContent value="json" className="flex-1 flex flex-col min-h-0 mt-4 px-6 pb-6 space-y-4 data-[state=inactive]:hidden overflow-y-auto">
                        <div className="flex-1 space-y-2 flex flex-col">
                            <div className="flex items-center justify-between">
                                <Label>JSON Input (Emails or Objects)</Label>
                            </div>
                            <div className="bg-muted/50 rounded-md p-3 text-xs text-muted-foreground border mb-2">
                                Paste a list of emails directly, or user objects to create accounts on the fly.
                                <pre className="mt-2 bg-background p-2 rounded border font-mono text-[10px] overflow-x-auto">
                                    {`[
  "student@example.com",
  {
    "name": "New Person",
    "email": "new@example.com",
    "password": "pass"
  }
]`}
                                </pre>
                            </div>
                            <Textarea
                                className="flex-1 font-mono text-xs min-h-[200px] resize-none"
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder="Paste your JSON here..."
                            />
                        </div>
                        <Button onClick={handleAssignJson} disabled={isAssigningJson || !jsonInput} className="w-full shrink-0">
                            {isAssigningJson ? "Processing..." : "Process Bulk Import"}
                        </Button>
                    </TabsContent>

                    {/* Tab 3: Group */}
                    <TabsContent value="group" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden">
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Assign an Entire Group</h3>
                            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                                All members of the selected group will be assigned to this exam immediately.
                            </p>
                            <div className="w-full max-w-sm space-y-4">
                                <Select onValueChange={setSelectedGroupId} value={selectedGroupId}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a group..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {groups.map(g => (
                                            <SelectItem key={g.id} value={g.id}>
                                                {g.name} ({g._count?.members || 0} members)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAssignGroup} disabled={isAssigningGroup || !selectedGroupId} className="w-full">
                                    {isAssigningGroup ? "Assigning..." : "Assign Group"}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
