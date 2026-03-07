import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Map,
  Gamepad2,
  Library,
  Trophy,
  Medal,
  BarChart3,
  User,
  Search,
  Bell,
  Flame,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string, onClick?: () => void }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );
};

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tutor', icon: Bot, label: 'AI Tutor' },
    { to: '/learn', icon: Map, label: 'Learn Path' },
    { to: '/quiz', icon: Gamepad2, label: 'Quiz Arena' },
    { to: '/materials', icon: Library, label: 'Study Materials' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/achievements', icon: Medal, label: 'Achievements' },
    { to: '/progress', icon: BarChart3, label: 'Progress' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-all duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">L</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              EduGuru
            </h1>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileMenu}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileMenu}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search topics, quizzes..." className="pl-10 bg-secondary/50 border-transparent focus:bg-background focus:border-primary" />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-white/5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-sm font-bold text-orange-500">12</span>
              <span className="text-xs text-muted-foreground">Day Streak</span>
            </div>

            <div className="hidden md:flex flex-col w-32 gap-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-primary">Lvl 5</span>
                <span className="text-muted-foreground">1,250 XP</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-cyan-400 p-[2px]">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
