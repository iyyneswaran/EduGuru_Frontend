import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Lock, Star, ArrowLeft, School } from 'lucide-react';
import { useClassroom } from '@/context/ClassroomContext';
import { Button } from '@/components/ui/button';
import * as api from '@/services/api';

// Colors for the module icons (cycles)
const MODULE_COLORS = ['#22c55e', '#a78bfa', '#f97316', '#06b6d4', '#ec4899', '#eab308'];

export default function LearnPath() {
  const { classrooms, fetchClassrooms } = useClassroom();
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchClassrooms(); }, [fetchClassrooms]);
  useEffect(() => {
    if (classrooms.length > 0 && !selectedClassroom) setSelectedClassroom('');
  }, [classrooms, selectedClassroom]);

  useEffect(() => {
    if (selectedClassroom) {
      setLoading(true);
      api.getModules(selectedClassroom)
        .then(res => setModules(res.data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedClassroom]);

  async function handleComplete(moduleId: string) {
    try {
      await api.completeModule(selectedClassroom, moduleId);
      const res = await api.getModules(selectedClassroom);
      setModules(res.data || []);
    } catch (err) { console.error(err); }
  }

  // Classroom selection view
  if (!selectedClassroom) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mt-8">
          <h1 className="text-4xl font-black text-white italic mb-2">Your Learning Path</h1>
          <p className="text-[#94a3b8] text-lg">Choose a classroom to view its learning path</p>
        </div>

        {classrooms.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <School className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No classrooms joined yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {classrooms.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedClassroom(c.id)}
                className="cursor-pointer bg-[#1c2132] border border-white/5 rounded-2xl p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#2c1c4d] rounded-2xl text-[#b48cff]">
                    <School className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-white mb-1">{c.name}</h3>
                    <p className="text-[#94a3b8] text-sm">{c.subject} · {c._count?.modules || 0} modules</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Path view for selected classroom
  const selectedName = classrooms.find(c => c.id === selectedClassroom)?.name || 'Classroom';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => setSelectedClassroom('')} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#94a3b8]" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-white italic">Your Learning Path</h1>
          <p className="text-[#94a3b8] text-base mt-1">
            Master topics one step at a time to earn XP and unlock new challenges.
          </p>
        </div>
      </div>

      <div className="text-sm text-[#b48cff] font-semibold px-3 py-1.5 bg-[#2c1c4d] rounded-full w-fit">
        {selectedName}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : modules.length === 0 ? (
        <div className="bg-[#151a2d] border border-white/5 rounded-2xl p-12 text-center text-muted-foreground">
          No modules in this classroom yet.
        </div>
      ) : (
        /* Zigzag path layout */
        <div className="relative pt-8 pb-12 px-4">
          {modules.map((m, i) => {
            const color = MODULE_COLORS[i % MODULE_COLORS.length];
            const isCompleted = m.status === 'COMPLETED';
            const isUnlocked = m.status === 'UNLOCKED';
            const isLocked = m.status === 'LOCKED';

            // Zigzag positioning: alternate left/center/right
            const positions = ['left', 'center', 'right'];
            const pos = positions[i % 3];
            const alignClass = pos === 'left' ? 'justify-start' : pos === 'right' ? 'justify-end' : 'justify-center';

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex ${alignClass} mb-12 relative`}
              >
                <div className={`group flex flex-col items-center max-w-[240px] ${isLocked ? 'opacity-40' : ''}`}>
                  {/* Icon circle */}
                  <div className="relative mb-4">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-transform group-hover:scale-110"
                      style={{
                        background: isLocked ? '#374151' : `linear-gradient(135deg, ${color}, ${color}cc)`,
                        boxShadow: isLocked ? 'none' : `0 8px 30px ${color}40`,
                      }}
                    >
                      {isLocked ? (
                        <Lock className="w-8 h-8 text-gray-400" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : (
                        <BookOpen className="w-8 h-8" />
                      )}
                    </div>
                    {/* Star completion badge */}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                        <Star className="w-4 h-4 text-yellow-900 fill-yellow-900" />
                      </div>
                    )}
                  </div>

                  {/* Title card */}
                  <div className="bg-[#1e2439] border border-white/10 rounded-xl px-5 py-3 text-center shadow-md w-full">
                    <h3 className="font-bold text-white text-sm mb-1">{m.title}</h3>
                    {m.description && (
                      <p className="text-[#94a3b8] text-xs leading-relaxed">{m.description}</p>
                    )}
                  </div>

                  {/* Mark complete button */}
                  {isUnlocked && (
                    <Button
                      size="sm"
                      className="mt-3 bg-[#7a7fff] hover:bg-[#6b6fef] text-white rounded-full text-xs px-4"
                      onClick={() => handleComplete(m.id)}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
