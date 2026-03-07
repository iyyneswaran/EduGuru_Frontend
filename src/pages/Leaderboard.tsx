import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Leaderboard() {
  const users = [
    { rank: 1, name: 'Alex Johnson', xp: 12500, level: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { rank: 2, name: 'Sarah Smith', xp: 11200, level: 14, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { rank: 3, name: 'Mike Brown', xp: 10800, level: 13, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { rank: 4, name: 'Emily Davis', xp: 9500, level: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
    { rank: 5, name: 'Chris Wilson', xp: 8900, level: 11, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
    { rank: 6, name: 'Jessica Taylor', xp: 8200, level: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
    { rank: 7, name: 'David Anderson', xp: 7800, level: 9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    { rank: 8, name: 'Laura Martinez', xp: 7500, level: 9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura' },
    { rank: 9, name: 'Daniel Thomas', xp: 7200, level: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel' },
    { rank: 10, name: 'Sophia Hernandez', xp: 6900, level: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" /> Leaderboard
        </h1>
        <p className="text-muted-foreground">See who's topping the charts this week!</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-4 mb-12">
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full border-4 border-gray-400 overflow-hidden mb-2 relative">
            <img src={users[1].avatar} alt={users[1].name} className="w-full h-full" />
            <div className="absolute bottom-0 right-0 bg-gray-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">2</div>
          </div>
          <div className="text-center">
            <p className="font-bold">{users[1].name}</p>
            <p className="text-sm text-muted-foreground">{users[1].xp} XP</p>
          </div>
          <div className="h-24 w-24 bg-secondary/50 rounded-t-xl mt-2 flex items-end justify-center pb-2">
            <span className="text-2xl font-bold text-gray-400">2</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center z-10">
          <div className="relative mb-2">
            <Crown className="w-8 h-8 text-yellow-500 absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce" />
            <div className="w-24 h-24 rounded-full border-4 border-yellow-500 overflow-hidden relative shadow-[0_0_20px_rgba(234,179,8,0.5)]">
              <img src={users[0].avatar} alt={users[0].name} className="w-full h-full" />
            </div>
            <div className="absolute bottom-0 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">1</div>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{users[0].name}</p>
            <p className="text-sm text-yellow-500 font-bold">{users[0].xp} XP</p>
          </div>
          <div className="h-32 w-32 bg-gradient-to-b from-yellow-500/20 to-secondary/50 rounded-t-xl mt-2 flex items-end justify-center pb-4 border-t border-yellow-500/50">
            <span className="text-4xl font-bold text-yellow-500">1</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full border-4 border-orange-700 overflow-hidden mb-2 relative">
            <img src={users[2].avatar} alt={users[2].name} className="w-full h-full" />
            <div className="absolute bottom-0 right-0 bg-orange-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</div>
          </div>
          <div className="text-center">
            <p className="font-bold">{users[2].name}</p>
            <p className="text-sm text-muted-foreground">{users[2].xp} XP</p>
          </div>
          <div className="h-20 w-24 bg-secondary/50 rounded-t-xl mt-2 flex items-end justify-center pb-2">
            <span className="text-2xl font-bold text-orange-700">3</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {users.slice(3).map((user) => (
          <Card key={user.rank} className="border-none bg-secondary/20 hover:bg-secondary/40 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <span className="font-bold text-muted-foreground w-8 text-center">{user.rank}</span>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
                <img src={user.avatar} alt={user.name} className="w-full h-full" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">Level {user.level}</p>
              </div>
              <Badge variant="secondary" className="text-primary bg-primary/10 hover:bg-primary/20">
                {user.xp} XP
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
