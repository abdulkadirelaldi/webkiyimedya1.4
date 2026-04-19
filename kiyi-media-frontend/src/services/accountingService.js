import axios from 'axios';
import authService from './authService';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    return user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
};

const getTransactions = async () => (await axios.get('/api/accounting', getAuthHeader())).data;
const addTransaction = async (data) => (await axios.post('/api/accounting', data, getAuthHeader())).data;
const deleteTransaction = async (id) => (await axios.delete(`/api/accounting/${id}`, getAuthHeader())).data;

export default { getTransactions, addTransaction, deleteTransaction };