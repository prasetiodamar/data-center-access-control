import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/users', icon: '👥', label: 'Users' },
    { path: '/doors', icon: '🚪', label: 'Doors' },
    { path: '/logs', icon: '📋', label: 'Access Logs' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-blue-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Brand */}
          <div className="text-blue-900 flex items-center gap-3">
            <div className="text-3xl">🔐</div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                Access Control
              </h1>
              <p className="text-xs text-blue-600">Face Recognition System</p>
            </div>
          </div>

          {/* Navigation */}
          <ul className="flex gap-2 flex-wrap justify-end">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-1 ${
                    isActive(item.path)
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-blue-700 hover:bg-blue-100 hover:text-blue-900'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
