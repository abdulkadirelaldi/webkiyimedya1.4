import axios from 'axios';
import authService from './authService';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    return user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
};

const getCustomers = async () => (await axios.get('/api/customers', getAuthHeader())).data;
const addCustomer = async (data) => (await axios.post('/api/customers', data, getAuthHeader())).data;
const updateStatus = async (id, status) => (await axios.put(`/api/customers/${id}`, { status }, getAuthHeader())).data;
const deleteCustomer = async (id) => (await axios.delete(`/api/customers/${id}`, getAuthHeader())).data;

export default { getCustomers, addCustomer, updateStatus, deleteCustomer };