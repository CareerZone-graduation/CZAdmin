import apiClient from './apiClient';

// Get auto-moderation status
export const getAutoModerationStatus = async () => {
  return await apiClient.get('/admin/settings/auto-moderation');
};

// Set auto-moderation status
export const setAutoModerationStatus = async (enabled) => {
  return await apiClient.post('/admin/settings/auto-moderation', { enabled }, { showToast: false });
};

// Approve job (duyệt job)
export const approveJob = async (jobId) => {
  return await apiClient.patch(`/admin/jobs/${jobId}/approve`);
};

// Reject job (từ chối job)
export const rejectJob = async (jobId, rejectionReason) => {
  return await apiClient.patch(`/admin/jobs/${jobId}/reject`, { rejectionReason });
};
