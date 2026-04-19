import axios from 'axios';
import authService from './authService';

const getAnalytics = async () => {
    const user = authService.getCurrentUser();
    const config = user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
    const response = await axios.get('/api/analytics', config);
    return response.data;
};

export default { getAnalytics };