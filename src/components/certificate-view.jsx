"use client"

import { forwardRef } from "react"
import { format } from "date-fns"

export const CertificateView = forwardRef(({ studentName, examTitle, date, score, total }, ref) => {
    // Format date consistently to avoid hydration mismatch
    const formattedDate = date ? format(new Date(date), "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy");

    return (
        <div ref={ref} className="p-10 w-[800px] h-[600px] relative flex flex-col items-center justify-center space-y-6 select-none"
            style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                border: '20px double #1f2937',
                fontFamily: 'serif' // Enforce font to avoid system font diffs
            }}>

            {/* Style Reset for html2canvas to avoid 'lab' color errors from global CSS */}
            <style>{`
                .cert-container * {
                    border-color: #000000 !important;
                    color: inherit;
                }
            `}</style>

            <div className="cert-container w-full h-full absolute inset-0 flex flex-col items-center justify-center">

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-bold uppercase tracking-wider" style={{ color: '#111827', margin: 0 }}>Certificate</h1>
                    <h2 className="text-2xl uppercase tracking-widest" style={{ color: '#4b5563', margin: 0 }}>of Achievement</h2>
                </div>

                <div className="w-1/2 h-0.5 my-4" style={{ backgroundColor: '#d1d5db' }}></div>

                <div className="text-center space-y-4">
                    <p className="text-lg italic" style={{ color: '#6b7280' }}>This is to certify that</p>
                    <h3 className="text-4xl font-bold pb-2 px-8 inline-block" style={{ color: '#1e3a8a', borderBottom: '2px solid #d1d5db' }}>
                        {studentName}
                    </h3>
                    <p className="text-lg italic" style={{ color: '#6b7280' }}>has successfully passed the exam</p>
                    <h4 className="text-3xl font-bold" style={{ color: '#1f2937' }}>{examTitle}</h4>
                </div>

                <div className="text-center mt-8">
                    <p style={{ color: '#4b5563' }}>
                        Achieved a score of <span className="font-bold">{score} / {total}</span> on {formattedDate}
                    </p>
                </div>

                <div className="absolute bottom-10 right-10 text-center">
                    <div className="w-40 mb-2" style={{ borderBottom: '1px solid #000000' }}></div>
                    <p className="text-sm font-bold uppercase">Administrator</p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>Pariksha Platform</p>
                </div>

                <div className="absolute bottom-10 left-10">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ border: '4px solid #1f2937' }}>
                        <span className="font-bold text-xl">P</span>
                    </div>
                </div>

            </div>
        </div>
    )
})

CertificateView.displayName = "CertificateView"
