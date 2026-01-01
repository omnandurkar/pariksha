"use client"
import { motion } from "framer-motion"

export const ElegantBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(74,85,255,0.05),transparent_50%)]" />
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-200/20 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-200/20 rounded-full blur-[100px]"
            />
        </div>
    )
}
