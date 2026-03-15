import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlanTrip from './pages/PlanTrip';
import EditTrip from './pages/EditTrip';
import FeaturedTrips from './pages/FeaturedTrips';
import AdminPanel from './pages/AdminPanel';
import AdminTripForm from './pages/AdminTripForm';
import AdminNotifications from './pages/AdminNotifications';
import TripDetails from './pages/TripDetails';
import Notifications from './pages/Notifications';
import PaymentMethods from './pages/PaymentMethods';
import Settings from './pages/Settings';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/plan-trip" element={<PrivateRoute><PlanTrip /></PrivateRoute>} />
          <Route path="/trip/:id/edit" element={<PrivateRoute><EditTrip /></PrivateRoute>} />
          <Route path="/featured" element={<PrivateRoute><FeaturedTrips /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/payment-methods" element={<PrivateRoute><PaymentMethods /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
          <Route path="/admin/notifications" element={<PrivateRoute adminOnly><AdminNotifications /></PrivateRoute>} />
          <Route path="/admin/trips/new" element={<PrivateRoute adminOnly><AdminTripForm /></PrivateRoute>} />
          <Route path="/admin/trips/:id/edit" element={<PrivateRoute adminOnly><AdminTripForm /></PrivateRoute>} />
          <Route path="/trip/:id" element={<PrivateRoute><TripDetails /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
