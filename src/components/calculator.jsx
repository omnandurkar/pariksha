"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Delete, Eraser } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function Calculator({ onClose }) {
    const [display, setDisplay] = useState("0")
    const [equation, setEquation] = useState("")
    const [isEvaluated, setIsEvaluated] = useState(false)

    const handleNumber = (num) => {
        if (isEvaluated) {
            setDisplay(num)
            setIsEvaluated(false)
        } else {
            setDisplay(display === "0" ? num : display + num)
        }
    }

    const handleOperator = (op) => {
        setIsEvaluated(false)
        setEquation(display + " " + op + " ")
        setDisplay("0")
    }

    const handleEqual = () => {
        try {
            // Safe evaluation (basic arithmetic only)
            const fullEquation = equation + display
            // Replacing visual operators with JS operators
            const evalStr = fullEquation.replace(/×/g, "*").replace(/÷/g, "/")
            // eslint-disable-next-line no-new-func
            const result = new Function('return ' + evalStr)()

            setDisplay(String(result))
            setEquation("")
            setIsEvaluated(true)
        } catch (e) {
            setDisplay("Error")
            setEquation("")
            setIsEvaluated(true)
        }
    }

    const handleClear = () => {
        setDisplay("0")
        setEquation("")
        setIsEvaluated(false)
    }

    const handleBackspace = () => {
        if (isEvaluated) {
            handleClear()
            return
        }
        setDisplay(display.length > 1 ? display.slice(0, -1) : "0")
    }

    const btnClass = "h-12 text-lg font-medium transition-all hover:scale-105 active:scale-95"

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-24 right-4 z-50 md:right-8"
        >
            <Card className="w-72 shadow-2xl border border-primary/20 bg-background/95 backdrop-blur-sm overflow-hidden ring-1 ring-black/5">
                {/* Header / Drag Handle */}
                <div className="bg-primary/5 p-3 flex justify-between items-center cursor-move border-b select-none">
                    <span className="font-semibold text-sm text-primary flex items-center gap-2">
                        🧮 Calculator
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10 rounded-full" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Display */}
                <div className="p-4 bg-muted/50 text-right space-y-1 border-b shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                    <div className="h-5 text-xs text-muted-foreground font-mono truncate">{equation}</div>
                    <div className="text-3xl font-mono font-bold tracking-wider truncate text-foreground">{display}</div>
                </div>

                {/* Keypad */}
                <div className="p-4 grid grid-cols-4 gap-2">
                    <Button variant="outline" onClick={handleClear} className="col-span-2 text-red-500 border-red-200 hover:bg-red-50">AC</Button>
                    <Button variant="outline" onClick={handleBackspace}><Delete className="h-4 w-4" /></Button>
                    <Button variant="secondary" onClick={() => handleOperator("÷")} className="text-primary font-bold">÷</Button>

                    <Button variant="ghost" onClick={() => handleNumber("7")} className={btnClass}>7</Button>
                    <Button variant="ghost" onClick={() => handleNumber("8")} className={btnClass}>8</Button>
                    <Button variant="ghost" onClick={() => handleNumber("9")} className={btnClass}>9</Button>
                    <Button variant="secondary" onClick={() => handleOperator("×")} className="text-primary font-bold">×</Button>

                    <Button variant="ghost" onClick={() => handleNumber("4")} className={btnClass}>4</Button>
                    <Button variant="ghost" onClick={() => handleNumber("5")} className={btnClass}>5</Button>
                    <Button variant="ghost" onClick={() => handleNumber("6")} className={btnClass}>6</Button>
                    <Button variant="secondary" onClick={() => handleOperator("-")} className="text-primary font-bold">-</Button>

                    <Button variant="ghost" onClick={() => handleNumber("1")} className={btnClass}>1</Button>
                    <Button variant="ghost" onClick={() => handleNumber("2")} className={btnClass}>2</Button>
                    <Button variant="ghost" onClick={() => handleNumber("3")} className={btnClass}>3</Button>
                    <Button variant="secondary" onClick={() => handleOperator("+")} className="text-primary font-bold">+</Button>

                    <Button variant="ghost" onClick={() => handleNumber("0")} className={`col-span-2 ${btnClass}`}>0</Button>
                    <Button variant="ghost" onClick={() => handleNumber(".")} className={btnClass}>.</Button>
                    <Button onClick={handleEqual} className="bg-primary text-primary-foreground font-bold text-xl">=</Button>
                </div>
            </Card>
        </motion.div>
    )
}
