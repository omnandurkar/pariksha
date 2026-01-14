"use client"

import { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
import { AlertCircle, CheckCircle2, TrendingUp, HelpCircle, Clock } from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AnalyticsView({ exam, attempts }) {
    // 1. Calculate Question Difficulty
    const questionStats = useMemo(() => {
        if (!exam.questions || attempts.length === 0) return [];

        return exam.questions.map((q, index) => {
            let correctCount = 0;
            let attemptedCount = 0;

            attempts.forEach(attempt => {
                const answer = attempt.answers.find(a => a.questionId === q.id);
                if (answer) {
                    attemptedCount++;
                    // Logic assumes we can check correctness. 
                    // Usually correctness is stored in answer or we check if selectedOption.isCorrect
                    // Let's assume the answer has 'isCorrect' or we check options.
                    // The 'answers' include 'selectedOption'. We need 'selectedOption.isCorrect'.
                    if (answer.selectedOption?.isCorrect) {
                        correctCount++;
                    }
                }
            });

            // Difficulty Index: % of students who got it WRONG (higher is harder)
            const correctParam = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
            const difficultyIndex = 100 - correctParam;

            return {
                id: q.id,
                text: q.text,
                qNum: `Q${index + 1}`,
                difficultyIndex: Math.round(difficultyIndex),
                correctRate: Math.round(correctParam),
                attemptedRate: Math.round((attemptedCount / attempts.length) * 100)
            };
        }).sort((a, b) => b.difficultyIndex - a.difficultyIndex); // Hardest first
    }, [exam.questions, attempts]);


    // 2. Score Distribution
    const scoreDistribution = useMemo(() => {
        const buckets = [
            { name: '0-20%', count: 0 },
            { name: '21-40%', count: 0 },
            { name: '41-60%', count: 0 },
            { name: '61-80%', count: 0 },
            { name: '81-100%', count: 0 },
        ];

        const totalMarks = exam.questions.reduce((sum, q) => sum + (q.marks || 1), 0);

        attempts.forEach(a => {
            const percentage = (a.score / totalMarks) * 100;
            if (percentage <= 20) buckets[0].count++;
            else if (percentage <= 40) buckets[1].count++;
            else if (percentage <= 60) buckets[2].count++;
            else if (percentage <= 80) buckets[3].count++;
            else buckets[4].count++;
        });

        return buckets;
    }, [attempts, exam.questions]);

    const averageScore = useMemo(() => {
        if (attempts.length === 0) return 0;
        const total = attempts.reduce((sum, a) => sum + a.score, 0);
        return Math.round(total / attempts.length);
    }, [attempts]);

    const averageTime = useMemo(() => {
        if (attempts.length === 0) return 0;
        const totalMinutes = attempts.reduce((sum, a) => {
            if (!a.submitTime || !a.startTime) return sum;
            const diff = new Date(a.submitTime) - new Date(a.startTime);
            return sum + (diff / 60000); // ms to minutes
        }, 0);
        return Math.round(totalMinutes / attempts.length);
    }, [attempts]);

    const hardestQuestions = questionStats.slice(0, 5);

    if (attempts.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">No data available for analysis yet.</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageScore}</div>
                        <p className="text-xs text-muted-foreground">Class average</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Participants</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attempts.length}</div>
                        <p className="text-xs text-muted-foreground">Total students</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageTime}</div>
                        <p className="text-xs text-muted-foreground">In minutes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hardest Question</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{hardestQuestions[0]?.qNum || "-"}</div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{hardestQuestions[0]?.text || "-"}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Score Distribution Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Score Distribution</CardTitle>
                        <CardDescription>How students performed across score ranges</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scoreDistribution}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Question Difficulty Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Question Difficulty</CardTitle>
                        <CardDescription>Questions with highest failure rates</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] pl-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hardestQuestions} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="qNum" type="category" width={40} fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="difficultyIndex" name="Failure Rate %" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Hardest Questions List */}
            <Card>
                <CardHeader>
                    <CardTitle>Top 5 Hardest Questions</CardTitle>
                    <CardDescription>Focus your revision on these topics.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {hardestQuestions.map(q => (
                            <div key={q.id} className="flex items-start gap-4 p-3 bg-muted/40 rounded-lg">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 font-bold text-sm">
                                    {q.difficultyIndex}%
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium text-sm leading-none flex items-center gap-2">
                                        {q.qNum}
                                        <span className="text-muted-foreground font-normal">• {q.correctRate}% Correct</span>
                                    </p>
                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                        <div dangerouslySetInnerHTML={{ __html: q.text }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
