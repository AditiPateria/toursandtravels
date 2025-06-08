import api from './api';

export const getTours = async () => {
  const response = await api.get('/admin/tours');
  return response.data;
};

export const getBookings = async () => {
  const response = await api.get('/admin/bookings');
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.put(`/admin/bookings/${bookingId}/status`, { status });
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};
