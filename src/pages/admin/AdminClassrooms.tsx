import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, School, Users, BookOpen, Gamepad2, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as api from '@/services/api';

export default function AdminClassrooms() {
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [creating, setCreating] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        loadClassrooms();
    }, []);

    async function loadClassrooms() {
        try {
            const res = await api.getClassrooms();
            setClassrooms(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        try {
            await api.createClassroom({ name, subject, description });
            setName('');
            setSubject('');
            setDescription('');
            setShowForm(false);
            await loadClassrooms();
        } catch (err) {
            console.error(err);
        } finally {
            setCreating(false);
        }
    }

    function copyCode(code: string) {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Classrooms</h1>
                    <p className="text-muted-foreground">Create and manage your classrooms</p>
                </div>
                <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4" /> Create Classroom
                </Button>
            </div>

            {/* Create Form */}
            {showForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold mb-4">New Classroom</h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Classroom Name *</label>
                                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Physics 101" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject *</label>
                                        <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Physics" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description..." />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                                    <Button type="submit" disabled={creating}>
                                        {creating ? 'Creating...' : 'Create Classroom'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Classrooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classrooms.map((classroom) => (
                    <Card key={classroom.id} className="group hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <School className="w-6 h-6" />
                                </div>
                                <Badge variant="secondary">{classroom.subject}</Badge>
                            </div>
                            <h3 className="font-bold text-lg mb-1">{classroom.name}</h3>
                            {classroom.description && (
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{classroom.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {classroom._count?.members || 0} students</span>
                                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {classroom._count?.modules || 0} modules</span>
                                <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3" /> {classroom._count?.quizzes || 0} quizzes</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                                <div>
                                    <span className="text-xs text-muted-foreground">Class Code: </span>
                                    <span className="font-mono font-bold text-primary">{classroom.code}</span>
                                </div>
                                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => copyCode(classroom.code)}>
                                    {copiedCode === classroom.code ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {classrooms.length === 0 && !showForm && (
                <div className="text-center py-12 text-muted-foreground">
                    <School className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No classrooms yet</p>
                    <p className="text-sm">Create your first classroom to get started!</p>
                </div>
            )}
        </div>
    );
}
