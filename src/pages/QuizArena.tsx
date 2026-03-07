import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Timer, CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "What is the chemical symbol for Gold?",
    options: ["Au", "Ag", "Fe", "Cu"],
    correctAnswer: 0
  },
  {
    id: 4,
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    correctAnswer: 1
  }
];

export default function QuizArena() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0 && !isAnswerChecked) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswerChecked) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isAnswerChecked]);

  const handleTimeUp = () => {
    setIsAnswerChecked(true);
    // Auto-move after delay if no answer selected? Or just show correct answer.
  };

  const handleAnswer = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
    setIsAnswerChecked(true);
    
    if (index === QUESTIONS[currentQuestionIndex].correctAnswer) {
      setScore(score + 100);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setTimeLeft(15);
    } else {
      setGameState('finished');
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const restartQuiz = () => {
    setGameState('intro');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-4"
        >
          <Trophy className="w-16 h-16 text-primary" />
        </motion.div>
        <div>
          <h1 className="text-4xl font-bold mb-4">Quiz Arena</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Test your knowledge, earn XP, and climb the leaderboard. 
            You have 15 seconds per question.
          </p>
        </div>
        <Button size="lg" className="text-lg px-8 py-6 rounded-2xl" onClick={() => setGameState('playing')}>
          Start Quiz
        </Button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-16 h-16 text-green-500" />
          </div>
        </motion.div>
        <div>
          <h1 className="text-4xl font-bold mb-2">Quiz Completed!</h1>
          <p className="text-2xl text-primary font-bold mb-4">{score} XP Earned</p>
          <p className="text-muted-foreground">
            Accuracy: {Math.round((score / (QUESTIONS.length * 100)) * 100)}%
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={restartQuiz} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </Button>
          <Button className="gap-2">
            Next Topic <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Question {currentQuestionIndex + 1}/{QUESTIONS.length}</span>
        </div>
        <div className="flex items-center gap-2 text-orange-500 font-bold">
          <Timer className="w-5 h-5" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      <div className="mb-8">
        <Progress value={(currentQuestionIndex / QUESTIONS.length) * 100} className="h-2" />
      </div>

      <Card className="mb-8 border-primary/20 bg-secondary/30 backdrop-blur-sm">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center">{currentQuestion.text}</h2>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="wait">
          {currentQuestion.options.map((option, index) => {
            let variant = "outline";
            let className = "h-auto py-6 text-lg justify-start px-6 hover:bg-secondary/80";
            
            if (isAnswerChecked) {
              if (index === currentQuestion.correctAnswer) {
                className += " bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500/20";
              } else if (index === selectedAnswer) {
                className += " bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/20";
              } else {
                className += " opacity-50";
              }
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className={`w-full ${className}`}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswerChecked}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option}</span>
                    {isAnswerChecked && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {isAnswerChecked && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {isAnswerChecked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex justify-end"
        >
          <Button size="lg" onClick={nextQuestion} className="gap-2">
            {currentQuestionIndex < QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
