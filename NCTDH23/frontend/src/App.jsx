import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { StudentRoute, CompanyRoute } from './components/ProtectedRoutes';

// Public Pages
import LandingPage from './pages/LandingPage';
import JobSearchPage from './pages/JobSearchPage';
import JobDetailPage from './pages/JobDetailPage';
import CompanyDirectoryPage from './pages/CompanyDirectoryPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import AboutPage from './pages/AboutPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentCvPage from './pages/student/StudentCvPage';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentSavedJobsPage from './pages/student/StudentSavedJobsPage';
import StudentSettingsPage from './pages/student/StudentSettingsPage';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyJobsPage from './pages/company/CompanyJobsPage';
import CreateEditJobPage from './pages/company/CreateEditJobPage';
import CompanyApplicantsPage from './pages/company/CompanyApplicantsPage';
import CompanyProfilePage from './pages/company/CompanyProfilePage';
import CompanySettingsPage from './pages/company/CompanySettingsPage';

const AppContent = () => {
  const { toast } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/companies" element={<CompanyDirectoryPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Student Protected Routes */}
          <Route element={<StudentRoute />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/cv" element={<StudentCvPage />} />
            <Route path="/student/applications" element={<StudentApplicationsPage />} />
            <Route path="/student/saved" element={<StudentSavedJobsPage />} />
            <Route path="/student/settings" element={<StudentSettingsPage />} />
          </Route>

          {/* Company Protected Routes */}
          <Route element={<CompanyRoute />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/jobs/my-jobs" element={<CompanyJobsPage />} />
            <Route path="/company/jobs/create" element={<CreateEditJobPage />} />
            <Route path="/company/jobs/edit/:id" element={<CreateEditJobPage />} />
            <Route path="/company/applicants" element={<CompanyApplicantsPage />} />
            <Route path="/company/profile" element={<CompanyProfilePage />} />
            <Route path="/company/settings" element={<CompanySettingsPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <Toast toast={toast} />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
