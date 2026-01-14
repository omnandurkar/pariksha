import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { CertificateDownload } from "@/components/certificate-download"
import { RequestRetestDialog } from "./retest-dialog"
import { ConfettiCelebration } from "@/components/confetti-celebration"
import { format } from "date-fns"
import { PDFDownloadButton } from "@/components/pdf-download-button"
import { Leaderboard } from "@/components/leaderboard"

import { FlippableCardRoot, FlipFront, FlipBack, FlipTrigger } from "@/components/flippable-card"
import { Trophy, RotateCcw } from "lucide-react"

export default async function ResultPage({ params }) {
    // ... (existing params/auth/db logic is unchanged until return) ...
    const { id } = await params
    const session = await auth()

    const attempt = await prisma.attempt.findUnique({
        where: { id },
        include: {
            exam: {
                include: { questions: true }
            },
            answers: {
                include: { question: true, selectedOption: true }
            }
        }
    })

    if (!attempt || (attempt.userId !== session.user.id && session.user.role !== 'ADMIN')) {
        return notFound()
    }

    // Result Visibility Logic
    const now = new Date();
    const resultDate = attempt.exam.resultDate ? new Date(attempt.exam.resultDate) : null;
    const isResultPublished = attempt.exam.publishResults || (resultDate && resultDate <= now);

    if (!isResultPublished) {
        // ... (existing unpublished view remains unchanged) ...
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 max-w-md mx-auto text-center px-4 animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4">
                    <CheckCircle className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">You did your part.</h1>
                <p className="text-xl text-muted-foreground">Take a deep breath. Your answers have been submitted safely.</p>

                {resultDate ? (
                    <div className="bg-muted px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Results available on {format(resultDate, "dd/MM/yyyy")} at {format(resultDate, "hh:mm a")}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Results will be declared by your instructor soon.</p>
                )}

                <Button asChild variant="outline" className="mt-8">
                    <Link href="/dashboard">Back to Your Space</Link>
                </Button>
            </div>
        )
    }

    // Calculations
    const totalQuestions = attempt.exam.questions ? attempt.exam.questions.length : attempt.answers.length;
    const totalMaxMarks = attempt.exam.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    const percentage = totalMaxMarks > 0 ? Math.round((attempt.score / totalMaxMarks) * 100) : 0;
    const isPassed = percentage >= attempt.exam.passingPercentage;

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-6 animate-in slide-in-from-bottom-8 duration-700 perspective-[2000px]">
            {isPassed && <ConfettiCelebration />}

            <FlippableCardRoot>
                {/* FRONT FACE: RESULT CARD */}
                <FlipFront>
                    <div id="printable-result-card">
                        <Card className="text-center py-8 relative overflow-hidden border-t-4 border-t-primary h-full min-h-[600px] shadow-lg">
                            {isPassed && <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle className="h-32 w-32" /></div>}

                            <CardHeader>
                                <div className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-medium mb-4 mx-auto">
                                    Results Declared 🎉
                                </div>
                                <CardTitle className="text-4xl font-bold">{attempt.exam.title}</CardTitle>
                                <p className="text-muted-foreground">Detailed Performance Report</p>
                            </CardHeader>
                            <CardContent>
                                <div className="text-7xl font-bold text-primary mb-2 tracking-tighter">{percentage}%</div>
                                <div className={`text-lg font-medium ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
                                    {isPassed ? 'Excellent Work! You Passed.' : 'Keep Learning. You can do better.'}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">Score: {attempt.score} / {totalMaxMarks}</div>

                                <div className="grid grid-cols-2 gap-4 mt-8 max-w-xs mx-auto text-left">
                                    <div className="bg-muted/50 p-4 rounded-xl border">
                                        <div className="text-xs text-muted-foreground uppercase font-bold">Total Questions</div>
                                        <div className="text-2xl font-bold text-gray-700">{totalQuestions}</div>
                                    </div>
                                    <div className="bg-muted/50 p-4 rounded-xl border">
                                        <div className="text-xs text-muted-foreground uppercase font-bold">Attempted</div>
                                        <div className="text-2xl font-bold text-gray-700">{attempt.answers.length}</div>
                                    </div>
                                </div>
                            </CardContent>

                            {attempt.adminRemark && (
                                <CardContent className="pt-0 pb-6 border-t mt-4">
                                    <div className="mt-4 text-left bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <h3 className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                            Instructor Remark
                                        </h3>
                                        <p className="text-blue-800 text-sm whitespace-pre-wrap pl-4">{attempt.adminRemark}</p>
                                    </div>
                                </CardContent>
                            )}

                            {isPassed && attempt.exam.issueCertificate && (
                                <div className="py-6 border-t mt-4 px-6 bg-gradient-to-b from-transparent to-yellow-50/30">
                                    <CertificateDownload
                                        studentName={session.user.name}
                                        examTitle={attempt.exam.title}
                                        score={attempt.score}
                                        total={totalMaxMarks}
                                        date={attempt.submitTime}
                                    />
                                </div>
                            )}

                            <div className="mt-4 px-6 pb-2">
                                <RequestRetestDialog attempt={attempt} />
                            </div>

                            <CardFooter className="justify-center pt-8 flex-col gap-3">
                                <div className="flex gap-2 w-full justify-center">
                                    <Button asChild variant="outline" className="w-full sm:w-auto">
                                        <Link href="/dashboard">Return to Your Space</Link>
                                    </Button>
                                    <PDFDownloadButton targetId="printable-result-card" fileName={`${attempt.exam.title}-result.pdf`} />
                                </div>

                                {attempt.exam.showLeaderboard && (
                                    <FlipTrigger variant="ghost" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 mt-2">
                                        <Trophy className="mr-2 h-4 w-4" />
                                        View Class Leaderboard
                                    </FlipTrigger>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </FlipFront>

                {/* BACK FACE: LEADERBOARD */}
                <FlipBack>
                    <Card className="h-full min-h-[600px] border-t-4 border-t-yellow-500 shadow-lg bg-yellow-50/30 dark:bg-zinc-950 flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                            <CardTitle className="text-xl font-bold flex items-center gap-2 text-yellow-700">
                                <Trophy className="h-6 w-6 text-yellow-500" />
                                Class Leaderboard
                            </CardTitle>
                            <FlipTrigger variant="ghost" size="icon">
                                <RotateCcw className="h-4 w-4" />
                            </FlipTrigger>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-6">
                            <Leaderboard examId={attempt.examId} currentUserId={session.user.id} variant="simple" />
                        </CardContent>
                        <CardFooter className="border-t pt-6 justify-center bg-muted/20">
                            <FlipTrigger variant="outline" className="w-full sm:w-auto">
                                Back to Results
                            </FlipTrigger>
                        </CardFooter>
                    </Card>
                </FlipBack>
            </FlippableCardRoot>
        </div>
    )
}
