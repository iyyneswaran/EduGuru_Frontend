import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ClassroomProvider } from '@/context/ClassroomContext';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/AdminLayout';

import Landing from '@/pages/landing/Landing';
import Dashboard from '@/pages/Dashboard';
import AITutor from '@/pages/AITutor';
import LearnPath from '@/pages/LearnPath';
import QuizArena from '@/pages/QuizArena';
import StudyMaterials from '@/pages/StudyMaterials';
import Leaderboard from '@/pages/Leaderboard';
import Achievements from '@/pages/Achievements';
import Progress from '@/pages/Progress';
import Profile from '@/pages/Profile';
import Classrooms from '@/pages/Classrooms';
import ClassroomView from '@/pages/ClassroomView';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminClassrooms from '@/pages/admin/AdminClassrooms';
import AdminCreateQuiz from '@/pages/admin/AdminCreateQuiz';
import AdminUploadMaterials from '@/pages/admin/AdminUploadMaterials';
import AdminLearningPath from '@/pages/admin/AdminLearningPath';
import AdminStudents from '@/pages/admin/AdminStudents';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';

// Auth pages
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

// Route guards
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'TEACHER') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function StudentRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'TEACHER') return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'TEACHER' ? '/admin' : '/dashboard'} replace />;
  }
  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClassroomProvider>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

            {/* Public landing */}
            <Route path="/" element={<Landing />} />

            {/* Student routes */}
            <Route path="/dashboard" element={<StudentRoute><Layout><Dashboard /></Layout></StudentRoute>} />
            <Route path="/ai-tutor" element={<StudentRoute><Layout><AITutor /></Layout></StudentRoute>} />
            <Route path="/learn-path" element={<StudentRoute><Layout><LearnPath /></Layout></StudentRoute>} />
            <Route path="/quiz-arena" element={<StudentRoute><Layout><QuizArena /></Layout></StudentRoute>} />
            <Route path="/study-materials" element={<StudentRoute><Layout><StudyMaterials /></Layout></StudentRoute>} />
            <Route path="/leaderboard" element={<StudentRoute><Layout><Leaderboard /></Layout></StudentRoute>} />
            <Route path="/achievements" element={<StudentRoute><Layout><Achievements /></Layout></StudentRoute>} />
            <Route path="/progress" element={<StudentRoute><Layout><Progress /></Layout></StudentRoute>} />
            <Route path="/profile" element={<StudentRoute><Layout><Profile /></Layout></StudentRoute>} />
            <Route path="/classrooms" element={<StudentRoute><Layout><Classrooms /></Layout></StudentRoute>} />
            <Route path="/classrooms/:id" element={<StudentRoute><Layout><ClassroomView /></Layout></StudentRoute>} />

            {/* Teacher/Admin routes */}
            <Route path="/admin" element={<TeacherRoute><AdminLayout><AdminDashboard /></AdminLayout></TeacherRoute>} />
            <Route path="/admin/classrooms" element={<TeacherRoute><AdminLayout><AdminClassrooms /></AdminLayout></TeacherRoute>} />
            <Route path="/admin/create-quiz" element={<TeacherRoute><AdminLayout><AdminCreateQuiz /></AdminLayout></TeacherRoute>} />
            <Route path="/admin/upload-materials" element={<TeacherRoute><AdminLayout><AdminUploadMaterials /></AdminLayout></TeacherRoute>} />
            <Route path="/admin/learning-path" element={<TeacherRoute><AdminLayout><AdminLearningPath /></AdminLayout></TeacherRoute>} />
            <Route path="/admin/students" element={<TeacherRoute><AdminLayout><AdminStudents /></AdminLayout></TeacherRoute>} />
            <Route path="/admin/analytics" element={<TeacherRoute><AdminLayout><AdminAnalytics /></AdminLayout></TeacherRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ClassroomProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
