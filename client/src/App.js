import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import ActivityManagementPage from './pages/ActivityManagementPage';
import AchievementSubmissionPage from './pages/AchievementSubmissionPage';
import AchievementDetailsPage from './pages/AchievementDetailsPage';
import AllAchievementsPage from './pages/AllAchievementsPage';
import MyAchievementsPage from './pages/MyAchievementsPage';
import UserManagementPage from './pages/UserManagementPage';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/my-achievements" element={<PrivateRoute><MyAchievementsPage /></PrivateRoute>} />
            <Route path="/achievements/submit" element={<PrivateRoute><AchievementSubmissionPage /></PrivateRoute>} />
            <Route path="/achievements/:id" element={<PrivateRoute><AchievementDetailsPage /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
            <Route path="/admin/activities" element={<AdminRoute><ActivityManagementPage /></AdminRoute>} />
            <Route path="/admin/achievements" element={<AdminRoute><AllAchievementsPage /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;