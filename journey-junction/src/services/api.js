import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile')
};

export const tripAPI = {
  createTrip: (data) => API.post('/trips', data),
  getMyTrips: () => API.get('/trips/my-trips'),
  getFeaturedTrips: () => API.get('/trips/featured'),
  getTripById: (id) => API.get(`/trips/${id}`),
  updateTrip: (id, data) => API.put(`/trips/${id}`, data),
  deleteTrip: (id) => API.delete(`/trips/${id}`),
  applyForTrip: (id, applicationData) => API.post(`/trips/${id}/apply`, applicationData)
};

export const adminAPI = {
  getAllTrips: () => API.get('/admin/trips'),
  getAllUsers: () => API.get('/admin/users'),
  toggleFeaturedTrip: (id) => API.patch(`/admin/trips/${id}/featured`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getStats: () => API.get('/admin/stats'),
  // Admin trip management
  createTrip: (data) => API.post('/admin/trips', data),
  getTripById: (id) => API.get(`/admin/trips/${id}`),
  updateTrip: (id, data) => API.put(`/admin/trips/${id}`, data),
  deleteTrip: (id) => API.delete(`/admin/trips/${id}`)
};
