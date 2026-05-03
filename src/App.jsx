import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AttendancePage from './pages/AttendancePage';
import ReminderPage from './pages/ReminderPage';
import ChatPage from './pages/ChatPage';
import ReportsPage from './pages/ReportsPage';
import PatientsPage from './pages/PatientsPage';
import AlertContainer from './components/common/AlertContainer';
import './App.css';

export default function App() {
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Preload critical assets
    if (isAuthenticated) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/fonts/';
      document.head.appendChild(link);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin">
          <div className="h-16 w-16 border-4 border-primary-500 border-opacity-30 rounded-full border-t-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <AlertContainer />
      
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            {/* Admin Routes */}
            {user?.role === 'admin' && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/patients" element={<PatientsPage />} />
                <Route path="/admin/attendance" element={<AttendancePage />} />
                <Route path="/admin/reminders" element={<ReminderPage />} />
                <Route path="/admin/reports" element={<ReportsPage />} />
                <Route path="/admin/chat" element={<ChatPage />} />
              </>
            )}

            {/* Patient Routes */}
            {user?.role === 'patient' && (
              <>
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/chat" element={<ChatPage />} />
              </>
            )}

            {/* Pharmacist Routes */}
            {user?.role === 'pharmacist' && (
              <>
                <Route path="/pharmacist/dashboard" element={<PatientDashboard />} />
                <Route path="/pharmacist/chat" element={<ChatPage />} />
              </>
            )}

            {/* IT Staff Routes */}
            {user?.role === 'it_staff' && (
              <>
                <Route path="/it/dashboard" element={<AdminDashboard />} />
                <Route path="/it/chat" element={<ChatPage />} />
              </>
            )}

            {/* Default Route */}
            <Route 
              path="/" 
              element={
                user?.role === 'admin' ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to={`/${user?.role}/dashboard`} replace />
                )
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </div>
  );
}
