import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { School, Users, Gamepad2, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import * as api from '@/services/api';

interface DashboardStats {
    totalClassrooms: number;
    totalStudents: number;
    totalQuizzes: number;
    topStudents: { id: string; name: string; xp: number; streak: number }[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getAdminDashboard()
            .then((res) => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Classrooms', value: stats?.totalClassrooms || 0, icon: School, color: 'blue', gradient: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/20' },
        { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'purple', gradient: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/20' },
        { label: 'Total Quizzes', value: stats?.totalQuizzes || 0, icon: Gamepad2, color: 'green', gradient: 'from-green-500/10 to-emerald-500/10', border: 'border-green-500/20' },
        { label: 'Top Score', value: stats?.topStudents?.[0]?.xp || 0, icon: Trophy, color: 'orange', gradient: 'from-orange-500/10 to-red-500/10', border: 'border-orange-500/20' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage your classrooms and track student progress</p>
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div key={i} variants={item}>
                        <Card className={`bg-gradient-to-br ${stat.gradient} ${stat.border}`}>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className={`p-3 bg-${stat.color}-500/20 rounded-xl text-${stat.color}-500`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <h3 className={`text-2xl font-bold text-${stat.color}-500`}>{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Top Students */}
            {stats?.topStudents && stats.topStudents.length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" /> Top Students
                        </h2>
                        <div className="space-y-3">
                            {stats.topStudents.map((student, i) => (
                                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <span className={`font-bold w-6 text-center ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-700' : 'text-muted-foreground'}`}>
                                            {i + 1}
                                        </span>
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt={student.name} className="w-full h-full" />
                                        </div>
                                        <span className="font-medium">{student.name}</span>
                                    </div>
                                    <span className="text-primary font-bold">{student.xp} XP</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
