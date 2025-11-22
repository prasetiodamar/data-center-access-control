import React, { useState, useEffect } from 'react';
import { getDoors, createDoor, updateDoor, deleteDoor } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

export default function DoorList() {
  const [doors, setDoors] = useState([]);
  const [filteredDoors, setFilteredDoors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoor, setEditingDoor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    device_id: '',
    camera_url: '',
    status: true
  });

  useEffect(() => {
    fetchDoors();
  }, []);

  useEffect(() => {
    const filtered = doors.filter(door =>
      door.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      door.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      door.device_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoors(filtered);
  }, [searchTerm, doors]);

  const fetchDoors = async () => {
    try {
      setLoading(true);
      const response = await getDoors();
      setDoors(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch doors');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (door = null) => {
    if (door) {
      setEditingDoor(door);
      setFormData(door);
    } else {
      setEditingDoor(null);
      setFormData({
        name: '',
        location: '',
        device_id: '',
        camera_url: '',
        status: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDoor(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.device_id) {
      alert('Name and Device ID are required');
      return;
    }

    try {
      if (editingDoor) {
        await updateDoor(editingDoor.id, formData);
        setDoors(doors.map(d => d.id === editingDoor.id ? { ...d, ...formData } : d));
        alert('Door updated successfully');
      } else {
        const response = await createDoor(formData);
        setDoors([...doors, response.data]);
        alert('Door created successfully');
      }
      handleCloseModal();
    } catch (err) {
      setError('Failed to save door: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this door?')) return;
    try {
      await deleteDoor(id);
      setDoors(doors.filter(d => d.id !== id));
      alert('Door deleted');
    } catch (err) {
      setError('Failed to delete door');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">🚪 Door Management</h1>
        <p className="text-purple-100">Manage access doors and cameras</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="Search doors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          ➕ Add Door
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border-2 border-gray-100 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-50 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">Location</th>
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">Device ID</th>
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gray-800 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoors.length > 0 ? (
                filteredDoors.map((door, idx) => (
                  <tr key={door.id} className={`border-b border-gray-100 hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 text-purple-600 font-semibold">#{door.id}</td>
                    <td className="px-6 py-4 text-gray-800">{door.name}</td>
                    <td className="px-6 py-4 text-gray-600">{door.location || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{door.device_id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${door.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {door.status ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleOpenModal(door)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => handleDelete(door.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">No doors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">{editingDoor ? '✏️ Edit Door' : '➕ Add Door'}</h2>
              <button onClick={handleCloseModal} className="text-2xl text-gray-500 hover:text-red-500">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Door name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Floor/Building"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Device ID *</label>
                <input
                  type="text"
                  name="device_id"
                  placeholder="CAM001"
                  value={formData.device_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Camera URL</label>
                <input
                  type="text"
                  name="camera_url"
                  placeholder="rtsp://..."
                  value={formData.camera_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={formData.status}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <label htmlFor="status" className="font-semibold text-gray-700">Active</label>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 border-2 border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600">{editingDoor ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
