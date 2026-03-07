import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Flame, Target, Trophy, Percent, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import * as api from '@/services/api';

export default function Progress() {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProgress()
      .then(res => setProgress(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
    );
  }

  const stats = [
    { label: 'Total XP', value: progress?.xp || 0, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Current Streak', value: `${progress?.streak || 0} days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Quizzes Completed', value: progress?.quizzesCompleted || 0, icon: Target, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Quiz Accuracy', value: `${progress?.quizAccuracy || 0}%`, icon: Percent, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  // XP level calculation
  const xp = progress?.xp || 0;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const xpForNextLevel = 500;
  const levelProgress = (xpInLevel / xpForNextLevel) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" /> My Progress
        </h1>
        <p className="text-muted-foreground mt-1">Track your learning journey</p>
      </div>

      {/* Level Bar */}
      <Card className="bg-gradient-to-r from-primary/10 to-cyan-500/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-primary">Level {level}</h2>
            <span className="text-sm text-muted-foreground">{xpInLevel} / {xpForNextLevel} XP to next level</span>
          </div>
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-5 text-center">
                <div className={`p-3 ${s.bg} rounded-xl ${s.color} inline-flex mb-3`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className={`text-2xl font-bold ${s.color}`}>{s.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Activity hint */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <Activity className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h3 className="font-bold">Keep it up!</h3>
            <p className="text-sm text-muted-foreground">
              Complete quizzes and modules to earn more XP and maintain your streak.
              {progress?.lastActive && ` Last active: ${new Date(progress.lastActive).toLocaleDateString()}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
