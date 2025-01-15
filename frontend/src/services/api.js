import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Add response and error interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      console.error('Network Error:', error.message);
      return Promise.reject({
        response: {
          data: {
            message: 'Network error',
            details: 'Unable to connect to the server'
          }
        }
      });
    }

    // Handle other errors
    console.error('API Response Error:', error.response?.data);
    return Promise.reject(error);
  }
);

export const schoolAPI = {
  login: (credentials) => api.post('/schools/login', credentials),
  getDashboardStats: () => api.get('/schools/dashboard'),
  getStudents: (params) => api.get('/schools/students', { params }),
  getBuses: (params) => api.get('/schools/buses', { params }),
  getAttendanceRecords: (params) => api.get('/schools/attendance', { params }),
  getBusLocations: () => api.get('/schools/bus-locations'),
};

export const studentAPI = {
  createStudent: (data) => api.post('/students', data),
  getStudentDetails: (id) => api.get(`/students/${id}`),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  updateStudentStatus: (id, data) => api.patch(`/students/${id}/status`, data),
  resetPassword: (id, data) => api.post(`/students/${id}/reset-password`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),
};

export const busAPI = {
  createBus: (data) => api.post('/buses', data),
  getBusDetails: (id) => api.get(`/buses/${id}`),
  updateBus: (id, data) => api.put(`/buses/${id}`, data),
  updateBusStatus: (id, data) => api.patch(`/buses/${id}/status`, data),
  getBusLocation: (id) => api.get(`/buses/${id}/location`),
  deleteBus: (id) => api.delete(`/buses/${id}`),
};

export const superuserAPI = {
  login: (credentials) => api.post('/superuser/login', credentials),
  getDashboardStats: () => api.get('/superuser/dashboard'),
  getAllSchools: (params) => api.get('/superuser/schools', { params }),
  getSchoolDetails: (id) => api.get(`/superuser/schools/${id}`),
  createSchool: (data) => api.post('/superuser/schools', data),
  updateSchool: (id, data) => api.put(`/superuser/schools/${id}`, data),
  resetSchoolPassword: (id, data) => api.post(`/superuser/schools/${id}/reset-password`, data),
  deleteSchool: (id) => api.delete(`/superuser/schools/${id}`),
};

export default api; 