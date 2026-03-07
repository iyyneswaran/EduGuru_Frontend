import React from 'react';
import { Medal, Lock, Star, Zap, Book, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function Achievements() {
  const achievements = [
    {
      id: 1,
      title: "7 Day Streak",
      description: "Log in and learn for 7 days in a row.",
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      progress: 100,
      unlocked: true,
      date: "Unlocked on Oct 12"
    },
    {
      id: 2,
      title: "Quiz Master",
      description: "Score 100% on 5 quizzes.",
      icon: <Star className="w-8 h-8 text-purple-500" />,
      progress: 60,
      unlocked: false,
      date: "3/5 Quizzes"
    },
    {
      id: 3,
      title: "Science Explorer",
      description: "Complete the Physics and Biology modules.",
      icon: <Book className="w-8 h-8 text-blue-500" />,
      progress: 40,
      unlocked: false,
      date: "2/5 Modules"
    },
    {
      id: 4,
      title: "1000 XP Club",
      description: "Earn your first 1000 XP.",
      icon: <TrophyIcon className="w-8 h-8 text-green-500" />,
      progress: 100,
      unlocked: true,
      date: "Unlocked on Oct 5"
    },
    {
      id: 5,
      title: "Early Bird",
      description: "Complete a lesson before 8 AM.",
      icon: <Target className="w-8 h-8 text-orange-500" />,
      progress: 0,
      unlocked: false,
      date: "Not started"
    },
    {
      id: 6,
      title: "Social Butterfly",
      description: "Add 5 friends to your study group.",
      icon: <Medal className="w-8 h-8 text-pink-500" />,
      progress: 20,
      unlocked: false,
      date: "1/5 Friends"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">Unlock badges by mastering topics and staying consistent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`relative overflow-hidden transition-all duration-300 ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-secondary/50 to-background border-primary/20 shadow-lg shadow-primary/5' 
                : 'bg-secondary/20 border-border opacity-75 grayscale hover:grayscale-0 hover:opacity-100'
            }`}
          >
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <div className={`p-4 rounded-full ${achievement.unlocked ? 'bg-secondary' : 'bg-secondary/50'}`}>
                {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-muted-foreground" />}
              </div>
              
              <div>
                <h3 className="font-bold text-lg">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
              </div>

              <div className="w-full space-y-2 mt-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className="h-2" />
                <p className="text-xs font-medium text-primary mt-2">{achievement.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
