import axios from 'axios';
import { API_BASE_URL } from '../config';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User endpoints
export const getUsers = (skip = 0, limit = 100) => 
  API.get(`/api/users?skip=${skip}&limit=${limit}`);

export const getUserById = (userId) => 
  API.get(`/api/users/${userId}`);

export const createUser = (userData) => 
  API.post('/api/users', userData);

export const updateUser = (userId, userData) => 
  API.put(`/api/users/${userId}`, userData);

export const deleteUser = (userId) => 
  API.delete(`/api/users/${userId}`);

// Door endpoints
export const getDoors = () => 
  API.get('/api/doors');

export const getDoorById = (doorId) => 
  API.get(`/api/doors/${doorId}`);

export const createDoor = (doorData) => 
  API.post('/api/doors', doorData);

export const updateDoor = (doorId, doorData) => 
  API.put(`/api/doors/${doorId}`, doorData);

export const deleteDoor = (doorId) => 
  API.delete(`/api/doors/${doorId}`);

// Access Log endpoints
export const getAccessLogs = (filters = {}) => 
  API.get('/api/access-logs', { params: filters });

export const getAccessLogById = (logId) => 
  API.get(`/api/access-logs/${logId}`);

export const getTodayLogs = () => 
  API.get('/api/access-logs/today');

export const createAccessLog = (logData) => 
  API.post('/api/access-logs', logData);

export default API;
