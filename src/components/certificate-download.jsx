"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { CertificateView } from "@/components/certificate-view"
import html2canvas from "html2canvas"
import { Download } from "lucide-react"

export function CertificateDownload({ studentName, examTitle, date, score, total }) {
    const certRef = useRef(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        if (!certRef.current) {
            console.error("Certificate element not found")
            return
        }
        setIsGenerating(true)

        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 2,
                backgroundColor: "#ffffff",
                logging: false,
                useCORS: true // Safe default
            })

            const image = canvas.toDataURL("image/jpeg", 1.0)
            const link = document.createElement("a")
            link.href = image
            link.download = `Certificate-${studentName}-${examTitle}.jpg`
            link.click()
        } catch (error) {
            console.error("Certificate generation failed:", error)
            alert(`Failed to generate: ${error.message}`)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <Button onClick={handleDownload} disabled={isGenerating} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Download Certificate"}
            </Button>

            {/* Hidden Certificate Container */}
            <div style={{ position: "absolute", left: "-9999px", top: 0, width: "800px", height: "600px", overflow: "visible", zIndex: -50 }}>
                <CertificateView
                    ref={certRef}
                    studentName={studentName}
                    examTitle={examTitle}
                    date={date}
                    score={score}
                    total={total}
                />
            </div>
        </div>
    )
}
