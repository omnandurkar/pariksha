import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Lock, AlertCircle, PlayCircle, Award } from "lucide-react";
import { StudentJourneyDashboard } from "./student-journey-dashboard";

async function getData(userId) {
    const exams = await prisma.exam.findMany({
        where: {
            isActive: true,
            assignments: { some: { userId: userId } }
        },
        include: {
            _count: { select: { questions: true } },
            attempts: { where: { userId } }
        },
        orderBy: { createdAt: 'desc' }
    });

    const history = await prisma.attempt.findMany({
        where: { userId },
        include: { exam: true },
        orderBy: { startTime: 'desc' }
    });

    return { exams, history };
}

export default async function StudentDashboard() {
    const session = await auth();
    const { exams, history } = await getData(session.user.id);
    const firstName = session.user.name?.split(" ")[0] || "Student";

    // Time-based greeting (Server side rendering based on server time, client hydration might differ but acceptable for greetings)
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <div className="space-y-8 pb-10">
            {/* 1. Header with Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground/90">{greeting}, {firstName}</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Your Space to learn and grow.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border">
                    <Clock className="h-4 w-4" />
                    <span>IST: {format(new Date(), "dd/MM/yyyy hh:mm a")}</span>
                </div>
            </div>

            <Tabs defaultValue="exams" className="space-y-8">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                    <TabsTrigger
                        value="exams"
                        className="rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
                    >
                        Active Exams
                    </TabsTrigger>
                    <TabsTrigger
                        value="journey"
                        className="rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
                    >
                        My Journey
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="exams" className="space-y-8 animate-in fade-in duration-500">
                    {exams.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10">
                            <h3 className="text-lg font-medium">No exams assigned yet</h3>
                            <p className="text-muted-foreground">Relax! Nothing to worry about right now.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {exams.map((exam) => {
                                const latestAttempt = exam.attempts[0];
                                const now = new Date();
                                const start = exam.startDate ? new Date(exam.startDate) : null;
                                const end = exam.endDate ? new Date(exam.endDate) : null;

                                // Logic
                                const isUpcoming = start && start > now;
                                const isEnded = end && end < now;
                                const isActive = !isUpcoming && !isEnded;
                                const isCompleted = latestAttempt?.status === 'COMPLETED';

                                // Determine Button State & Message
                                let statusMessage = "";
                                let actionButton = null;

                                if (isCompleted) {
                                    // Check visibility logic:
                                    // 1. Explicitly published by admin
                                    // 2. Scheduled result date has passed
                                    const resultDatePassed = exam.resultDate && new Date(exam.resultDate) <= now;
                                    const shouldShowResults = exam.publishResults || resultDatePassed;

                                    if (shouldShowResults) {
                                        actionButton = (
                                            <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all hover:scale-[1.02]">
                                                <Link href={`/dashboard/results/${latestAttempt.id}`}>View Results 🎉</Link>
                                            </Button>
                                        )
                                        statusMessage = "Results are out!";
                                    } else if (exam.resultDate) {
                                        statusMessage = `Results expected on ${format(new Date(exam.resultDate), "dd/MM/yyyy")}`;
                                        actionButton = <Button disabled className="w-full" variant="secondary">Results Pending</Button>
                                    } else {
                                        statusMessage = "Results hidden by admin";
                                        actionButton = <Button disabled className="w-full" variant="secondary">Exam Completed</Button>
                                    }
                                } else if (isUpcoming) {
                                    statusMessage = `Opens on ${format(start, "dd/MM/yyyy hh:mm a")}`;
                                    actionButton = (
                                        <Button disabled className="w-full opacity-80" variant="outline">
                                            This exam isn&apos;t available for you yet.
                                        </Button>
                                    )
                                } else if (isEnded) {
                                    statusMessage = `Closed on ${format(end, "dd/MM/yyyy hh:mm a")}`;
                                    actionButton = (
                                        <Button disabled className="w-full bg-muted text-muted-foreground hover:bg-muted">
                                            Time expired
                                        </Button>
                                    )
                                } else if (latestAttempt?.status === 'STARTED') {
                                    statusMessage = "In Progress";
                                    actionButton = (
                                        <Button asChild className="w-full animate-pulse-slow font-semibold relative overflow-hidden group">
                                            <Link href={`/exam/${exam.id}/play`}>
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    Continue Exam <PlayCircle className="h-4 w-4" />
                                                </span>
                                                <span className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
                                            </Link>
                                        </Button>
                                    )
                                } else {
                                    // Ready to Start
                                    statusMessage = end ? `Closes on ${format(end, "dd/MM/yyyy hh:mm a")}` : "Active Now";
                                    actionButton = (
                                        <Button asChild className="w-full font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" size="lg">
                                            <Link href={`/dashboard/exam/${exam.id}`}>
                                                Start Exam
                                            </Link>
                                        </Button>
                                    )
                                }

                                return (
                                    <div key={exam.id} className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-500 blur-sm"></div>
                                        <Card className="relative h-full flex flex-col border-0 shadow-sm hover:shadow-md transition-all duration-300">
                                            <CardHeader>
                                                <div className="flex justify-between items-start gap-2">
                                                    <Badge variant="outline" className={`mb-2 ${isUpcoming ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : isEnded ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                                        {isUpcoming ? 'Upcoming' : isEnded ? 'Ended' : isCompleted ? 'Completed' : 'Live'}
                                                    </Badge>
                                                    {exam.issueCertificate && <Award className="h-5 w-5 text-amber-500" title="Offers Certificate" />}
                                                </div>
                                                <CardTitle className="leading-tight">{exam.title}</CardTitle>
                                                {exam.description && <CardDescription className="line-clamp-2 mt-1">{exam.description}</CardDescription>}
                                            </CardHeader>
                                            <CardContent className="flex-1 space-y-4">
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                                                    <div className="flex items-center gap-1.5" title="Duration">
                                                        <Clock className="h-4 w-4 text-primary/70" />
                                                        <span>{exam.duration}m</span>
                                                    </div>
                                                    <div className="w-px h-4 bg-border"></div>
                                                    <div className="flex items-center gap-1.5" title="Questions">
                                                        <AlertCircle className="h-4 w-4 text-primary/70" />
                                                        <span>{exam._count.questions} Qs</span>
                                                    </div>
                                                    <div className="w-px h-4 bg-border"></div>
                                                    <div className="flex items-center gap-1.5" title="Security">
                                                        <Lock className="h-3.5 w-3.5 text-primary/70" />
                                                        <span>Secure</span>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {statusMessage}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-0">
                                                {actionButton}
                                            </CardFooter>
                                        </Card>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="journey">
                    <StudentJourneyDashboard attempts={history} />
                </TabsContent>
            </Tabs>

            <footer className="text-center text-sm text-muted-foreground pt-10 pb-4 border-t mt-10">
                <p>Exams, made human.</p>
                <p className="text-xs opacity-60 mt-1">Pariksha is designed to respect both effort and attention.</p>
            </footer>
        </div>
    )
}
