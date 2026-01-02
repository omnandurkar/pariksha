import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, User as UserIcon, Heart, Shield, Sparkles, MoveLeft } from "lucide-react";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { DeveloperName } from "@/components/developer-name";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Header / Nav */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
                        <BookOpen className="h-6 w-6" />
                        <span>Pariksha</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="hidden sm:flex">
                                <MoveLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 max-w-4xl space-y-24">

                {/* Hero Section */}
                <section className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground bg-secondary/50">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                        Behind Pariksha
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent pb-2">
                        Clarity over Complexity.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Pariksha exists to make examinations feel fair, calm, and reliable.
                        It is designed to test understanding... not patience or technology.
                    </p>
                </section>

                {/* Values Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="space-y-4 p-6 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold">Trust</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We value integrity above all. Systems should be transparent, secure, and respectful of the user&apos;s effort.
                        </p>
                    </div>
                    <div className="space-y-4 p-6 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Heart className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold">Empathy</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Exams are stressful. We design every interaction to be calm, minimizing anxiety and maximizing focus.
                        </p>
                    </div>
                    <div className="space-y-4 p-6 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold">Progress</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We believe in continuous improvement. Your feedback directly shapes the future of this platform.
                        </p>
                    </div>
                </section>

                {/* Developer Section */}
                <section className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <UserIcon className="h-6 w-6 text-primary" />
                                Built With Care
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Pariksha is built by <DeveloperName />, a developer who values thoughtful user experiences and reliable systems.
                                This project is a reflection of a belief that educational tools should respect the time and effort of both students and teachers.
                            </p>
                            <p className="text-muted-foreground text-sm">
                                No corporate buzzwords. Just honest code.
                            </p>

                            <div className="pt-4">
                                <a
                                    href="https://omnandurkar.tech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-primary hover:underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
                                >
                                    Portfolio: omnandurkar.tech
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feedback CTA */}
                <section className="text-center space-y-8 pb-16">
                    <h2 className="text-2xl font-bold">Help Us Improve</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Found a bug? Have a suggestion? Or just want to say hi?
                        We listen to every piece of feedback.
                    </p>
                    <FeedbackDialog
                        trigger={
                            <Button size="lg" className="rounded-full px-8">
                                Give Feedback
                            </Button>
                        }
                    />
                </section>

                {/* Footer */}
                <footer className="border-t py-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Pariksha. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
}
