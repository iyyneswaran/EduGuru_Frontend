import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as api from '@/services/api';

export default function AdminStudents() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getAdminStudents()
            .then((res) => setStudents(res.data || []))
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Students</h1>
                <p className="text-muted-foreground">View students across all your classrooms</p>
            </div>

            {students.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No students yet</p>
                    <p className="text-sm">Students will appear here once they join your classrooms.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {/* Header */}
                    <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <span>Student</span>
                        <span>Email</span>
                        <span>Classroom</span>
                        <span>XP</span>
                        <span>Streak</span>
                    </div>
                    {students.map((s, i) => (
                        <Card key={i} className="border-none bg-secondary/20 hover:bg-secondary/40 transition-colors">
                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.user.name}`} alt={s.user.name} className="w-full h-full" />
                                    </div>
                                    <span className="font-medium">{s.user.name}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{s.user.email}</span>
                                <Badge variant="secondary">{s.classroom.name}</Badge>
                                <span className="text-primary font-bold">{s.user.xp} XP</span>
                                <span className="text-orange-500 font-bold">{s.user.streak} 🔥</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
