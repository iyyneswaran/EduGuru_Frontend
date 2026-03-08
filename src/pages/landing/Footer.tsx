import { motion } from 'framer-motion';
import { BrainCircuit, Twitter, Github, Linkedin, Disc as Discord } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border/50 bg-[#0f172a] py-12 px-4 sm:px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

                    {/* Brand & Mission */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 text-xl font-bold tracking-tight mb-4">
                            <BrainCircuit className="text-primary w-6 h-6" />
                            Edu<span className="text-primary">Guru</span>
                        </div>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Empowering the next generation of minds with autonomous AI tutors, adaptive learning paths, and an uncompromising dedication to mastery.
                        </p>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <a href="#" className="hover:text-primary transition-colors" data-magnetic="true"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-primary transition-colors" data-magnetic="true"><Github size={20} /></a>
                            <a href="#" className="hover:text-primary transition-colors" data-magnetic="true"><Linkedin size={20} /></a>
                            <a href="#" className="hover:text-primary transition-colors" data-magnetic="true"><Discord size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Platform</h4>
                        <ul className="space-y-3">
                            {['AI Tutor', 'Learning Paths', 'Quiz Arena', 'Leaderboard', 'Pricing'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm" data-magnetic="true">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal / Company */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Company</h4>
                        <ul className="space-y-3">
                            {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm" data-magnetic="true">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <div>
                        &copy; {currentYear} EduGuru Technologies Inc. All rights reserved.
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        All systems operational
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
