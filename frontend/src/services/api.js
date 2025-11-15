import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

export const studentAPI = {
  getGrades: (studentId) => api.get(`/student/${studentId}/grades`),
  getLabs: (studentId) => api.get(`/student/${studentId}/labs`),
  getAttendance: (studentId) => api.get(`/student/${studentId}/attendance`),
  getAttestations: (studentId) => api.get(`/student/${studentId}/attestations`),
  getTeachers: () => api.get('/student/teachers'),
  getDashboard: (studentId) => api.get(`/student/${studentId}/dashboard`),
  getSubjects: () => api.get('/student/subjects'),
};

export const teacherAPI = {
  getStudents: () => api.get('/teacher/students'),
  getSubjects: () => api.get('/teacher/subjects'),
  addSubject: (subject) => api.post('/teacher/subjects', subject),
  
  addGrade: (grade) => api.post('/teacher/grades', grade),
  updateGrade: (id, grade) => api.put(`/teacher/grades/${id}`, grade),
  deleteGrade: (id) => api.delete(`/teacher/grades/${id}`),
  
  addLab: (lab) => api.post('/teacher/labs', lab),
  updateLab: (id, lab) => api.put(`/teacher/labs/${id}`, lab),
  deleteLab: (id) => api.delete(`/teacher/labs/${id}`),
  
  addAttendance: (attendance) => api.post('/teacher/attendance', attendance),
  updateAttendance: (id, attendance) => api.put(`/teacher/attendance/${id}`, attendance),
  deleteAttendance: (id) => api.delete(`/teacher/attendance/${id}`),
  
  addAttestation: (attestation) => api.post('/teacher/attestations', attestation),
  updateAttestation: (id, attestation) => api.put(`/teacher/attestations/${id}`, attestation),
  deleteAttestation: (id) => api.delete(`/teacher/attestations/${id}`),
};

export const adminAPI = {
  // Users
  getUsers: () => api.get('/admin/users'),
  createUser: (user) => api.post('/admin/users', user),
  updateUser: (id, user) => api.put(`/admin/users/${id}`, user),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Subjects
  getSubjects: () => api.get('/admin/subjects'),
  createSubject: (subject) => api.post('/admin/subjects', subject),
  updateSubject: (id, subject) => api.put(`/admin/subjects/${id}`, subject),
  deleteSubject: (id) => api.delete(`/admin/subjects/${id}`),
  
  // Grades
  getGrades: () => api.get('/admin/grades'),
  updateGrade: (id, grade) => api.put(`/admin/grades/${id}`, grade),
  deleteGrade: (id) => api.delete(`/admin/grades/${id}`),
  
  // Labs
  getLabs: () => api.get('/admin/labs'),
  updateLab: (id, lab) => api.put(`/admin/labs/${id}`, lab),
  deleteLab: (id) => api.delete(`/admin/labs/${id}`),
  
  // Attendance
  getAttendance: () => api.get('/admin/attendance'),
  updateAttendance: (id, attendance) => api.put(`/admin/attendance/${id}`, attendance),
  deleteAttendance: (id) => api.delete(`/admin/attendance/${id}`),
  
  // Attestations
  getAttestations: () => api.get('/admin/attestations'),
  updateAttestation: (id, attestation) => api.put(`/admin/attestations/${id}`, attestation),
  deleteAttestation: (id) => api.delete(`/admin/attestations/${id}`),
};

export default api;


