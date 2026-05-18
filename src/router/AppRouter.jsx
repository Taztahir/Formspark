import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Submissions from '../pages/Submissions';
import FormSettings from '../pages/FormSettings';
import Library from '../pages/Library';
import TermsOfService from '../pages/TermsOfService';
import ApiKeys from '../pages/ApiKeys';
import Team from '../pages/Team';
import Forms from '../pages/Forms';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import ScrollReset from '../components/ui/ScrollReset';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/library" element={<Library />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/forms"
          element={
            <ProtectedRoute>
              <Forms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/submissions"
          element={
            <ProtectedRoute>
              <Submissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/submissions/:token"
          element={
            <ProtectedRoute>
              <Submissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <FormSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/forms/:token/settings"
          element={
            <ProtectedRoute>
              <FormSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/api-keys"
          element={
            <ProtectedRoute>
              <ApiKeys />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/team"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollReset />
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default AppRouter;
