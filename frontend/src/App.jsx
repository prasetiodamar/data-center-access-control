import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import DoorList from './components/DoorList';
import AccessLogList from './components/AccessLogList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/doors" element={<DoorList />} />
            <Route path="/logs" element={<AccessLogList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
