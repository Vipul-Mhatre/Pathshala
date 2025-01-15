import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  superuserLogin: (data: { email: string; password: string }) =>
    api.post('/superuser/login', data),
  schoolLogin: (data: { email: string; password: string }) =>
    api.post('/schools/login', data),
};

// Superuser API
export const superuserAPI = {
  getDashboardStats: () => api.get('/superuser/dashboard'),
  getAllSchools: (params?: { page?: number; search?: string }) =>
    api.get('/superuser/schools', { params }),
  getSchoolDetails: (schoolId: string) =>
    api.get(`/superuser/schools/${schoolId}`),
  createSchool: (data: any) => api.post('/superuser/schools', data),
  updateSchool: (schoolId: string, data: any) =>
    api.put(`/superuser/schools/${schoolId}`, data),
  resetSchoolPassword: (schoolId: string, data: { newPassword: string }) =>
    api.put(`/superuser/schools/${schoolId}/reset-password`, data),
};

// School API
export const schoolAPI = {
  getDashboardStats: () => api.get('/schools/dashboard'),
  getStudents: (params?: {
    page?: number;
    search?: string;
    standard?: string;
    division?: string;
  }) => api.get('/schools/students', { params }),
  getBuses: (params?: { page?: number; search?: string }) =>
    api.get('/schools/buses', { params }),
  getAttendanceRecords: (params?: {
    startDate?: string;
    endDate?: string;
    standard?: string;
    division?: string;
    studentId?: string;
  }) => api.get('/schools/attendance', { params }),
  updateAttendance: (studentId: string, data: { date: string; status: string }) =>
    api.put(`/schools/students/${studentId}/attendance`, data),
  getBusLocations: () => api.get('/schools/buses/locations'),
};

// Student API
export const studentAPI = {
  createStudent: (data: any) => api.post('/students', data),
  getStudentDetails: (studentId: string) =>
    api.get(`/students/${studentId}`),
  updateStudent: (studentId: string, data: any) =>
    api.put(`/students/${studentId}`, data),
  updateStudentStatus: (studentId: string, data: { status: string; deviceID?: string }) =>
    api.put(`/students/${studentId}/status`, data),
  resetPassword: (studentId: string, data: { newPassword: string }) =>
    api.put(`/students/${studentId}/reset-password`, data),
  deleteStudent: (studentId: string) =>
    api.delete(`/students/${studentId}`),
};

// Bus API
export const busAPI = {
  createBus: (data: any) => api.post('/buses', data),
  getBusDetails: (busId: string) => api.get(`/buses/${busId}`),
  updateBus: (busId: string, data: any) =>
    api.put(`/buses/${busId}`, data),
  updateBusLocation: (busId: string, data: { lat: number; lon: number }) =>
    api.put(`/buses/${busId}/location`, data),
  deleteBus: (busId: string) => api.delete(`/buses/${busId}`),
}; 