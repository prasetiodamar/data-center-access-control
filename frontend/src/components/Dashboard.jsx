import React, { useState, useEffect } from 'react';
import { getUsers, getDoors, getTodayLogs } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoors: 0,
    todayAccess: 0,
    systemStatus: 'Online'
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, doorsRes, todayRes] = await Promise.all([
        getUsers(),
        getDoors(),
        getTodayLogs()
      ]);

      setStats({
        totalUsers: usersRes.data.length,
        totalDoors: doorsRes.data.length,
        todayAccess: todayRes.data.length,
        systemStatus: 'Online'
      });

      setRecentLogs(todayRes.data.slice(0, 10));
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      setStats(prev => ({ ...prev, systemStatus: 'Offline' }));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { icon: '👥', label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500', lightColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { icon: '🚪', label: 'Total Doors', value: stats.totalDoors, color: 'bg-purple-500', lightColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    { icon: '📊', label: "Today's Access", value: stats.todayAccess, color: 'bg-green-500', lightColor: 'bg-green-50', borderColor: 'border-green-200' },
    { icon: '🟢', label: 'System Status', value: stats.systemStatus, color: 'bg-emerald-500', lightColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Access Control System</h1>
        <p className="text-blue-100">{new Date().toLocaleString('id-ID')}</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.lightColor} border-2 ${stat.borderColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} text-white text-4xl p-4 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-600 text-sm uppercase font-semibold tracking-wider">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} bg-clip-text text-transparent mt-1`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Access Logs */}
      <div className="bg-white rounded-xl p-8 border-2 border-gray-100 shadow-lg">
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Recent Access Logs</h2>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50 border-b-2 border-gray-200">
                <th className="px-6 py-3 text-left text-gray-800 font-semibold text-sm uppercase">ID</th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold text-sm uppercase">User</th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold text-sm uppercase">Door</th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold text-sm uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold text-sm uppercase">Status</th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold text-sm uppercase">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.length > 0 ? (
                recentLogs.map((log, idx) => (
                  <tr key={log.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 text-blue-600 font-semibold">#{log.id}</td>
                    <td className="px-6 py-4 text-gray-700">{log.user_id || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-700">{log.door_id}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{new Date(log.timestamp).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        log.status === 'success' ? 'bg-green-100 text-green-800' :
                        log.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{(log.confidence_score * 100).toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
