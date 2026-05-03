import api from './api';

export const getReminders = async (patientId) => {
  const params = {};
  if (patientId) params.patient_id = patientId;
  const response = await api.get('/reminders/', { params });
  return response;
};

export const getReminderById = async (reminderId) => {
  const response = await api.get(`/reminders/${reminderId}/`);
  return response;
};

export const createReminder = async (reminderData) => {
  const response = await api.post('/reminders/', reminderData);
  return response;
};

export const updateReminder = async (reminderId, reminderData) => {
  const response = await api.put(`/reminders/${reminderId}/`, reminderData);
  return response;
};

export const deleteReminder = async (reminderId) => {
  const response = await api.delete(`/reminders/${reminderId}/`);
  return response;
};

export const sendManualReminder = async (reminderId) => {
  const response = await api.post(`/reminders/${reminderId}/send/`);
  return response;
};
