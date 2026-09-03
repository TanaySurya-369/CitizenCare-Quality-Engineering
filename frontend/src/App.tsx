import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';
import { NewComplaintPage } from './pages/NewComplaintPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { StaffDashboardPage } from './pages/StaffDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { QAAutomationPortalPage } from './pages/QAAutomationPortalPage';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected route guard
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to user's appropriate home
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'STAFF') return <Navigate to="/staff" replace />;
    return <Navigate to="/citizen" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { fetchProfile, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/qa-portal" element={<QAAutomationPortalPage />} />

            {/* Complaint Detail (Accessible by Citizen, Staff, Admin) */}
            <Route
              path="/complaints/:id"
              element={
                <ProtectedRoute>
                  <ComplaintDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Citizen Routes */}
            <Route
              path="/citizen"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'ADMIN']}>
                  <CitizenDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints/new"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'ADMIN']}>
                  <NewComplaintPage />
                </ProtectedRoute>
              }
            />

            {/* Staff Routes */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                  <StaffDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
