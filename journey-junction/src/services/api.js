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
  getProfile: () => API.get('/auth/profile'),
  getNotifications: () => API.get('/auth/notifications'),
  markNotificationRead: (notificationId) => API.patch(`/auth/notifications/${notificationId}/read`),
  getUnreadCount: () => API.get('/auth/notifications/unread-count')
};

export const userAPI = {
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.post('/auth/change-password', data)
};

export const tripAPI = {
  createTrip: (data) => API.post('/trips', data),
  getMyTrips: () => API.get('/trips/my-trips'),
  getFeaturedTrips: () => API.get('/trips/featured'),
  getTripById: (id) => API.get(`/trips/${id}`),
  updateTrip: (id, data) => API.put(`/trips/${id}`, data),
  deleteTrip: (id) => API.delete(`/trips/${id}`),
  applyForTrip: (id, applicationData) => API.post(`/trips/${id}/apply`, applicationData),
  refreshTripPhotos: (id) => API.post(`/trips/${id}/refresh-photos`)
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
  deleteTrip: (id) => API.delete(`/admin/trips/${id}`),
  // Trip applicants management
  getTripApplicants: () => API.get('/admin/applicants'),
  updateApplicantStatus: (tripId, applicantId, status) => API.patch(`/admin/trips/${tripId}/applicants/${applicantId}`, { status }),
  // Admin notifications
  getNotifications: () => API.get('/admin/notifications'),
  getNotificationStats: () => API.get('/admin/notifications/stats'),
  markNotificationRead: (id) => API.patch(`/admin/notifications/${id}/read`),
  markAllNotificationsRead: () => API.patch('/admin/notifications/read-all'),
  deleteNotification: (id) => API.delete(`/admin/notifications/${id}`),
  confirmTripWithPrice: (notificationId, data) => API.patch(`/admin/notifications/${notificationId}/confirm`, data)
};

export const paymentAPI = {
  processPayment: (data) => API.post('/payment/process', data),
  getPaymentHistory: () => API.get('/payment/history'),
  getAdminNotifications: () => API.get('/payment/admin/notifications'),
  markAdminNotificationRead: (notificationId) => API.patch(`/payment/admin/notifications/${notificationId}/read`)
};

export const contactAPI = {
  sendMessage: (data) => API.post('/notifications', data)
};

export const reviewAPI = {
  submitReview: (data) => API.post('/reviews', data),
  getReviews: (guideId) => API.get(`/reviews/${guideId}`),
  getAllReviews: () => API.get('/admin/reviews')
};
