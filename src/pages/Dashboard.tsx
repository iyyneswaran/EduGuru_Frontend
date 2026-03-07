import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Trophy, BookOpen, School, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useClassroom } from '@/context/ClassroomContext';
import { useNavigate } from 'react-router-dom';
import * as api from '@/services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const { classrooms, fetchClassrooms } = useClassroom();
  const [progress, setProgress] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
    api.getProgress().then(res => setProgress(res.data)).catch(console.error);
  }, [fetchClassrooms]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const stats = [
    { label: 'Current Streak', value: `${progress?.streak || user?.streak || 0}`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Quizzes Done', value: `${progress?.quizzesCompleted || 0}`, icon: Target, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total XP', value: `${progress?.xp || user?.xp || 0}`, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Accuracy', value: `${progress?.quizAccuracy || 0}%`, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">{user?.name?.split(' ')[0] || 'Student'}!</span>
        </h1>
        <p className="text-muted-foreground mt-1">Continue your learning journey</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} variants={item}>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 ${s.bg} rounded-xl ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <h3 className={`text-2xl font-bold ${s.color}`}>{s.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* My Classrooms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><School className="w-5 h-5 text-primary" /> My Classrooms</h2>
          <button onClick={() => navigate('/classrooms')} className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {classrooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.slice(0, 3).map((c) => (
              <Card key={c.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate(`/classrooms/${c.id}`)}>
                <CardContent className="p-5">
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.subject}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <School className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No classrooms yet. <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/classrooms')}>Join one</span></p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
