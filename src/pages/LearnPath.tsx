import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelNodeProps {
  status: 'locked' | 'unlocked' | 'completed';
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'left' | 'right' | 'center';
  index: number;
}

const LevelNode = ({ status, title, description, icon, position, index }: LevelNodeProps) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <div className={cn(
      "relative flex items-center justify-center w-full py-8",
      position === 'left' ? 'md:justify-start md:pl-32' : 
      position === 'right' ? 'md:justify-end md:pr-32' : 'justify-center'
    )}>
      {/* Connecting Line (Vertical) */}
      {index !== 0 && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 w-1 bg-border -z-10" />
      )}
      {/* Connecting Line (Next) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1/2 w-1 bg-border -z-10" />

      <motion.div
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        className={cn(
          "relative w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-lg cursor-pointer z-10 transition-colors duration-300",
          isLocked 
            ? "bg-secondary border-border text-muted-foreground grayscale" 
            : isCompleted
              ? "bg-green-500 border-green-600 text-white shadow-green-500/30"
              : "bg-primary border-primary-foreground text-white shadow-primary/30 animate-pulse-slow"
        )}
      >
        {isCompleted && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1 border-2 border-background">
            <Star className="w-4 h-4 fill-current" />
          </div>
        )}
        
        <div className="w-12 h-12">
          {isLocked ? <Lock className="w-full h-full p-2" /> : icon}
        </div>

        {/* Label Tooltip */}
        <div className={cn(
          "absolute top-full mt-4 w-48 p-3 rounded-xl bg-card border border-border shadow-xl text-center transition-opacity",
          isLocked ? "opacity-50" : "opacity-100"
        )}>
          <h3 className="font-bold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default function LearnPath() {
  const levels = [
    {
      title: "Foundations of Physics",
      description: "Learn the basics of motion and forces.",
      status: 'completed',
      icon: <img src="https://api.dicebear.com/7.x/icons/svg?seed=physics" alt="icon" />,
      position: 'center'
    },
    {
      title: "Algebra I",
      description: "Master linear equations and inequalities.",
      status: 'completed',
      icon: <img src="https://api.dicebear.com/7.x/icons/svg?seed=math" alt="icon" />,
      position: 'left'
    },
    {
      title: "Cell Biology",
      description: "Understand the building blocks of life.",
      status: 'unlocked',
      icon: <img src="https://api.dicebear.com/7.x/icons/svg?seed=bio" alt="icon" />,
      position: 'right'
    },
    {
      title: "World History",
      description: "Explore ancient civilizations.",
      status: 'locked',
      icon: <img src="https://api.dicebear.com/7.x/icons/svg?seed=history" alt="icon" />,
      position: 'center'
    },
    {
      title: "Chemistry Basics",
      description: "Atoms, molecules, and reactions.",
      status: 'locked',
      icon: <img src="https://api.dicebear.com/7.x/icons/svg?seed=chem" alt="icon" />,
      position: 'left'
    }
  ] as const;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Your Learning Path</h1>
        <p className="text-muted-foreground">Master topics one step at a time to earn XP and unlock new challenges.</p>
      </div>

      <div className="relative">
        {levels.map((level, index) => (
          <LevelNode
            key={index}
            index={index}
            {...level}
          />
        ))}
        
        {/* Final Trophy */}
        <div className="relative flex items-center justify-center w-full py-8">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 w-1 bg-border -z-10" />
           <div className="w-32 h-32 rounded-full bg-secondary/30 border-4 border-dashed border-border flex items-center justify-center text-muted-foreground">
              <Trophy className="w-12 h-12" />
           </div>
        </div>
      </div>
    </div>
  );
}
