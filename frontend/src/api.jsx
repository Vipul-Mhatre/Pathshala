import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; 
export const loginSuperuser = async (email, password) => {
    return await axios.post(`${API_URL}/superuser/login`, { email, password });
};

export const getStudents = async () => {
    return await axios.get(`${API_URL}/schools/students`); 
};
