import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Flame, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Your account information</p>
      </motion.div>

      {/* Avatar Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-cyan-500/10 border-primary/20">
        <CardContent className="p-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-cyan-400 p-[3px] mb-4">
            <div className="w-full h-full rounded-full bg-background overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'user'}`}
                alt="Avatar"
                className="w-full h-full"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold">{user?.name || 'Student'}</h2>
          <Badge variant="secondary" className="mt-2">{user?.role || 'STUDENT'}</Badge>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Mail className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || '—'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><Shield className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{user?.role?.toLowerCase() || 'student'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500"><Flame className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="font-medium">{user?.streak || 0} days</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><Trophy className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total XP</p>
              <p className="font-medium">{user?.xp || 0} XP</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <button
        onClick={logout}
        className="w-full p-3 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors font-medium"
      >
        Sign Out
      </button>
    </div>
  );
}
