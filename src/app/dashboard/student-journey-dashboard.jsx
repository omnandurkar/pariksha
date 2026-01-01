"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { CheckCircle2, TrendingUp, Award, Clock } from "lucide-react"

export function StudentJourneyDashboard({ attempts }) {
    // Process data for charts
    const chartData = attempts
        .filter(a => a.status === 'COMPLETED')
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .map(a => ({
            date: new Date(a.startTime).toLocaleDateString(),
            score: a.score || 0,
            exam: a.exam.title
        }));

    const totalExams = attempts.filter(a => a.status === 'COMPLETED').length;
    const avgScore = totalExams > 0
        ? Math.round(attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalExams)
        : 0;

    // Improvement calculation (last vs average of rest)
    const recentScore = chartData.length > 0 ? chartData[chartData.length - 1].score : 0;
    const improvement = recentScore - avgScore;

    return (
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">History Log</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Exams Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalExams}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            <Award className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgScore}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Performance</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{recentScore}</div>
                            <p className="text-xs text-muted-foreground">
                                {improvement > 0 ? `+${improvement} above average` : `${improvement} from average`}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Time Spent</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-- hrs</div> {/* Needs calculation but schema doesn't store duration easily yet */}
                            <p className="text-xs text-muted-foreground">Across all exams</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-1">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Performance Trend</CardTitle>
                            <CardDescription>Your score progression over time.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px' }}
                                            cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    No data available yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="history">
                <Card>
                    <CardHeader>
                        <CardTitle>Exam History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {attempts.length === 0 ? <p className="text-center py-4">No attempts found.</p> : attempts.map(attempt => (
                                <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-semibold">{attempt.exam.title}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(attempt.startTime).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">{attempt.score || 0} Marks</div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${attempt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {attempt.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
