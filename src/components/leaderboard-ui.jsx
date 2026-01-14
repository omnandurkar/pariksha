"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function LeaderboardUI({ attempts, currentUserId, variant = "default" }) {
    const [isOpen, setIsOpen] = useState(false)

    if (variant === "simple") {
        return (
            <div className="space-y-3">
                {attempts.map((attempt, index) => {
                    const isCurrentUser = attempt.user.id === currentUserId
                    let RankIcon = null
                    if (index === 0) RankIcon = <Medal className="h-5 w-5 text-yellow-500" />
                    else if (index === 1) RankIcon = <Medal className="h-5 w-5 text-gray-400" />
                    else if (index === 2) RankIcon = <Medal className="h-5 w-5 text-amber-700" />
                    else RankIcon = <span className="font-bold text-muted-foreground w-5 text-center">{index + 1}</span>

                    return (
                        <div
                            key={attempt.id}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg border transition-all",
                                isCurrentUser
                                    ? "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700/50"
                                    : "bg-white/50 border-transparent hover:border-border dark:bg-zinc-900/50"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8">
                                    {RankIcon}
                                </div>
                                <div className="flex flex-col">
                                    <span className={cn("font-semibold text-sm", isCurrentUser ? "text-yellow-900 dark:text-yellow-300" : "text-foreground")}>
                                        {attempt.user.name || "Anonymous Student"}
                                        {isCurrentUser && (
                                            <span className="ml-2 text-[10px] bg-yellow-200 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                                You
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className={cn("font-mono font-bold text-lg", isCurrentUser ? "text-yellow-800 dark:text-yellow-400" : "text-gray-700 dark:text-gray-300")}>
                                {attempt.score}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <Card className="border-yellow-200/50 bg-yellow-50/30 dark:bg-yellow-900/10 dark:border-yellow-700/30 transition-colors">
            <CardHeader className="pb-2 p-4">
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between hover:bg-transparent p-0 h-auto"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <CardTitle className="text-xl flex items-center gap-2 text-yellow-800 dark:text-yellow-500">
                        <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                        Class Leaderboard
                    </CardTitle>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </Button>
            </CardHeader>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <CardContent className="pt-0 p-4">
                            <div className="space-y-3">
                                {attempts.map((attempt, index) => {
                                    const isCurrentUser = attempt.user.id === currentUserId
                                    let RankIcon = null
                                    if (index === 0) RankIcon = <Medal className="h-5 w-5 text-yellow-500" />
                                    else if (index === 1) RankIcon = <Medal className="h-5 w-5 text-gray-400" />
                                    else if (index === 2) RankIcon = <Medal className="h-5 w-5 text-amber-700" />
                                    else RankIcon = <span className="font-bold text-muted-foreground w-5 text-center">{index + 1}</span>

                                    return (
                                        <div
                                            key={attempt.id}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-lg border transition-all",
                                                isCurrentUser
                                                    ? "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700/50"
                                                    : "bg-white/50 border-transparent hover:border-border dark:bg-zinc-900/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-8">
                                                    {RankIcon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn("font-semibold text-sm", isCurrentUser ? "text-yellow-900 dark:text-yellow-300" : "text-foreground")}>
                                                        {attempt.user.name || "Anonymous Student"}
                                                        {isCurrentUser && (
                                                            <span className="ml-2 text-[10px] bg-yellow-200 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                                                You
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={cn("font-mono font-bold text-lg", isCurrentUser ? "text-yellow-800 dark:text-yellow-400" : "text-gray-700 dark:text-gray-300")}>
                                                {attempt.score}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    )
}
