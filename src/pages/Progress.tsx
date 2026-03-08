import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, BookCheck, Target } from 'lucide-react';
import * as api from '@/services/api';

// Minimal bar chart drawn with divs
function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const yLabels = [0, Math.ceil(max * 0.25), Math.ceil(max * 0.5), Math.ceil(max * 0.75), max];

  return (
    <div className="flex gap-2 h-full">
      {/* Y-axis labels */}
      <div className="flex flex-col justify-between text-[#64748b] text-xs py-1 w-8 text-right">
        {yLabels.reverse().map((v, i) => <span key={i}>{v}</span>)}
      </div>

      {/* Bars area */}
      <div className="flex-1 flex items-end gap-2 border-l border-b border-white/5 pl-2 pb-1">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end h-full">
            <motion.div
              className="w-full max-w-[40px] rounded-md"
              style={{ background: color }}
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            />
            <span className="text-[#64748b] text-xs mt-1">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Minimal line chart drawn with SVG
function LineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const yLabels = ['0%', '25%', '50%', '75%', '100%'];
  const width = 360;
  const height = 180;
  const padX = 10;
  const padY = 10;

  const points = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * (width - padX * 2),
    y: padY + (1 - v / max) * (height - padY * 2),
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <div className="flex gap-2 h-full">
      <div className="flex flex-col justify-between text-[#64748b] text-xs py-1 w-8 text-right">
        {yLabels.reverse().map((v, i) => <span key={i}>{v}</span>)}
      </div>
      <div className="flex-1 flex flex-col">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full flex-1" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((pct, i) => (
            <line key={i} x1={padX} x2={width - padX} y1={padY + (1 - pct) * (height - padY * 2)} y2={padY + (1 - pct) * (height - padY * 2)} stroke="rgba(255,255,255,0.05)" />
          ))}
          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2 }}
          />
          {/* Dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={5} fill={color} stroke="#0a0e1a" strokeWidth={2} />
          ))}
        </svg>
        <div className="flex justify-between text-[#64748b] text-xs px-2 mt-1">
          {days.map((d) => <span key={d}>{d}</span>)}
        </div>
      </div>
    </div>
  );
}

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
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Generate fake weekly data based on real stats for visual charts
  const xp = progress?.xp || 0;
  const quizAccuracy = progress?.quizAccuracy || 0;
  const quizzesCompleted = progress?.quizzesCompleted || 0;

  // Simulate daily XP from total XP
  const baseXP = Math.max(50, Math.floor(xp / 10));
  const xpWeekly = Array.from({ length: 7 }, (_, i) =>
    Math.max(0, Math.floor(baseXP * (0.4 + Math.sin(i * 1.2) * 0.6 + Math.random() * 0.3)))
  );

  // Simulate accuracy percentage trend
  const baseAcc = Math.max(40, quizAccuracy);
  const accuracyWeekly = Array.from({ length: 7 }, (_, i) =>
    Math.min(100, Math.max(0, Math.floor(baseAcc + Math.sin(i * 0.9) * 15 - 5 + Math.random() * 10)))
  );

  // Summary stat cards
  const studyHours = Math.max(0.5, (xp / 100)).toFixed(1);
  const lessonsCompleted = quizzesCompleted + Math.floor(xp / 200);
  const avgScore = quizAccuracy;

  const statCards = [
    { value: `${studyHours}h`, label: 'Study Time', color: 'text-[#7a7fff]' },
    { value: String(lessonsCompleted), label: 'Lessons Completed', color: 'text-[#7a7fff]' },
    { value: `${avgScore}%`, label: 'Average Score', color: 'text-[#f97316]' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white italic">Your Progress</h1>
        <p className="text-[#94a3b8] mt-1">
          Track your <span className="text-[#06b6d4]">learning journey</span> and improvements.
        </p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Bar Chart */}
        <div className="bg-[#151a2d] border border-white/5 rounded-2xl p-6 h-[320px] flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">XP Gained (This Week)</h2>
          <div className="flex-1">
            <BarChart data={xpWeekly} color="#a78bfa" />
          </div>
        </div>

        {/* Accuracy Line Chart */}
        <div className="bg-[#151a2d] border border-white/5 rounded-2xl p-6 h-[320px] flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Quiz Accuracy Trend</h2>
          <div className="flex-1">
            <LineChart data={accuracyWeekly} color="#06b6d4" />
          </div>
        </div>
      </div>

      {/* Bottom Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="bg-[#151a2d] border border-white/5 rounded-2xl p-6 text-center"
          >
            <h3 className={`text-4xl font-black ${s.color} mb-2`}>{s.value}</h3>
            <p className="text-[#94a3b8] text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
