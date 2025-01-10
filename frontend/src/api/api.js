import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
API.interceptors.request.use(
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

// Auth endpoints
export const loginSuperuser = (credentials) => API.post('/superuser/login', credentials);
export const loginSchool = (credentials) => API.post('/school/login', credentials);
export const loginStudent = (credentials) => API.post('/student/login', credentials);

// School management endpoints
export const getSchools = () => API.get('/schools');
export const createSchool = (schoolData) => API.post('/schools', schoolData);
export const updateSchool = (id, schoolData) => API.put(`/schools/${id}`, schoolData);
export const deleteSchool = (id) => API.delete(`/schools/${id}`);

// Student management endpoints
export const getStudents = (filters) => API.get('/students', { params: filters });
export const createStudent = (studentData) => API.post('/students', studentData);
export const updateStudent = (id, studentData) => API.put(`/students/${id}`, studentData);
export const updateStudentStatus = (id, statusData) => API.patch(`/students/${id}/status`, statusData);

// Bus management endpoints
export const getBuses = () => API.get('/buses');
export const createBus = (busData) => API.post('/buses', busData);
export const updateBusLocation = (id, locationData) => API.patch(`/buses/${id}/location`, locationData);

// Attendance endpoints
export const getAttendanceReport = (filters) => API.get('/students/attendance/report', { params: filters });
export const markAttendance = (studentId, attendanceData) => API.post(`/students/${studentId}/attendance`, attendanceData);

export default API; 