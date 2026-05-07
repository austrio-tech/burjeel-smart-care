import api from './api';

export const getPatients = async (name) => {
  const params = {};
  if (name) params.name = name;
  const response = await api.get('/patients/', { params });
  return response;
};

export const getPatientById = async (patientId) => {
  const response = await api.get(`/patients/${patientId}/`);
  return response;
};

export const createPatient = async (patientData) => {
  const response = await api.post('/patients/', patientData);
  return response;
};

export const updatePatient = async (patientId, patientData) => {
  const response = await api.put(`/patients/${patientId}`, patientData);
  return response;
};

export const deletePatient = async (patientId) => {
  const response = await api.delete(`/patients/${patientId}`);
  return response;
};
