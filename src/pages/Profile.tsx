import React from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gradient-to-r from-primary to-purple-600 rounded-2xl opacity-80"></div>
        
        {/* Profile Info Overlay */}
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-background bg-background overflow-hidden shadow-xl">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full" />
          </div>
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-white drop-shadow-md">Alex Johnson</h1>
            <p className="text-white/80 font-medium">Level 15 • Science Enthusiast</p>
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <Button variant="secondary" size="sm" className="gap-2">
            <Edit2 className="w-4 h-4" /> Edit Cover
          </Button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>alex.johnson@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined September 2023</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interests</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="secondary">Physics</Badge>
              <Badge variant="secondary">Calculus</Badge>
              <Badge variant="secondary">History</Badge>
              <Badge variant="secondary">Coding</Badge>
              <Badge variant="secondary">Space</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Account Settings</CardTitle>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input defaultValue="alex_j" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input defaultValue="Alex Johnson" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue="alex.johnson@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Grade Level</label>
                  <Input defaultValue="10th Grade" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Master Physics Mechanics</p>
                  <p className="text-xs text-muted-foreground">Due in 2 weeks</p>
                </div>
                <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">In Progress</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Complete Algebra II</p>
                  <p className="text-xs text-muted-foreground">Due in 1 month</p>
                </div>
                <Badge variant="outline" className="text-blue-500 border-blue-500/50">Started</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
