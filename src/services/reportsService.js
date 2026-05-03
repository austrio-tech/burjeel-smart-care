import api from './api';

export const getAttendanceReport = async (fromDate, toDate) => {
  const params = {};
  if (fromDate) params.from_date = fromDate;
  if (toDate) params.to_date = toDate;
  const response = await api.get('/reports/attendance/', { params });
  return response;
};

export const getRemindersReport = async () => {
  const response = await api.get('/reports/reminders/');
  return response;
};
