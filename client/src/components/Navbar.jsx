import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/App Name */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">
              Ride Request MVP
            </span>
          </Link>

          {/* Simple Navigation */}
          <div className="flex items-center space-x-6">
            <Link
                to="/dashboard"
                className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Create Ride Request
            </Link>
            <Link 
              to="/service-provider" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Create Service Provider
            </Link>
            <Link
                to="/vehicle"
                className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Create Vehicle
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 