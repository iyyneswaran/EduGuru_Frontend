import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Trophy, BookOpen, ChevronRight, Bot, Zap, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useClassroom } from '@/context/ClassroomContext';
import { useNavigate } from 'react-router-dom';
import * as api from '@/services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const { classrooms, fetchClassrooms } = useClassroom();
  const [progress, setProgress] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
    api.getProgress().then(res => setProgress(res.data)).catch(console.error);
  }, [fetchClassrooms]);

  // Fetch modules from the first classroom for "continue learning"
  useEffect(() => {
    if (classrooms.length > 0) {
      api.getModules(classrooms[0].id)
        .then(res => setModules(res.data || []))
        .catch(console.error);
    }
  }, [classrooms]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const xp = progress?.xp || user?.xp || 0;
  const streak = progress?.streak || user?.streak || 0;
  const quizzesCompleted = progress?.quizzesCompleted || 0;
  const topicsMastered = Math.floor(xp / 500);

  const stats = [
    { label: 'Daily Streak', value: `${streak} Days`, icon: Flame, gradient: 'from-orange-600/20 to-red-600/20', iconColor: 'text-orange-400', borderColor: 'border-orange-500/20' },
    { label: 'Weekly Goal', value: `${Math.min(100, Math.floor((quizzesCompleted / Math.max(1, 10)) * 100))}%`, icon: Target, gradient: 'from-green-600/20 to-emerald-600/20', iconColor: 'text-green-400', borderColor: 'border-green-500/20' },
    { label: 'Total XP', value: xp.toLocaleString(), icon: Trophy, gradient: 'from-purple-600/20 to-pink-600/20', iconColor: 'text-purple-400', borderColor: 'border-purple-500/20' },
    { label: 'Topics Mastered', value: String(topicsMastered), icon: BookOpen, gradient: 'from-cyan-600/20 to-blue-600/20', iconColor: 'text-cyan-400', borderColor: 'border-cyan-500/20' },
  ];

  // Current module (first unlocked one)
  const currentModule = modules.find(m => m.status === 'UNLOCKED') || modules[0];
  const currentClassroom = classrooms[0];

  // Compute progress % for current module
  const completedCount = modules.filter(m => m.status === 'COMPLETED').length;
  const totalCount = modules.length;
  const moduleProgress = totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0;

  // Today's missions (dynamic based on real data)
  const missions = [
    { text: `Complete 1 ${currentClassroom?.subject || 'Study'} Lesson`, xp: 50, done: completedCount > 0 },
    { text: `Score 80% in ${currentClassroom?.subject || 'a'} Quiz`, xp: 30, done: (progress?.quizAccuracy || 0) >= 80 },
    { text: 'Ask AI Tutor a question', xp: 20, done: false },
  ];

  // Recommended topics
  const recommendations = classrooms.slice(0, 2).map(c => ({
    title: c.name,
    subject: c.subject,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Welcome Banner + Daily Challenge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-[#94a3b8] mt-1">Ready to level up your knowledge today?</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/quiz-arena')}
          className="flex items-center gap-2 bg-[#7a7fff] hover:bg-[#6b6fef] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(122,127,255,0.3)] transition-colors w-fit"
        >
          <Zap className="w-4 h-4" /> Daily Challenge
        </motion.button>
      </div>

      {/* Stats Row */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} variants={item}>
            <div className={`bg-gradient-to-br ${s.gradient} border ${s.borderColor} rounded-2xl p-5 flex items-center gap-4`}>
              <div className={`${s.iconColor}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">{s.label}</p>
                <h3 className="text-xl font-black text-white">{s.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content: Continue Learning + Today's Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning (spanning 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Continue Learning</h2>
            <button onClick={() => navigate('/learn-path')} className="text-sm text-[#7a7fff] hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {currentModule && currentClassroom ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#151a2d] border border-white/5 rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs bg-[#2c1c4d] text-[#b48cff] px-3 py-1 rounded-full font-semibold">{currentClassroom.subject}</span>
                <span className="text-xs text-[#64748b]">Module {completedCount + 1}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{currentModule.title}</h3>
                  <p className="text-sm text-[#94a3b8]">{currentModule.description || 'Continue where you left off.'}</p>
                </div>
                <button
                  onClick={() => navigate('/learn-path')}
                  className="flex items-center gap-2 bg-[#7a7fff] hover:bg-[#6b6fef] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
                >
                  Resume <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white bg-[#1e293b] px-2 py-0.5 rounded">Progress</span>
                  <span className="text-xs text-[#94a3b8]">{moduleProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#7a7fff] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${moduleProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-[#151a2d] border border-white/5 rounded-2xl p-8 text-center text-muted-foreground">
              No active modules. <span className="text-[#7a7fff] cursor-pointer hover:underline" onClick={() => navigate('/classrooms')}>Join a classroom</span> to start learning.
            </div>
          )}

          {/* Recommended for You */}
          {recommendations.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    onClick={() => navigate('/learn-path')}
                    className="bg-[#1c2132] border border-white/5 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-colors"
                  >
                    <div className="p-2.5 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl">
                      <BookOpen className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                      <p className="text-xs text-[#64748b]">{rec.subject}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Today's Missions (right column) */}
        <div className="space-y-6">
          <div className="bg-[#151a2d] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#7a7fff]" /> Today's Missions
            </h2>
            <div className="space-y-4">
              {missions.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  {m.done ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#374151] flex-shrink-0" />
                  )}
                  <span className={`flex-1 text-sm ${m.done ? 'text-[#64748b] line-through' : 'text-white'}`}>{m.text}</span>
                  <span className="text-xs font-bold text-[#7a7fff] bg-[#7a7fff]/10 px-2 py-1 rounded-full whitespace-nowrap">+{m.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tutor CTA */}
          <div className="bg-[#151a2d] border border-white/5 rounded-2xl p-6 text-center">
            <div className="inline-flex p-3 bg-[#2c1c4d] rounded-2xl text-[#b48cff] mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Stuck on a problem?</h3>
            <p className="text-sm text-[#94a3b8] mb-4">
              Your AI Tutor is ready to help you understand any topic.
            </p>
            <button
              onClick={() => navigate('/ai-tutor')}
              className="text-sm text-[#7a7fff] font-semibold hover:underline"
            >
              Open AI Tutor →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
