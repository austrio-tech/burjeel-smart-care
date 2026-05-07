import api from './api';

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response;
  } catch (error) {
    console.error(`[Auth] Login failed for ${username}:`, error?.message || error);
    throw new Error(error?.message || 'Invalid username or password');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('[Auth] Registration failed:', error?.message || error);
    throw new Error(error?.response?.data?.detail || error?.message || 'Registration failed');
  }
};

export const logout = async () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response;
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response;
  } catch (error) {
    throw new Error('Password change failed');
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await api.post('/auth/reset-password', { email });
    return response;
  } catch (error) {
    throw new Error('Password reset failed');
  }
};

export const verifyResetToken = async (token) => {
  try {
    const response = await api.get(`/auth/verify-reset-token/${token}`);
    return response;
  } catch (error) {
    throw new Error('Invalid reset token');
  }
};

export const confirmPasswordReset = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/confirm-password-reset', {
      token,
      newPassword,
    });
    return response;
  } catch (error) {
    throw new Error('Password reset confirmation failed');
  }
};

export const getUsers = async (role = '') => {
  try {
    const url = role ? `/auth/users?role=${role}` : '/auth/users';
    const response = await api.get(url);
    return response;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};
