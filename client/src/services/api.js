import api from '../api/axios';


export const getApplications = () =>
  api.get('/applications').then(res => res.data);

export const getStats = () =>
  api.get('/applications/stats').then(res => res.data);

export const createApplication = (data) =>
  api.post('/applications', data).then(res => res.data);

export const updateApplication = (id, data) =>
  api.patch(`/applications/${id}`, data).then(res => res.data);

export const deleteApplication = (id) =>
  api.delete(`/applications/${id}`).then(res => res.data);

export const getSavedCoverLetter = (id) =>
  api.get(`/applications/${id}/cover-letter`).then(res => res.data);

export const saveCoverLetter = (id, body) =>
  api.put(`/applications/${id}/cover-letter`, { body }).then(res => res.data);
