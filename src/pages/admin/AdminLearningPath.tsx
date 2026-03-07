import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Map, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as api from '@/services/api';

export default function AdminLearningPath() {
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [modules, setModules] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [creating, setCreating] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        api.getClassrooms().then((res) => setClassrooms(res.data || [])).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedClassroom) {
            api.getModules(selectedClassroom).then((res) => setModules(res.data || [])).catch(console.error);
        }
    }, [selectedClassroom, success]);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedClassroom) return;
        setCreating(true);
        try {
            await api.createModule(selectedClassroom, { title, description, content, order: modules.length + 1 });
            setTitle('');
            setDescription('');
            setContent('');
            setSuccess('Module created!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Learning Path Creator</h1>
                <p className="text-muted-foreground">Create ordered modules for your classrooms</p>
            </div>

            {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm text-center">
                    {success}
                </motion.div>
            )}

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Classroom *</label>
                            <select
                                value={selectedClassroom}
                                onChange={(e) => setSelectedClassroom(e.target.value)}
                                required
                                className="w-full h-11 px-3 rounded-md bg-secondary/50 border border-white/10 text-foreground focus:border-primary outline-none"
                            >
                                <option value="">Select a classroom</option>
                                {classrooms.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Module Title *</label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to Physics" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Order</label>
                                <Input type="number" value={modules.length + 1} disabled className="opacity-60" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the module" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Module content (text, markdown...)"
                                rows={4}
                                className="w-full px-3 py-2 rounded-md bg-secondary/50 border border-white/10 text-foreground focus:border-primary outline-none resize-y"
                            />
                        </div>
                        <Button type="submit" disabled={creating} className="gap-2">
                            <Plus className="w-4 h-4" /> {creating ? 'Creating...' : 'Add Module'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Existing Modules */}
            {modules.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Map className="w-5 h-5 text-primary" /> Module Order
                    </h2>
                    <div className="space-y-2">
                        {modules.map((m, i) => (
                            <Card key={m.id} className="border-border/50">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <GripVertical className="w-4 h-4" />
                                        <span className="font-bold text-primary w-6">{i + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{m.title}</h3>
                                        {m.description && <p className="text-xs text-muted-foreground">{m.description}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
