import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { School, BookOpen, Gamepad2, FileText, Users, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as api from '@/services/api';

export default function ClassroomView() {
    const { id } = useParams<{ id: string }>();
    const [classroom, setClassroom] = useState<any>(null);
    const [modules, setModules] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            api.getClassroom(id).then(res => setClassroom(res.data)),
            api.getModules(id).then(res => setModules(res.data || [])),
            api.getMaterials(id).then(res => setMaterials(res.data || [])),
            api.getQuizzes(id).then(res => setQuizzes(res.data || [])),
            api.getLeaderboard(id).then(res => setLeaderboard(res.data || [])),
        ])
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!classroom) {
        return <div className="text-center text-muted-foreground py-12">Classroom not found.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><School className="w-8 h-8" /></div>
                <div>
                    <h1 className="text-3xl font-bold">{classroom.name}</h1>
                    <p className="text-muted-foreground">{classroom.subject} · by {classroom.teacher?.name || 'Teacher'}</p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="modules" className="w-full">
                <TabsList className="w-full justify-start gap-2 bg-transparent border-b rounded-none pb-0 px-0">
                    <TabsTrigger value="modules" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl">
                        <BookOpen className="w-4 h-4 mr-2" /> Modules
                    </TabsTrigger>
                    <TabsTrigger value="materials" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl">
                        <FileText className="w-4 h-4 mr-2" /> Materials
                    </TabsTrigger>
                    <TabsTrigger value="quizzes" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl">
                        <Gamepad2 className="w-4 h-4 mr-2" /> Quizzes
                    </TabsTrigger>
                    <TabsTrigger value="leaderboard" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl">
                        <Trophy className="w-4 h-4 mr-2" /> Leaderboard
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="modules" className="pt-4">
                    {modules.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No modules yet.</div>
                    ) : (
                        <div className="space-y-3">
                            {modules.map((m, i) => (
                                <Card key={m.id} className={m.status === 'COMPLETED' ? 'border-green-500/30' : m.status === 'UNLOCKED' ? 'border-primary/30' : 'opacity-60'}>
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <span className="font-bold text-lg w-8 text-center text-primary">{i + 1}</span>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{m.title}</h3>
                                            {m.description && <p className="text-sm text-muted-foreground">{m.description}</p>}
                                        </div>
                                        <Badge variant={m.status === 'COMPLETED' ? 'default' : m.status === 'UNLOCKED' ? 'secondary' : 'outline'}>
                                            {m.status === 'COMPLETED' ? '✓ Done' : m.status === 'UNLOCKED' ? 'In Progress' : '🔒 Locked'}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="materials" className="pt-4">
                    {materials.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No materials yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {materials.map((m) => (
                                <Card key={m.id} className="hover:border-primary/50 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-secondary rounded-lg"><FileText className="w-5 h-5 text-primary" /></div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold truncate">{m.title}</h3>
                                                <Badge variant="outline" className="text-xs mt-1">{m.type}</Badge>
                                            </div>
                                        </div>
                                        {m.fileUrl && (
                                            <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline mt-2 block">
                                                Open →
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="quizzes" className="pt-4">
                    {quizzes.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No quizzes yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quizzes.map((q) => (
                                <Card key={q.id} className="hover:border-primary/50 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold">{q.title}</h3>
                                                {q.description && <p className="text-sm text-muted-foreground">{q.description}</p>}
                                                <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                                                    <span>{q._count?.questions || 0} questions</span>
                                                    <span>{q.points} pts</span>
                                                    <span>{Math.floor(q.timeLimit / 60)}m</span>
                                                </div>
                                            </div>
                                            <Gamepad2 className="w-5 h-5 text-primary" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="leaderboard" className="pt-4">
                    {leaderboard.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No leaderboard data yet.</div>
                    ) : (
                        <div className="space-y-2">
                            {leaderboard.map((entry) => (
                                <Card key={entry.userId} className={entry.rank <= 3 ? 'border-yellow-500/30' : ''}>
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-bold w-8 text-center text-lg ${entry.rank === 1 ? 'text-yellow-500' : entry.rank === 2 ? 'text-gray-400' : entry.rank === 3 ? 'text-orange-700' : 'text-muted-foreground'}`}>
                                                {entry.rank}
                                            </span>
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`} alt="" className="w-full h-full" />
                                            </div>
                                            <span className="font-medium">{entry.name}</span>
                                        </div>
                                        <span className="text-primary font-bold">{entry.xp} XP</span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
