import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Users, Gamepad2 } from 'lucide-react';
import * as api from '@/services/api';

export default function AdminAnalytics() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getAdminDashboard()
            .then((res) => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const chartData = stats?.topStudents?.map((s: any, i: number) => ({
        name: s.name.split(' ')[0],
        xp: s.xp,
    })) || [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Overview of your classroom performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <CardContent className="p-6 text-center">
                        <School className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <h3 className="text-4xl font-bold text-blue-500 mb-1">{stats?.totalClassrooms || 0}</h3>
                        <p className="text-sm text-muted-foreground">Classrooms</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                    <CardContent className="p-6 text-center">
                        <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <h3 className="text-4xl font-bold text-purple-500 mb-1">{stats?.totalStudents || 0}</h3>
                        <p className="text-sm text-muted-foreground">Students</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardContent className="p-6 text-center">
                        <Gamepad2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <h3 className="text-4xl font-bold text-green-500 mb-1">{stats?.totalQuizzes || 0}</h3>
                        <p className="text-sm text-muted-foreground">Quizzes</p>
                    </CardContent>
                </Card>
            </div>

            {chartData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Student XP</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                        cursor={{ fill: '#334155', opacity: 0.4 }}
                                    />
                                    <Bar dataKey="xp" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
