import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { School, LogIn as JoinIcon, Users, BookOpen, Gamepad2, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClassroom } from '@/context/ClassroomContext';
import { useNavigate } from 'react-router-dom';

export default function Classrooms() {
    const { classrooms, fetchClassrooms, joinClassroom, isLoading } = useClassroom();
    const [code, setCode] = useState('');
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState('');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
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

    const copyToClipboard = (e: React.MouseEvent, text: string) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedCode(text);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Classrooms</h1>
                <p className="text-muted-foreground mt-1">Join and explore your classrooms</p>
            </div>

            {/* Join Classroom */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-cyan-500/5 max-w-2xl">
                <CardContent className="p-6">
                    <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <JoinIcon className="w-4 h-4 text-primary" />
                        Join a Classroom
                    </h2>
                    <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter class code (e.g. A1B2C3)"
                            className="flex-1 bg-secondary/50 uppercase font-mono"
                            required
                        />
                        <Button type="submit" disabled={joining} className="shrink-0 w-full sm:w-auto">
                            {joining ? 'Joining...' : 'Join'}
                        </Button>
                    </form>
                    {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                </CardContent>
            </Card>

            {/* Classrooms Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            ) : classrooms.length > 0 ? (
                <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {classrooms.map((classroom) => (
                        <motion.div key={classroom.id} variants={item}>
                            <Card
                                className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
                                style={{ background: '#1c2132', borderColor: 'rgba(255, 255, 255, 0.05)' }}
                                onClick={() => navigate(`/classrooms/${classroom.id}`)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-[#2c1c4d] rounded-2xl text-[#b48cff] shadow-inner">
                                            <School className="w-7 h-7" />
                                        </div>
                                        <div className="text-white font-bold text-sm tracking-wide">
                                            {classroom.subject || 'General'}
                                        </div>
                                    </div>

                                    <h3 className="font-extrabold text-2xl text-white mb-2 leading-tight">
                                        {classroom.name}
                                    </h3>

                                    <p className="text-[#94a3b8] text-base mb-6 line-clamp-2">
                                        {classroom.description || `${classroom.subject} classroom for ${classroom.name} students`}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-5 text-sm text-[#94a3b8] mb-6 font-medium">
                                        <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                                            <Users className="w-4 h-4" /> {classroom._count?.members || 0} students
                                        </span>
                                        <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                                            <BookOpen className="w-4 h-4" /> {classroom._count?.modules || 0} modules
                                        </span>
                                        <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                                            <Gamepad2 className="w-4 h-4" /> {classroom._count?.quizzes || 0} quizzes
                                        </span>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div className="text-[#94a3b8] text-sm flex items-center gap-2">
                                            Class Code: <span className="text-[#b48cff] font-mono font-bold">{classroom.code}</span>
                                        </div>
                                        <button
                                            onClick={(e) => copyToClipboard(e, classroom.code)}
                                            className="p-2 hover:bg-white/5 rounded-lg text-[#94a3b8] hover:text-white transition-colors"
                                            title="Copy Code"
                                        >
                                            {copiedCode === classroom.code ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-white/5">
                    <School className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
                    <p className="text-xl font-medium text-foreground mb-2">No classrooms yet</p>
                    <p className="text-muted-foreground max-w-sm mx-auto">Join a classroom using the code provided by your teacher to start learning.</p>
                </div>
            )}
        </div>
    );
}
