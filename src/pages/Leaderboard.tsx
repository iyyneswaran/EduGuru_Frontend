import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Medal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
    if (classrooms.length > 0 && !selectedClassroom) setSelectedClassroom(classrooms[0].id);
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

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-700" />;
    return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" /> Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">See how you rank against your classmates</p>
        </div>
        {classrooms.length > 0 && (
          <select value={selectedClassroom} onChange={e => setSelectedClassroom(e.target.value)} className="h-10 px-3 rounded-lg bg-secondary/50 border border-white/10 text-foreground outline-none focus:border-primary">
            {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : leaderboard.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No leaderboard data yet. Complete quizzes to earn XP!</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, i) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`${entry.userId === user?.id ? 'border-primary/50 bg-primary/5' : ''} ${entry.rank <= 3 ? 'border-yellow-500/20' : ''}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {rankIcon(entry.rank)}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`} alt={entry.name} className="w-full h-full" />
                    </div>
                    <div>
                      <span className="font-semibold">{entry.name}</span>
                      {entry.userId === user?.id && <span className="text-primary text-xs ml-2">(You)</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-orange-500 flex items-center gap-1"><Flame className="w-4 h-4" />{entry.streak}</span>
                    <span className="font-bold text-primary">{entry.xp} XP</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
