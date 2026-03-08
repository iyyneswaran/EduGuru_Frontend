import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Alex Rivera",
        role: "Computer Science Major",
        content: "The AI Tutor feels illegal. It broke down complex algorithms faster than my professor could. I went from struggling to top of the class.",
        image: "https://i.pravatar.cc/150?u=alex"
    },
    {
        name: "Sarah Chen",
        role: "Self-taught Developer",
        content: "I was stuck on React for weeks. The dynamic learning paths realized I needed more visual examples and adapted instantly. Incredible.",
        image: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        name: "Marcus Johnson",
        role: "High School Senior",
        content: "The gamification actually works. I didn't want to lose my 45-day streak, so I ended up studying calculus on a Saturday night.",
        image: "https://i.pravatar.cc/150?u=marcus"
    }
];

const Testimonials = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Staggered fade in and slide up for testimonials
        gsap.fromTo(cardsRef.current,
            { y: 50, opacity: 0, scale: 0.95 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.2, // Delay between each card
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} className="py-24 px-4 sm:px-6 relative z-10">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Forged by <span className="text-primary italic">Masters</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Join thousands who have accelerated their minds using EduGuru.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className="bg-secondary/30 border border-border/50 p-8 rounded-2xl relative overflow-hidden group"
                            whileHover={{
                                y: -10,
                                boxShadow: "0 20px 40px -10px rgba(139, 92, 246, 0.15)"
                            }}
                            data-magnetic="true"
                        >
                            <Quote className="absolute top-4 right-4 text-primary/10 w-24 h-24 -rotate-12 transition-transform group-hover:rotate-0" />

                            <p className="relative z-10 text-lg leading-relaxed text-foreground/90 italic mb-8">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-4 relative z-10">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full border-2 border-primary/50"
                                />
                                <div>
                                    <div className="font-bold text-foreground">{testimonial.name}</div>
                                    <div className="text-sm text-primary">{testimonial.role}</div>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
