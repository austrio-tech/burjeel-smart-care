import api from './api';

export const getUsersByRole = async (role) => {
  const response = await api.get(`/auth/users?role=${role}`);
  return response;
};

export const createUser = async (userData) => {
  const response = await api.post('/auth/create-user', userData);
  return response;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response;
};

export const resetPassword = async (userId, newPassword) => {
  const response = await api.post(`/users/${userId}/reset-password`, { new_password: newPassword });
  return response;
};
