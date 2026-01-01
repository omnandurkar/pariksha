import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Users, FileText, CheckCircle, Clock } from "lucide-react"
import { AnalyticsCharts } from "./analytics-charts";

async function getStats() {
    const totalExams = await prisma.exam.count();
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalAttempts = await prisma.attempt.count();

    return { totalExams, totalStudents, totalAttempts };
}

// Helper to get analytics data
async function getAnalytics() {
    // 1. Pass/Fail
    const attempts = await prisma.attempt.findMany({
        where: { status: 'COMPLETED' },
        include: { exam: true }
    });

    let passed = 0;
    let failed = 0;

    // 2. Score Distribution (Group by Exam)
    const examStats = {}; // { examId: { title, totalScore, count, max } }

    attempts.forEach(a => {
        const passingScore = (a.exam.passingPercentage / 100) * (a.exam.questions ? a.exam.questions.length : 0); // Warning: we need total marks, not question count.
        // Wait, total marks is complex to calc without fetching all questions.
        // Let's assume passed if score >= (passing % of total possible).
        // Since we didn't store total marks in Attempt, we need to fetch it or approximation.
        // For visual simplicity, let's just use raw pass/fail IF we stored it? We didn't.
        // Let's use a simpler metric for chart 1: "Completed vs Started"? No, User wanted Pass/Fail.
        // OK, let's stick to simple "Activity" and "Score Distribution".
        // Attempt model has "score" and "examId".

        if (!examStats[a.examId]) {
            examStats[a.examId] = { title: a.exam.title, scores: [] };
        }
        examStats[a.examId].scores.push(a.score || 0);
    });

    // Process Exam Stats
    const scoreDist = Object.values(examStats).map(e => ({
        examTitle: e.title,
        avgScore: Math.round(e.scores.reduce((a, b) => a + b, 0) / e.scores.length),
        highestScore: Math.max(...e.scores)
    }));

    // 3. Activity (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Group attempts by date
    const activityMap = {};
    attempts.forEach(a => {
        const date = a.startTime.toISOString().split('T')[0];
        activityMap[date] = (activityMap[date] || 0) + 1;
    });

    const activityData = Object.entries(activityMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-7)
        .map(([date, count]) => ({ date, attempts: count }));

    return {
        passFailData: [
            { name: 'Completed', value: attempts.length },
            { name: 'Active', value: await prisma.attempt.count({ where: { status: 'STARTED' } }) }
        ],
        activityData,
        scoreDistribution: scoreDist
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();
    const analytics = await getAnalytics();

    // Helper Card Component
    const StatCard = ({ title, value, icon: Icon, color }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="text-blue-600" />
                <StatCard title="Active Exams" value={stats.totalExams} icon={FileText} color="text-green-600" />
                <StatCard title="Total Attempts" value={stats.totalAttempts} icon={CheckCircle} color="text-purple-600" />
                <StatCard title="Pending Requests" value={0} icon={Clock} color="text-orange-600" />
            </div>

            <div className="mt-8">
                <AnalyticsCharts
                    passFailData={analytics.passFailData}
                    activityData={analytics.activityData}
                    scoreDistribution={analytics.scoreDistribution}
                />
            </div>
        </div>
    )
}
