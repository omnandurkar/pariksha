"use client"

import { useState, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FlipContext = createContext({
    isFlipped: false,
    toggleFlip: () => { }
})

export function FlippableCardRoot({ children, className }) {
    const [isFlipped, setIsFlipped] = useState(false)

    const toggleFlip = () => setIsFlipped(!isFlipped)

    return (
        <FlipContext.Provider value={{ isFlipped, toggleFlip }}>
            <div className={cn("relative w-full perspective-1000", className)} style={{ perspective: "1000px" }}>
                <motion.div
                    className="relative w-full h-full preserve-3d transition-all duration-500"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {children}
                </motion.div>
            </div>
        </FlipContext.Provider>
    )
}

export function FlipFront({ children, className }) {
    return (
        <div
            className={cn("w-full h-full backface-hidden", className)}
            style={{ backfaceVisibility: "hidden" }}
        >
            {children}
        </div>
    )
}

export function FlipBack({ children, className }) {
    return (
        <div
            className={cn("absolute top-0 left-0 w-full h-full backface-hidden", className)}
            style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
            }}
        >
            {children}
        </div>
    )
}

export function FlipTrigger({ children, asChild, className, ...props }) {
    const { toggleFlip } = useContext(FlipContext)
    const Comp = asChild ? "span" : Button

    return (
        <Comp onClick={toggleFlip} className={className} {...props}>
            {children}
        </Comp>
    )
}
