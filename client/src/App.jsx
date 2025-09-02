import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ServiceProviderHome from './pages/ServiceProviderHome'
import Dashboard from './pages/Dashboard'
import CreateRideRequest from './pages/CreateRideRequest'
import VehicleHome from "./pages/VehicleHome";


function AppRoutes() {
  return (
    <Router>
      <div className="min-h-screen min-w-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CreateRideRequest />} />
            <Route path="/service-provider" element={<ServiceProviderHome />} />
            <Route path="/vehicle" element={<VehicleHome />} />
            <Route path="/dashboard" element={<Dashboard />} />
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