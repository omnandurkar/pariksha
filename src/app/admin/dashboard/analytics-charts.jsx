"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from "recharts"

const COLORS = ['#22c55e', '#ef4444', '#eab308', '#3b82f6'];

export function AnalyticsCharts({ passFailData, activityData, scoreDistribution }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* 1. Pass vs Fail Ratio */}
            <Card className="col-span-1 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Pass vs Fail Ratio</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={passFailData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {passFailData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 2. Recent Exam Activity (Line) */}
            <Card className="col-span-1 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Recent Activity (Attempts)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="attempts" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 3. Score Distribution (Bar) */}
            <Card className="col-span-2 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Score Performance Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreDistribution}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="examTitle" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="avgScore" fill="#8884d8" radius={[4, 4, 0, 0]} name="Avg Score" />
                            <Bar dataKey="highestScore" fill="#82ca9d" radius={[4, 4, 0, 0]} name="High Score" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
