import api from '../api/axios';

export const getCoverLetter = (applicationId) =>
  api.get(`/ai/${applicationId}/cover-letter`).then(res => res.data);

export const getMatchScore = (applicationId) =>
  api.get(`/ai/${applicationId}/score`).then(res => res.data);

export const getInterviewPrep = (applicationId) =>
  api.get(`/ai/${applicationId}/prep`).then(res => res.data);

export const getRedFlags = (applicationId) =>
  api.get(`/ai/${applicationId}/red-flags`).then(res => res.data);

export const generateEmailReply = (applicationId, emailContent) =>
  api.post(`/ai/${applicationId}/email-reply`, { email_body: emailContent }).then(res => res.data);
