import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Video, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as api from '@/services/api';

export default function AdminUploadMaterials() {
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [type, setType] = useState<'PDF' | 'VIDEO' | 'NOTES'>('NOTES');
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState('');
    const [materials, setMaterials] = useState<any[]>([]);

    useEffect(() => {
        api.getClassrooms().then((res) => setClassrooms(res.data || [])).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedClassroom) {
            api.getMaterials(selectedClassroom).then((res) => setMaterials(res.data || [])).catch(console.error);
        }
    }, [selectedClassroom, success]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedClassroom) return;
        setUploading(true);
        try {
            await api.createMaterial(selectedClassroom, { title, description, fileUrl, type });
            setTitle('');
            setDescription('');
            setFileUrl('');
            setSuccess('Material uploaded successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    }

    const typeIcons = { PDF: FileText, VIDEO: Video, NOTES: BookOpen };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Upload Materials</h1>
                <p className="text-muted-foreground">Share study materials with your students</p>
            </div>

            {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm text-center">
                    {success}
                </motion.div>
            )}

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                <label className="text-sm font-medium">Title *</label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chapter 1 Notes" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type *</label>
                                <div className="flex gap-2">
                                    {(['PDF', 'VIDEO', 'NOTES'] as const).map((t) => {
                                        const Icon = typeIcons[t];
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setType(t)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${type === t
                                                    ? 'bg-primary/10 text-primary border-2 border-primary'
                                                    : 'bg-secondary/50 text-muted-foreground border-2 border-transparent hover:border-white/10'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" /> {t}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">File URL / Link *</label>
                            <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
                        </div>
                        <Button type="submit" disabled={uploading} className="gap-2">
                            <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Material'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Existing Materials */}
            {materials.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Uploaded Materials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {materials.map((m) => {
                            const Icon = typeIcons[m.type as keyof typeof typeIcons] || FileText;
                            return (
                                <Card key={m.id} className="hover:border-primary/50 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-secondary rounded-lg"><Icon className="w-5 h-5 text-primary" /></div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold truncate">{m.title}</h3>
                                                <Badge variant="secondary" className="mt-1 text-xs">{m.type}</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
