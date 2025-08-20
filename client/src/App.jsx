import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ServiceProviderHome from './pages/ServiceProviderHome'
import UserHome from './pages/UserHome'


function AppRoutes() {
  return (
    <Router>
      <div className="min-h-screen min-w-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<UserHome />} />
            <Route path="/service-provider" element={<ServiceProviderHome />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App 