import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AITutor from './pages/AITutor';
import LearnPath from './pages/LearnPath';
import QuizArena from './pages/QuizArena';
import StudyMaterials from './pages/StudyMaterials';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import ProgressPage from './pages/Progress';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tutor" element={<AITutor />} />
          <Route path="/learn" element={<LearnPath />} />
          <Route path="/quiz" element={<QuizArena />} />
          <Route path="/materials" element={<StudyMaterials />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
