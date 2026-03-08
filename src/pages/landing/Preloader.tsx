import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Cpu, Network } from 'lucide-react';

interface PreloaderProps {
    onComplete: () => void;
}

const loadingStates = [
    { text: "Initializing Core Systems", icon: Cpu },
    { text: "Loading Neural Pathways", icon: Network },
    { text: "Establishing Connection", icon: BrainCircuit }
];

const Preloader = ({ onComplete }: PreloaderProps) => {
    const [progress, setProgress] = useState(0);
    const [currentState, setCurrentState] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let currentProgress = 0;
        const duration = 2500; // total duration
        const intervalTime = 50;
        const steps = duration / intervalTime;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            currentProgress += increment;

            if (currentProgress < 100) {
                setProgress(Math.min(currentProgress, 100));

                if (currentProgress < 33) setCurrentState(0);
                else if (currentProgress < 66) setCurrentState(1);
                else setCurrentState(2);
            } else {
                setProgress(100);
                clearInterval(timer);
                setIsComplete(true);
                setTimeout(onComplete, 800); // Wait for exit animation
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, [onComplete]);

    const CurrentIcon = loadingStates[currentState].icon;

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#020617]"
                >
                    {/* Background effects */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />

                        {/* Grid pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
                        {/* Central Animation */}
                        <div className="relative w-32 h-32 flex items-center justify-center mb-12">
                            {/* Outer rotating dashed ring */}
                            <motion.div
                                className="absolute inset-0 rounded-full border border-dashed border-primary/40"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Inner rotating solid ring */}
                            <motion.div
                                className="absolute inset-2 rounded-full border-2 border-transparent border-t-primary border-r-primary/50"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Center pulsing icon */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentState}
                                    initial={{ scale: 0, opacity: 0, filter: "blur(10px)" }}
                                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                    exit={{ scale: 0, opacity: 0, filter: "blur(10px)", position: "absolute" }}
                                    transition={{ duration: 0.5, type: "spring" }}
                                    className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-md"
                                >
                                    <CurrentIcon className="w-8 h-8 text-primary" />
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl bg-primary/20 mix-blend-screen"
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Title */}
                        <motion.h1
                            className="text-4xl font-black tracking-tight mb-8"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Guru</span>
                        </motion.h1>

                        {/* Progress Section */}
                        <div className="w-full space-y-4">
                            {/* Status Text inside progress bar area */}
                            <div className="flex justify-between items-end px-1 h-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentState}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0, position: "absolute" }}
                                        className="text-xs font-medium text-primary/80 uppercase tracking-widest"
                                    >
                                        {loadingStates[currentState].text}
                                    </motion.div>
                                </AnimatePresence>
                                <div className="text-sm font-bold text-white tabular-nums">
                                    {Math.round(progress)}%
                                </div>
                            </div>

                            {/* Advanced Progress Bar */}
                            <div className="h-1.5 w-full bg-[#1e293b]/50 rounded-full overflow-hidden relative backdrop-blur-sm border border-white/5">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent to-primary"
                                    style={{ width: `${progress}%`, backgroundSize: '200% 100%' }}
                                    animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px] translate-x-1/2" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
