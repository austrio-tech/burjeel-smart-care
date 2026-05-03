import api from './api';

export const getAttendances = async (patientId, fromDate, toDate) => {
  const params = {};
  if (patientId) params.patient_id = patientId;
  if (fromDate) params.from_date = fromDate;
  if (toDate) params.to_date = toDate;
  const response = await api.get('/attendance/', { params });
  return response;
};

export const getAttendanceById = async (attendanceId) => {
  const response = await api.get(`/attendance/${attendanceId}/`);
  return response;
};

export const createAttendance = async (attendanceData) => {
  const response = await api.post('/attendance/', attendanceData);
  return response;
};

export const updateAttendance = async (attendanceId, attendanceData) => {
  const response = await api.put(`/attendance/${attendanceId}/`, attendanceData);
  return response;
};
