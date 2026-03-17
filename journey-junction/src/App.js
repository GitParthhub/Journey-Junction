import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlanTrip from './pages/PlanTrip';
import EditTrip from './pages/EditTrip';
import TripDetailsNew from './pages/TripDetailsNew';
import FeaturedTrips from './pages/FeaturedTrips';
import AdminPanel from './pages/AdminPanel';
import AdminTripForm from './pages/AdminTripForm';
import AdminNotifications from './pages/AdminNotifications';
import Notifications from './pages/Notifications';
import PaymentMethods from './pages/PaymentMethods';
import Settings from './pages/Settings';
import TravelGuides from './pages/TravelGuides';
import Destinations from './pages/Destinations';
import HelpCenter from './pages/HelpCenter';
import ContactUs from './pages/ContactUs';
import TravelInsurance from './pages/TravelInsurance';
import SafetyGuidelines from './pages/SafetyGuidelines';
import FAQs from './pages/FAQs';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Blog from './pages/Blog';
import Partners from './pages/Partners';
import ConfirmTrip from './pages/ConfirmTrip';
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
          <Route path="/trip/:id/details" element={<PrivateRoute><TripDetailsNew /></PrivateRoute>} />
          <Route path="/featured" element={<PrivateRoute><FeaturedTrips /></PrivateRoute>} />
          <Route path="/confirm-trip" element={<PrivateRoute><ConfirmTrip /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/payment-methods" element={<PrivateRoute><PaymentMethods /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/travel-guides" element={<PrivateRoute><TravelGuides /></PrivateRoute>} />
          <Route path="/destinations" element={<PrivateRoute><Destinations /></PrivateRoute>} />
          <Route path="/help-center" element={<PrivateRoute><HelpCenter /></PrivateRoute>} />
          <Route path="/contact-us" element={<PrivateRoute><ContactUs /></PrivateRoute>} />
          <Route path="/travel-insurance" element={<PrivateRoute><TravelInsurance /></PrivateRoute>} />
          <Route path="/safety-guidelines" element={<PrivateRoute><SafetyGuidelines /></PrivateRoute>} />
          <Route path="/faqs" element={<PrivateRoute><FAQs /></PrivateRoute>} />
          <Route path="/about-us" element={<PrivateRoute><AboutUs /></PrivateRoute>} />
          <Route path="/careers" element={<PrivateRoute><Careers /></PrivateRoute>} />
          <Route path="/press" element={<PrivateRoute><Press /></PrivateRoute>} />
          <Route path="/blog" element={<PrivateRoute><Blog /></PrivateRoute>} />
          <Route path="/partners" element={<PrivateRoute><Partners /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
          <Route path="/admin/notifications" element={<PrivateRoute adminOnly><AdminNotifications /></PrivateRoute>} />
          <Route path="/admin/trips/new" element={<PrivateRoute adminOnly><AdminTripForm /></PrivateRoute>} />
          <Route path="/admin/trips/:id/edit" element={<PrivateRoute adminOnly><AdminTripForm /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
