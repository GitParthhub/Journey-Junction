import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlanTrip from './pages/PlanTrip';
import FeaturedTrips from './pages/FeaturedTrips';
import AdminPanel from './pages/AdminPanel';
import AdminTripForm from './pages/AdminTripForm';
import TripDetails from './pages/TripDetails';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/plan-trip" element={<PrivateRoute><PlanTrip /></PrivateRoute>} />
          <Route path="/plan-trip/:id" element={<PrivateRoute><PlanTrip /></PrivateRoute>} />
          <Route path="/featured" element={<PrivateRoute><FeaturedTrips /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
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
