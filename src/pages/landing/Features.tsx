import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Map, Target, Trophy, BarChart3, Medal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        title: 'AI Tutor',
        description: 'A dedicated, personalized intelligence adapting to your exact learning speed and style. Speaks fluently in English, Hinglish, and Tanglish.',
        icon: <Bot size={32} />
    },
    {
        title: 'Dynamic Paths',
        description: 'Learning trajectories that morph in real-time based on your strengths and weaknesses.',
        icon: <Map size={32} />
    },
    {
        title: 'Smart Quizzes',
        description: 'Adaptive testing arenas that challenge you exactly at the edge of your abilities.',
        icon: <Target size={32} />
    },
    {
        title: 'Achievements',
        description: 'Unlock milestones and rare badges as you conquer increasingly complex topics.',
        icon: <Trophy size={32} />
    },
    {
        title: 'Deep Analytics',
        description: 'Visualize your cognitive growth with beautiful, actionable real-time data.',
        icon: <BarChart3 size={32} />
    },
    {
        title: 'Global Arena',
        description: 'Compete on leaderboards and prove your mastery against learners worldwide.',
        icon: <Medal size={32} />
    }
];

const Features = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Headline scroll animation
        gsap.fromTo(headlineRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            }
        );

        // Cards staggered floating entrance
        cardsRef.current.forEach((card, index) => {
            gsap.fromTo(card,
                { opacity: 0, y: 100, rotationX: -15, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    scale: 1,
                    duration: 1,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%", // Trigger when card hits 85% of viewport height
                    },
                    delay: index * 0.1 // Stagger internally if they appear together
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="py-32 px-4 relative z-10" style={{ background: '#0a0e1a' }}>
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-20">
                    <h2 ref={headlineRef} className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                        Next-Gen Learning <span className="text-[#7a7fff] italic">Arsenal</span>
                    </h2>
                    <p className="mt-4 text-xl text-[#94a3b8] max-w-2xl mx-auto">
                        Everything you need to accelerate your cognitive acquisition, beautifully designed and powered by advanced neural networks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className="group relative rounded-2xl border border-[#1e293b]/60 bg-[#111827]/60 p-8 backdrop-blur-xl overflow-hidden"
                            whileHover={{
                                y: -10,
                                rotateX: 5,
                                rotateY: 5,
                                boxShadow: "0 25px 50px -12px rgba(122, 127, 255, 0.25)"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            data-magnetic="true"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#7a7fff] via-[#06b6d4] to-[#7a7fff] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-xl bg-[#7a7fff]/10 flex items-center justify-center text-[#7a7fff] mb-6 ring-1 ring-[#7a7fff]/20 group-hover:ring-[#7a7fff]/50 transition-all group-hover:scale-110 duration-300">
                                    {feature.icon}
                                </div>

                                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#7a7fff] transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-[#94a3b8] leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Subtle background pattern inside card */}
                            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#7a7fff]/5 rounded-full blur-2xl group-hover:bg-[#7a7fff]/10 transition-colors" />
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Features;
