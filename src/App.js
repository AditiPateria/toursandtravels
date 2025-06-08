import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Tours from './components/User/Tours';
import Bookings from './components/User/Bookings';
import Feedback from './components/User/Feedback';
import Contact from './components/User/Contact';
import About from './components/User/About';
import AdminDashboard from './components/Admin/Dashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Tours />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* User protected routes */}
              <Route path="/bookings" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <Bookings />
                </ProtectedRoute>
              } />
              <Route path="/feedback" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <Feedback />
                </ProtectedRoute>
              } />
              
              {/* Admin protected routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;