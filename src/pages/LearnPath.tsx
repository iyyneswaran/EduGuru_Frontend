import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Lock, Unlock, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClassroom } from '@/context/ClassroomContext';
import * as api from '@/services/api';

export default function LearnPath() {
  const { classrooms, fetchClassrooms } = useClassroom();
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  useEffect(() => {
    if (selectedClassroom) {
      setLoading(true);
      api.getModules(selectedClassroom)
        .then(res => setModules(res.data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedClassroom]);

  useEffect(() => {
    if (classrooms.length > 0 && !selectedClassroom) {
      setSelectedClassroom(classrooms[0].id);
    }
  }, [classrooms, selectedClassroom]);

  async function handleComplete(moduleId: string) {
    try {
      await api.completeModule(selectedClassroom, moduleId);
      const res = await api.getModules(selectedClassroom);
      setModules(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'UNLOCKED': return <Unlock className="w-5 h-5 text-primary" />;
      default: return <Lock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" /> Learning Path
          </h1>
          <p className="text-muted-foreground mt-1">Complete modules in order to unlock the next</p>
        </div>
        {classrooms.length > 0 && (
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="h-10 px-3 rounded-lg bg-secondary/50 border border-white/10 text-foreground outline-none focus:border-primary"
          >
            {classrooms.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : modules.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No modules in this classroom yet.</CardContent></Card>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-border" />

          <div className="space-y-4">
            {modules.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                {/* Timeline dot */}
                <div className="relative z-10 mt-5 flex-shrink-0">
                  <div className={`w-[14px] h-[14px] rounded-full border-2 ${m.status === 'COMPLETED' ? 'bg-green-500 border-green-500' : m.status === 'UNLOCKED' ? 'bg-primary border-primary' : 'bg-muted border-muted-foreground/30'}`} />
                </div>

                <Card className={`flex-1 ${m.status === 'LOCKED' ? 'opacity-50' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {statusIcon(m.status)}
                        <div>
                          <h3 className="font-bold">Module {i + 1}: {m.title}</h3>
                          {m.description && <p className="text-sm text-muted-foreground mt-0.5">{m.description}</p>}
                        </div>
                      </div>
                      <Badge variant={m.status === 'COMPLETED' ? 'default' : m.status === 'UNLOCKED' ? 'secondary' : 'outline'}>
                        {m.status === 'COMPLETED' ? '✓ Done' : m.status === 'UNLOCKED' ? 'Active' : 'Locked'}
                      </Badge>
                    </div>
                    {m.status === 'UNLOCKED' && (
                      <Button size="sm" className="mt-3" onClick={() => handleComplete(m.id)}>
                        Mark Complete
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
