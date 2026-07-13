import { API_PATH } from '@/config/vars';
import axios from 'axios';
import { keycloak } from '@/auth/keycloak';

const api = axios.create({
  baseURL: API_PATH,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Attach token before every request
api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      try {
        // refresh token if it will expire in <= 30s
        await keycloak.updateToken(30);
      } catch (err) {
        // If refresh fails, force logout
        await keycloak.logout();
        return Promise.reject(err);
      }

      if (keycloak.token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.data && error.response.data.detail) {
          throw new Error(`${error.response.data.detail}`);
        }
        throw new Error(`${error.response.status} - ${error.response.statusText}`);
      }
      if (error.request) {
        throw new Error('No response received from the server.');
      }
      throw new Error(`Request error: ${error.message}`);
    }
    throw error;
  });

export default api;