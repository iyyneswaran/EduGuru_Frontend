import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Video, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClassroom } from '@/context/ClassroomContext';
import * as api from '@/services/api';

export default function StudyMaterials() {
  const { classrooms, fetchClassrooms } = useClassroom();
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [materials, setMaterials] = useState<any[]>([]);
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
      api.getMaterials(selectedClassroom)
        .then(res => setMaterials(res.data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedClassroom]);

  const typeIcons: Record<string, any> = { PDF: FileText, VIDEO: Video, NOTES: BookOpen };
  const typeColors: Record<string, string> = { PDF: 'bg-red-500/10 text-red-500', VIDEO: 'bg-blue-500/10 text-blue-500', NOTES: 'bg-green-500/10 text-green-500' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" /> Study Materials
          </h1>
          <p className="text-muted-foreground mt-1">Access materials shared by your teacher</p>
        </div>
        {classrooms.length > 0 && (
          <select value={selectedClassroom} onChange={(e) => setSelectedClassroom(e.target.value)} className="h-10 px-3 rounded-lg bg-secondary/50 border border-white/10 text-foreground outline-none focus:border-primary">
            {classrooms.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : materials.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No study materials available for this classroom yet.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m, i) => {
            const Icon = typeIcons[m.type] || FileText;
            const colors = typeColors[m.type] || 'bg-secondary text-foreground';
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2.5 rounded-xl ${colors}`}><Icon className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate">{m.title}</h3>
                        <Badge variant="outline" className="text-xs mt-1">{m.type}</Badge>
                      </div>
                    </div>
                    {m.description && <p className="text-sm text-muted-foreground mb-3">{m.description}</p>}
                    <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-auto flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
