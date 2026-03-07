import React from 'react';
import { FileText, File, Plus, MoreVertical, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function StudyMaterials() {
  const materials = [
    { title: 'Physics Chapter 1 Notes', type: 'Note', date: '2 days ago', tag: 'Physics' },
    { title: 'Calculus Cheat Sheet', type: 'PDF', date: '1 week ago', tag: 'Math' },
    { title: 'History Timeline', type: 'Image', date: '3 days ago', tag: 'History' },
    { title: 'Biology Flashcards', type: 'Deck', date: 'Yesterday', tag: 'Biology' },
    { title: 'Chemistry Lab Report', type: 'Doc', date: '2 weeks ago', tag: 'Chemistry' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Study Materials</h1>
          <p className="text-muted-foreground">Organize your notes, PDFs, and flashcards.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search materials..." className="pl-10" />
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((item, i) => (
          <Card key={i} className="group hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {item.type === 'PDF' ? <File className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.date}</span>
                <Badge variant="secondary">{item.tag}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Card */}
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center bg-transparent">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-muted-foreground">Create New</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
