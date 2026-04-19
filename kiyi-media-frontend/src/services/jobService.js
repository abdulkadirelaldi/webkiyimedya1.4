import axios from 'axios';
import authService from './authService';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    return user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
};

const getJobs = async () => (await axios.get('/api/jobs', getAuthHeader())).data;
const createJob = async (data) => (await axios.post('/api/jobs', data, getAuthHeader())).data;
const deleteJob = async (id) => (await axios.delete(`/api/jobs/${id}`, getAuthHeader())).data;
const addTask = async (jobId, taskData) => (await axios.post(`/api/jobs/${jobId}/task`, taskData, getAuthHeader())).data;
const moveTask = async (data) => (await axios.put('/api/jobs/task/move', data, getAuthHeader())).data;
const deleteTask = async (jobId, taskId) => {
    const response = await axios.delete(`/api/jobs/${jobId}/task/${taskId}`, getAuthHeader());
    return response.data;
};
export default { getJobs, createJob, deleteJob, addTask, moveTask, deleteTask };