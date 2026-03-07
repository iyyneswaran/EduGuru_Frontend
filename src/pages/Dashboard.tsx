import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Target, 
  BookOpen, 
  BrainCircuit, 
  ArrowRight, 
  CheckCircle2,
  Trophy,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex! 👋</h1>
          <p className="text-muted-foreground mt-1">Ready to level up your knowledge today?</p>
        </div>
        <Button variant="neon" className="gap-2">
          <Flame className="w-4 h-4 fill-current" />
          Daily Challenge
        </Button>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl text-orange-500">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Streak</p>
                <h3 className="text-2xl font-bold text-orange-500">12 Days</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weekly Goal</p>
                <h3 className="text-2xl font-bold text-blue-500">85%</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-500">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <h3 className="text-2xl font-bold text-purple-500">1,250</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl text-green-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Topics Mastered</p>
                <h3 className="text-2xl font-bold text-green-500">8</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Continue Learning</h2>
              <Button variant="link" className="text-primary">View all</Button>
            </div>
            <Card className="group hover:border-primary/50 transition-colors cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-auto flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Physics</Badge>
                      <span className="text-xs text-muted-foreground">Unit 3 • Lesson 2</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Newton's Laws of Motion</h3>
                    <p className="text-muted-foreground text-sm mb-4">Master the three physical laws that, together, laid the foundation for classical mechanics.</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </div>
                  <Button size="lg" className="shrink-0 w-full md:w-auto gap-2">
                    Resume <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Algebra: Quadratic Equations', category: 'Math', color: 'text-pink-400', bg: 'bg-pink-500/10' },
                { title: 'The French Revolution', category: 'History', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              ].map((topic, i) => (
                <Card key={i} className="hover:bg-secondary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${topic.bg} ${topic.color}`}>
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{topic.title}</h4>
                      <p className="text-xs text-muted-foreground">{topic.category}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <Card className="bg-secondary/30 border-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Today's Missions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { task: 'Complete 1 Physics Lesson', xp: 50, done: true },
                { task: 'Score 80% in Math Quiz', xp: 30, done: false },
                { task: 'Ask AI Tutor a question', xp: 20, done: false },
              ].map((mission, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mission.done ? 'bg-green-500 border-green-500' : 'border-muted-foreground'}`}>
                      {mission.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${mission.done ? 'line-through text-muted-foreground' : ''}`}>{mission.task}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">+{mission.xp} XP</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Stuck on a problem?</h3>
                <p className="text-sm text-muted-foreground">Your AI Tutor is ready to help you understand any topic.</p>
              </div>
              <Button className="w-full" variant="outline">Ask AI Tutor</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
