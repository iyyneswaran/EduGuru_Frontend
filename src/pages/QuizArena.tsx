import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClassroom } from '@/context/ClassroomContext';
import * as api from '@/services/api';

type QuizState = 'list' | 'playing' | 'result';

export default function QuizArena() {
  const { classrooms, fetchClassrooms } = useClassroom();
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Quiz playing state
  const [quizState, setQuizState] = useState<QuizState>('list');
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchClassrooms(); }, [fetchClassrooms]);

  useEffect(() => {
    if (classrooms.length > 0 && !selectedClassroom) setSelectedClassroom(classrooms[0].id);
  }, [classrooms, selectedClassroom]);

  useEffect(() => {
    if (selectedClassroom) {
      setLoading(true);
      api.getQuizzes(selectedClassroom).then(res => setQuizzes(res.data || [])).catch(console.error).finally(() => setLoading(false));
    }
  }, [selectedClassroom]);

  // Timer
  useEffect(() => {
    if (quizState !== 'playing' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState, timeLeft]);

  async function startQuiz(quizId: string) {
    const res = await api.getQuiz(selectedClassroom, quizId);
    const quiz = res.data;
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setAnswers([]);
    setTimeLeft(quiz.timeLimit || 300);
    setQuizState('playing');
  }

  function selectAnswer(questionId: string, answer: string) {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = { questionId, answer };
        return copy;
      }
      return [...prev, { questionId, answer }];
    });
  }

  async function handleSubmit() {
    if (submitting || !activeQuiz) return;
    setSubmitting(true);
    try {
      const res = await api.submitQuiz(selectedClassroom, activeQuiz.id, answers);
      setResult(res.data);
      setQuizState('result');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function backToList() {
    setQuizState('list');
    setActiveQuiz(null);
    setResult(null);
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ─── Result Screen ────────────────────────────────
  if (quizState === 'result' && result) {
    const pct = Math.round((result.correctCount / result.totalQuestions) * 100);
    return (
      <div className="max-w-lg mx-auto text-center space-y-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-bold ${pct >= 70 ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
            {pct}%
          </div>
        </motion.div>
        <h1 className="text-2xl font-bold">{pct >= 70 ? 'Great Job! 🎉' : 'Keep Practicing! 💪'}</h1>
        <div className="grid grid-cols-2 gap-4">
          <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Score</p><p className="text-xl font-bold text-primary">{result.score}/{result.totalPoints}</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Correct</p><p className="text-xl font-bold text-green-500">{result.correctCount}/{result.totalQuestions}</p></CardContent></Card>
        </div>
        <Button onClick={backToList} className="gap-2">Back to Quizzes <ChevronRight className="w-4 h-4" /></Button>
      </div>
    );
  }

  // ─── Playing Screen ───────────────────────────────
  if (quizState === 'playing' && activeQuiz) {
    const q = activeQuiz.questions[currentQ];
    if (!q) return null;
    const selectedAnswer = answers.find(a => a.questionId === q.id)?.answer;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">{activeQuiz.title}</h2>
          <Badge variant="outline" className={`font-mono text-lg ${timeLeft < 30 ? 'text-destructive animate-pulse' : ''}`}>
            <Clock className="w-4 h-4 mr-1" /> {formatTime(timeLeft)}
          </Badge>
        </div>

        {/* Progress */}
        <div className="flex gap-1">
          {activeQuiz.questions.map((_: any, i: number) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i === currentQ ? 'bg-primary' : i < currentQ ? 'bg-green-500' : 'bg-secondary'}`} />
          ))}
        </div>

        {/* Question */}
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Question {currentQ + 1} of {activeQuiz.questions.length}</p>
            <h3 className="text-lg font-semibold mb-6">{q.question}</h3>
            <div className="grid grid-cols-1 gap-3">
              {['A', 'B', 'C', 'D'].map(opt => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(q.id, opt)}
                  className={`p-4 rounded-xl text-left transition-all ${selectedAnswer === opt
                    ? 'bg-primary/10 border-2 border-primary text-primary'
                    : 'bg-secondary/30 border-2 border-transparent hover:border-white/10'
                    }`}
                >
                  <span className="font-bold mr-3">{opt}.</span> {q[`option${opt}`]}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
            Previous
          </Button>
          {currentQ === activeQuiz.questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button onClick={() => setCurrentQ(currentQ + 1)}>Next</Button>
          )}
        </div>
      </div>
    );
  }

  // ─── Quiz List ────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-primary" /> Quiz Arena
          </h1>
          <p className="text-muted-foreground mt-1">Take quizzes and earn XP</p>
        </div>
        {classrooms.length > 0 && (
          <select value={selectedClassroom} onChange={e => setSelectedClassroom(e.target.value)} className="h-10 px-3 rounded-lg bg-secondary/50 border border-white/10 text-foreground outline-none focus:border-primary">
            {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : quizzes.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No quizzes available for this classroom yet.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map(q => (
            <Card key={q.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{q.title}</h3>
                    {q.description && <p className="text-sm text-muted-foreground">{q.description}</p>}
                  </div>
                  <Gamepad2 className="w-5 h-5 text-primary shrink-0" />
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                  <span>{q._count?.questions || 0} questions</span>
                  <span>{q.points} points</span>
                  <span>{formatTime(q.timeLimit)}</span>
                </div>
                <Button size="sm" onClick={() => startQuiz(q.id)}>
                  Start Quiz <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
