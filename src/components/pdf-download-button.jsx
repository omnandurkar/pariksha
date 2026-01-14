"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { toPng } from "html-to-image"
import jsPDF from "jspdf"
import { toast } from "sonner"

export function PDFDownloadButton({ targetId, fileName = "document.pdf" }) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        const element = document.getElementById(targetId)
        if (!element) {
            toast.error("Could not find content to download.")
            return
        }

        setIsGenerating(true)
        toast.info("Generating PDF...")

        try {
            // Using html-to-image for better modern CSS support (Tailwind v4/oklch/lab)
            const dataUrl = await toPng(element, { backgroundColor: '#ffffff', cacheBust: true })

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            })

            const imgProperties = pdf.getImageProperties(dataUrl)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

            pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight)
            pdf.save(fileName)

            toast.success("PDF downloaded successfully!")
        } catch (error) {
            console.error("PDF Generation Error:", error)
            toast.error(`Failed to generate PDF: ${error.message || "Unknown error"}`)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isGenerating}
            className="gap-2"
        >
            {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            {isGenerating ? "Generating..." : "Download Result Card"}
        </Button>
    )
}
