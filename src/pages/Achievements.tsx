import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Target, Trophy, Zap, BookOpen, Medal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import * as api from '@/services/api';

const iconMap: Record<string, any> = {
  star: Star,
  trophy: Trophy,
  zap: Zap,
  book: BookOpen,
  medal: Medal,
  target: Target,
};

export default function Achievements() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAchievements()
      .then(res => setAchievements(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };

  if (loading) {
    return (
      <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Award className="w-8 h-8 text-yellow-500" /> Achievements
        </h1>
        <p className="text-muted-foreground mt-1">{unlocked.length} of {achievements.length} unlocked</p>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-green-500">🏆 Unlocked</h2>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocked.map((a) => {
              const Icon = iconMap[a.icon] || Medal;
              return (
                <motion.div key={a.id} variants={item}>
                  <Card className="border-green-500/30 bg-green-500/5">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/20 rounded-xl text-green-500">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold">{a.title}</h3>
                          <p className="text-xs text-muted-foreground">{a.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-muted-foreground">🔒 Locked</h2>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.map((a) => {
              const Icon = iconMap[a.icon] || Medal;
              return (
                <motion.div key={a.id} variants={item}>
                  <Card className="opacity-50">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-secondary rounded-xl text-muted-foreground">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold">{a.title}</h3>
                          <p className="text-xs text-muted-foreground">{a.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}
    </div>
  );
}
