import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

const DashboardPreview = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mockupRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Parallax effect on the entire wrapper
        gsap.fromTo(mockupRef.current,
            { y: 150, opacity: 0, scale: 0.95, rotationX: 10 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                rotationX: 0,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                    end: "top 20%",
                    scrub: 1 // smooth scrubbing effect tied to scroll
                }
            }
        );

        // Staggered assembly of UI elements inside the mockup
        gsap.fromTo(elementsRef.current,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: mockupRef.current,
                    start: "center 80%"
                }
            }
        );
    }, []);

    return (
        <section ref={containerRef} className="py-24 px-4 sm:px-6 relative overflow-hidden bg-background">

            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-full h-[500px] -translate-y-1/2 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="absolute -right-64 top-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Command Center
                    </h2>
                    <p className="text-xl text-muted-foreground w-full max-w-2xl mx-auto">
                        A meticulously crafted interface providing total visibility into your cognitive mastery and progression velocity.
                    </p>
                </div>

                {/* Browser / App Mockup Window */}
                <div
                    ref={mockupRef}
                    className="relative rounded-2xl border border-border/50 bg-[#0f172a]/80 shadow-[0_0_100px_rgba(139,92,246,0.15)] overflow-hidden backdrop-blur-xl perspective-1000"
                >
                    {/* Mac window controls */}
                    <div className="h-10 border-b border-border/50 flex items-center px-4 gap-2 bg-[#1e293b]/50">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>

                    {/* Fake Dashboard Content */}
                    <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

                        {/* Left sidebar / quick stats */}
                        <div className="space-y-6">
                            <div
                                ref={(el) => { elementsRef.current[0] = el; }}
                                className="bg-secondary/40 border border-border/40 p-6 rounded-xl flex items-center gap-4"
                            >
                                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-[spin_3s_linear_infinite]" />
                                <div>
                                    <div className="text-sm text-muted-foreground">Mastery Score</div>
                                    <div className="text-3xl font-bold text-foreground">92%</div>
                                </div>
                            </div>

                            <div
                                ref={(el) => { elementsRef.current[1] = el; }}
                                className="bg-secondary/40 border border-border/40 p-6 rounded-xl space-y-4"
                            >
                                <div className="text-sm font-medium">Recent Activity</div>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-accent" />
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${Math.random() * 60 + 40}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full bg-accent"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main graph area */}
                        <div
                            ref={(el) => { elementsRef.current[2] = el; }}
                            className="lg:col-span-2 bg-secondary/40 border border-border/40 rounded-xl p-6 min-h-[300px] flex flex-col"
                        >
                            <div className="mb-8 flex justify-between items-center">
                                <div className="font-medium text-lg">Knowledge Growth Trajectory</div>
                                <div className="px-3 py-1 rounded bg-primary/20 text-primary text-xs tracking-wider uppercase">Live</div>
                            </div>

                            {/* Simulated graph lines using SVGs & framer motion */}
                            <div className="flex-1 relative border-l border-b border-border/50 flex items-end ml-4 mb-4 pt-10 px-2">
                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                        d="M0,200 Q100,180 200,100 T400,150 T600,50 T800,80 T1000,20"
                                        fill="none"
                                        stroke="#8b5cf6"
                                        strokeWidth="4"
                                        className="drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                                    />
                                    {/* Secondary softer line */}
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                                        d="M0,220 Q150,190 250,150 T450,180 T650,100 T850,120 T1000,60"
                                        fill="none"
                                        stroke="#06b6d4"
                                        strokeWidth="2"
                                        opacity="0.5"
                                    />
                                </svg>

                                {/* Floating dot on the graph */}
                                <div className="absolute right-[5%] top-[15%] w-4 h-4 rounded-full bg-primary border-2 border-white shadow-[0_0_15px_#8b5cf6] animate-pulse" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardPreview;
