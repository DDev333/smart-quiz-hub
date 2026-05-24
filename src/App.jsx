import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import MyQuestions from './MyQuestions';
import MyPendingReviews from './MyPendingReviews';
import AdminDashboard from './AdminDashboard';
import AddQuestion from './AddQuestion';
import EditQuestion from './EditQuestion';
import Login from './Login';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('currentUserRole');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><Navigate to="/my-questions" replace /></ProtectedRoute>} />
        <Route path="/my-questions" element={<ProtectedRoute><MyQuestions /></ProtectedRoute>} />
        <Route path="/pending-reviews" element={<ProtectedRoute><MyPendingReviews /></ProtectedRoute>} />
        <Route path="/add-question" element={<ProtectedRoute><AddQuestion /></ProtectedRoute>} />
        <Route path="/edit-question/:id" element={<ProtectedRoute><EditQuestion /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}