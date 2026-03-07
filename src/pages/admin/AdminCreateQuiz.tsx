import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Gamepad2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as api from '@/services/api';

interface QuizQuestion {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
}

export default function AdminCreateQuiz() {
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [timeLimit, setTimeLimit] = useState(300);
    const [points, setPoints] = useState(100);
    const [questions, setQuestions] = useState<QuizQuestion[]>([
        { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' },
    ]);
    const [creating, setCreating] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        api.getClassrooms().then((res) => setClassrooms(res.data || [])).catch(console.error);
    }, []);

    function addQuestion() {
        setQuestions([...questions, { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);
    }

    function removeQuestion(index: number) {
        setQuestions(questions.filter((_, i) => i !== index));
    }

    function updateQuestion(index: number, field: keyof QuizQuestion, value: string) {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedClassroom) return;
        setCreating(true);
        setSuccess('');
        try {
            await api.createQuiz(selectedClassroom, { title, description, timeLimit, points, questions });
            setTitle('');
            setDescription('');
            setQuestions([{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);
            setSuccess('Quiz created successfully!');
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
                <h1 className="text-3xl font-bold">Create Quiz</h1>
                <p className="text-muted-foreground">Add a quiz with multiple-choice questions</p>
            </div>

            {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm text-center">
                    {success}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Classroom *</label>
                            <select
                                value={selectedClassroom}
                                onChange={(e) => setSelectedClassroom(e.target.value)}
                                required
                                className="w-full h-11 px-3 rounded-md bg-secondary/50 border border-white/10 text-foreground focus:border-primary outline-none"
                            >
                                <option value="">Select a classroom</option>
                                {classrooms.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quiz Title *</label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chapter 1 Test" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Time Limit (seconds)</label>
                                <Input type="number" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} min={30} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Total Points</label>
                                <Input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} min={10} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
                        <Button type="button" variant="outline" className="gap-2" onClick={addQuestion}>
                            <Plus className="w-4 h-4" /> Add Question
                        </Button>
                    </div>

                    {questions.map((q, i) => (
                        <Card key={i}>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-primary">Question {i + 1}</h3>
                                    {questions.length > 1 && (
                                        <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => removeQuestion(i)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Question *</label>
                                    <Input value={q.question} onChange={(e) => updateQuestion(i, 'question', e.target.value)} placeholder="Enter question" required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                                        <div key={opt} className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Option {opt} *</label>
                                            <Input
                                                value={q[`option${opt}` as keyof QuizQuestion]}
                                                onChange={(e) => updateQuestion(i, `option${opt}` as keyof QuizQuestion, e.target.value)}
                                                placeholder={`Option ${opt}`}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Correct Answer *</label>
                                    <div className="flex gap-2">
                                        {['A', 'B', 'C', 'D'].map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => updateQuestion(i, 'correctAnswer', opt)}
                                                className={`w-10 h-10 rounded-lg font-bold transition-all ${q.correctAnswer === opt
                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button type="submit" size="lg" disabled={creating} className="w-full gap-2">
                    <Gamepad2 className="w-5 h-5" />
                    {creating ? 'Creating Quiz...' : 'Create Quiz'}
                </Button>
            </form>
        </div>
    );
}
