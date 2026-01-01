"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Timer, MousePointer2, AlertTriangle, ShieldCheck, HeartPulse } from "lucide-react"
import { startExam } from "./start-exam-action"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function PreExamView({ exam, userId }) {
    const router = useRouter()
    const [step, setStep] = useState("instructions") // instructions, calm, starting
    const [agreed, setAgreed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [timeLeft, setTimeLeft] = useState(5) // 5 seconds calm mode

    // Calm Mode Timer
    useEffect(() => {
        if (step === "calm" && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
            return () => clearInterval(timer)
        } else if (step === "calm" && timeLeft === 0) {
            handleStart()
        }
    }, [step, timeLeft])

    const handleProceed = () => {
        setStep("calm")
    }

    const handleStart = async () => {
        setIsLoading(true)
        const result = await startExam(exam.id, userId)
        if (result.success) {
            router.push(result.redirectUrl)
        } else {
            toast.error(result.error)
            setStep("instructions") // Go back if error
            setIsLoading(false)
        }
    }

    if (step === "calm") {
        return (
            <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600"
                    >
                        <HeartPulse className="h-16 w-16" />
                    </motion.div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-primary">Breathe In... Breathe Out</h2>
                        <p className="text-xl text-muted-foreground">Stay calm. You've prepared for this.</p>
                        <p className="text-4xl font-mono font-bold mt-4 text-blue-500">{timeLeft}</p>
                    </div>

                    <p className="text-sm text-muted-foreground">Starting exam automatically...</p>
                </div>
            </div>
        )
    }

    return (
        <Card className="w-full shadow-lg border-t-4 border-t-primary">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    Instructions: {exam.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-lg flex items-center gap-3 border border-blue-100">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Timer className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold">Duration</p>
                            <span className="font-medium text-lg">{exam.duration} mins</span>
                        </div>
                    </div>
                    <div className="p-4 bg-purple-50/50 rounded-lg flex items-center gap-3 border border-purple-100">
                        <div className="p-2 bg-purple-100 rounded-full">
                            <MousePointer2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold">Questions</p>
                            <span className="font-medium text-lg">{exam._count.questions}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Exam Rules & Ethics</h3>
                    <ul className="grid gap-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                            <span>Do not switch tabs or minimize the window (Monitored).</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                            <span>Exam auto-submits when the timer ends.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                            <span>Ensure a stable internet connection before starting.</span>
                        </li>
                    </ul>

                    <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
                        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">
                            Warning: Copy-paste functionality is disabled. Multiple tab-switch violations may result in instant disqualification.
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 py-4 border-t">
                    <Checkbox id="terms" checked={agreed} onCheckedChange={setAgreed} />
                    <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I have read the instructions and commit to taking this exam honestly.
                    </Label>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-3 bg-muted/20 p-6">
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                    Cancel
                </Button>
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.8, delay: 1, repeat: 0 }}
                >
                    <Button
                        onClick={handleProceed}
                        disabled={!agreed}
                        size="lg"
                        className="px-8 font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 bg-gradient-to-r from-primary to-primary/80"
                    >
                        Get Ready
                    </Button>
                </motion.div>
            </CardFooter>
        </Card>
    )
}
