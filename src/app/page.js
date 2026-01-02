"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ElegantBackground } from "@/components/floating-elements";
import { ArrowRight, Check } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background font-sans selection:bg-gray-200">
      <ElegantBackground />

      {/* Minimal Navbar */}
      <nav className="fixed top-0 w-full p-6 z-20 bg-white/50 backdrop-blur-sm border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold tracking-tight text-gray-900">pariksha.</div>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/auth/login" className="text-gray-500 hover:text-gray-900 transition-colors">Log in</Link>
            <Link href="/request-access" className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center pt-32 p-6 z-10">

        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Assessment, <span className="italic font-light text-slate-500">elevated.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
              A calm, secure environment for high-stakes exams. <br className="hidden md:block" /> Designed to measure potential, not anxiety.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Button size="lg" className="h-12 px-8 rounded-full bg-black text-white hover:bg-gray-800 transition-all" asChild>
              <Link href="/request-access">
                Request Access <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <div className="text-sm text-gray-400">
              Trusted by forward-thinking institutions.
            </div>
          </motion.div>
        </div>

        {/* Minimal Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-32 w-full max-w-5xl grid md:grid-cols-3 gap-12 border-t border-gray-100 pt-16"
        >
          <MinimalFeature
            title="Calm by Design"
            desc="Reduced visual noise and guided breathing exercises help students perform at their best."
          />
          <MinimalFeature
            title="Uncompromising Security"
            desc="Ethical proctoring and auto-save functionality ensure fairness without invasion."
          />
          <MinimalFeature
            title="Insightful Analytics"
            desc="Go beyond scores with detailed performance breakdowns and history tracking."
          />
        </motion.div>

      </main>

      <footer className="py-8 z-10 flex justify-center gap-6 text-xs text-gray-400">
        <span>© 2026 Pariksha Inc.</span>
        <Link href="/about" className="hover:text-gray-900 transition-colors">Behind Pariksha</Link>
      </footer>
    </div>
  );
}

function MinimalFeature({ title, desc }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <div className="h-1 w-1 bg-gray-900 rounded-full" />
        {title}
      </h3>
      <p className="text-gray-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  )
}
