import React, { useState, useEffect } from 'react';
import { getAccessLogs } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

export default function AccessLogList() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    userId: '',
    doorId: '',
    status: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, logs]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getAccessLogs();
      setLogs(response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setError('');
    } catch (err) {
      setError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = logs;

    if (filters.userId) {
      result = result.filter(log => log.user_id === parseInt(filters.userId));
    }

    if (filters.doorId) {
      result = result.filter(log => log.door_id === parseInt(filters.doorId));
    }

    if (filters.status) {
      result = result.filter(log => log.status === filters.status);
    }

    if (filters.search) {
      result = result.filter(log =>
        log.notes?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredLogs(result);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'User ID', 'Door ID', 'Timestamp', 'Status', 'Confidence', 'Notes'];
    const csv = [
      headers.join(','),
      ...filteredLogs.map(log =>
        [log.id, log.user_id, log.door_id, log.timestamp, log.status, (log.confidence_score * 100).toFixed(1), log.notes || ''].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'access_logs.csv';
    a.click();
  };

  if (loading) return <LoadingSpinner />;

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">📋 Access Logs</h1>
        <p className="text-green-100">View and analyze access history</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border-2 border-gray-100 shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">User ID</label>
            <input type="text" name="userId" value={filters.userId} onChange={handleFilterChange} placeholder="Filter by user" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Door ID</label>
            <input type="text" name="doorId" value={filters.doorId} onChange={handleFilterChange} placeholder="Filter by door" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg">
              <option value="">All</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Search Notes</label>
            <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search..." className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg" />
          </div>
        </div>
        <button onClick={handleExportCSV} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
          📥 Export CSV
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border-2 border-gray-100 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-50 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">User</th>
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">Door</th>
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">Timestamp</th>
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log, idx) => (
                  <tr key={log.id} className={`border-b border-gray-100 hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 text-green-600 font-semibold">#{log.id}</td>
                    <td className="px-6 py-4 text-gray-800">{log.user_id || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{log.door_id}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{new Date(log.timestamp).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        log.status === 'success' ? 'bg-green-100 text-green-800' :
                        log.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{(log.confidence_score * 100).toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">No logs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentPage === page
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
