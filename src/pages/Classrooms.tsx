import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, School, LogIn as JoinIcon, Users, BookOpen, Gamepad2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useClassroom } from '@/context/ClassroomContext';
import { useNavigate } from 'react-router-dom';

export default function Classrooms() {
    const { classrooms, fetchClassrooms, joinClassroom, isLoading } = useClassroom();
    const [code, setCode] = useState('');
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchClassrooms();
    }, [fetchClassrooms]);

    async function handleJoin(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setJoining(true);
        try {
            await joinClassroom(code.trim().toUpperCase());
            setCode('');
        } catch (err: any) {
            setError(err.message || 'Failed to join classroom');
        } finally {
            setJoining(false);
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Classrooms</h1>
                <p className="text-muted-foreground mt-1">Join and explore your classrooms</p>
            </div>

            {/* Join Classroom */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-cyan-500/5">
                <CardContent className="p-6">
                    <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <JoinIcon className="w-4 h-4 text-primary" />
                        Join a Classroom
                    </h2>
                    <form onSubmit={handleJoin} className="flex gap-3">
                        <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter class code (e.g. A1B2C3)"
                            className="flex-1 bg-secondary/50 uppercase font-mono"
                            required
                        />
                        <Button type="submit" disabled={joining} className="shrink-0">
                            {joining ? 'Joining...' : 'Join'}
                        </Button>
                    </form>
                    {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                </CardContent>
            </Card>

            {/* Classrooms Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center h-32">
                    <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            ) : classrooms.length > 0 ? (
                <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classrooms.map((classroom) => (
                        <motion.div key={classroom.id} variants={item}>
                            <Card
                                className="cursor-pointer hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
                                onClick={() => navigate(`/classrooms/${classroom.id}`)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                            <School className="w-6 h-6" />
                                        </div>
                                        <Badge variant="secondary">{classroom.subject}</Badge>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{classroom.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        by {classroom.teacher?.name || 'Teacher'}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {classroom._count?.members || 0}</span>
                                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {classroom._count?.modules || 0}</span>
                                        <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3" /> {classroom._count?.quizzes || 0}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <School className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No classrooms yet</p>
                    <p className="text-sm">Join a classroom using the code from your teacher.</p>
                </div>
            )}
        </div>
    );
}
