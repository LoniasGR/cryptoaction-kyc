import { API_PATH } from '@/config/vars';
import axios from 'axios';

const api = axios.create({
    baseURL: API_PATH,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(`${error.response.statusText}`);
            }
            if (error.request) {
                throw new Error('No response received from the server.');
            }
            throw new Error(`Request error: ${error.message}`);
        }
        throw error;
    });

export default api;