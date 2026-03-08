import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown } from 'lucide-react';
import { useClassroom } from '@/context/ClassroomContext';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/services/api';

export default function Leaderboard() {
  const { classrooms, fetchClassrooms } = useClassroom();
  const { user } = useAuth();
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchClassrooms(); }, [fetchClassrooms]);

  useEffect(() => {
    if (classrooms.length > 0 && !selectedClassroom) {
      setSelectedClassroom(classrooms[0].id);
    }
  }, [classrooms, selectedClassroom]);

  useEffect(() => {
    if (selectedClassroom) {
      setLoading(true);
      api.getLeaderboard(selectedClassroom)
        .then(res => setLeaderboard(res.data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedClassroom]);

  // Separate Top 3 and the rest
  const top3 = leaderboard.filter(e => e.rank <= 3) || [];
  const restOfLeaderboard = leaderboard.filter(e => e.rank > 3) || [];

  const getRankData = (rank: number) => {
    switch (rank) {
      case 1: return { color: "text-yellow-400", ring: "ring-yellow-400", bg: "bg-yellow-400", shadow: "shadow-[0_0_30px_rgba(250,204,21,0.4)]", height: "h-40 md:h-48", width: "w-24 md:w-32", avatarSize: "w-24 h-24 md:w-32 md:h-32" };
      case 2: return { color: "text-gray-300", ring: "ring-gray-300", bg: "bg-gray-300", shadow: "shadow-[0_0_20px_rgba(209,213,219,0.3)]", height: "h-28 md:h-32", width: "w-20 md:w-28", avatarSize: "w-20 h-20 md:w-24 md:h-24" };
      case 3: return { color: "text-[#cd7f32]", ring: "ring-[#cd7f32]", bg: "bg-[#cd7f32]", shadow: "shadow-[0_0_20px_rgba(205,127,50,0.3)]", height: "h-20 md:h-24", width: "w-20 md:w-28", avatarSize: "w-16 h-16 md:w-20 md:h-20" };
      default: return { color: "text-muted-foreground", ring: "", bg: "", shadow: "", height: "", width: "", avatarSize: "w-12 h-12" };
    }
  };

  const TopPodium = ({ entry }: { entry: any }) => {
    if (!entry) return <div className="w-24 md:w-32 opacity-0" />; // Empty placeholder to maintain layout
    const rData = getRankData(entry.rank);

    return (
      <motion.div
        className="flex flex-col items-center justify-end z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: entry.rank * 0.1 }}
      >
        <div className="relative flex flex-col items-center">
          {entry.rank === 1 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <Crown className="w-10 h-10 text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            </motion.div>
          )}

          <div className="relative">
            <div className={`rounded-full bg-secondary overflow-hidden border-4 border-transparent ring-4 ${rData.ring} ${rData.shadow} ${rData.avatarSize}`}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}&backgroundColor=transparent`} alt={entry.name} className="w-full h-full object-cover" />
            </div>

            {/* Rank Badge */}
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${rData.bg} text-[#0f172a] font-black flex items-center justify-center border-4 border-[#0a0e1a] text-sm md:text-base`}>
              {entry.rank}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center mb-4">
          <div className="font-bold text-white text-sm md:text-base whitespace-nowrap">{entry.name}</div>
          <div className={`font-bold text-xs md:text-sm ${rData.color}`}>{entry.xp} XP</div>
        </div>

        {/* Podium Block */}
        <div className={`${rData.width} ${rData.height} bg-[#1e2439] rounded-t-2xl flex justify-center pt-6 shadow-[-10px_-10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden`}
          style={{ background: 'linear-gradient(180deg, #1e2439 0%, #0f1322 100%)' }}
        >
          <div className={`text-4xl md:text-6xl font-black ${rData.color} drop-shadow-md`}>
            {entry.rank}
          </div>
          {/* Subtle highlight on top edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">

      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center mt-6 mb-16 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <Trophy className="w-12 h-12 text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Leaderboard</h1>
          <p className="text-[#94a3b8] text-lg">See who's topping the charts this week!</p>
        </motion.div>

        {/* Classroom Selector */}
        {classrooms.length > 1 && (
          <div className="mt-6">
            <select
              value={selectedClassroom}
              onChange={e => setSelectedClassroom(e.target.value)}
              className="h-10 px-4 rounded-full bg-secondary/50 border border-white/10 text-foreground outline-none focus:border-primary shadow-sm"
            >
              {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="bg-[#151a2d] border border-white/5 rounded-2xl p-12 text-center text-muted-foreground shadow-lg">
          No leaderboard data available yet. Start completing tasks to earn XP!
        </div>
      ) : (
        <div className="space-y-12">

          {/* Top 3 Podium View */}
          {top3.length > 0 && (
            <div className="flex items-end justify-center gap-2 md:gap-6 mt-10">
              {/* Order must be 2nd, 1st, 3rd visually */}
              <TopPodium entry={top3.find(e => e.rank === 2)} />
              <TopPodium entry={top3.find(e => e.rank === 1)} />
              <TopPodium entry={top3.find(e => e.rank === 3)} />
            </div>
          )}

          {/* Rest of the Leaderboard List */}
          {restOfLeaderboard.length > 0 && (
            <div className="space-y-3 bg-[#0a0e1a] rounded-3xl p-2 md:p-6 pb-8">
              {restOfLeaderboard.map((entry, i) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className={`flex items-center gap-4 bg-[#151a2d] hover:bg-[#1a2138] transition-colors p-4 md:px-6 rounded-2xl border ${entry.userId === user?.id ? 'border-primary/50 shadow-[0_0_15px_rgba(122,127,255,0.15)]' : 'border-white/5'
                    }`}
                >
                  <div className="w-8 md:w-10 text-center text-lg md:text-xl font-bold text-[#64748b]">
                    {entry.rank}
                  </div>

                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-secondary border border-white/10 flex-shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}&backgroundColor=transparent`} alt={entry.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-base md:text-lg truncate flex items-center gap-2">
                      {entry.name}
                      {entry.userId === user?.id && <span className="text-primary text-xs ml-1 px-2 py-0.5 rounded-full bg-primary/10">You</span>}
                    </div>
                    {/* Simulated level for visual parity with reference image */}
                    <div className="text-xs md:text-sm text-[#64748b]">Level {Math.max(1, Math.floor(entry.xp / 1000))}</div>
                  </div>

                  <div className="px-3 py-1.5 md:px-4 md:py-2 bg-[#2c1c4d] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#b48cff] text-sm md:text-base whitespace-nowrap">
                      {entry.xp} XP
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
