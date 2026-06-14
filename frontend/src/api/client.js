import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cybershield.access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem('cybershield.access', access);
  if (refresh) localStorage.setItem('cybershield.refresh', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('cybershield.access');
  localStorage.removeItem('cybershield.refresh');
};

export const demoScan = {
  scan_type: 'email',
  content:
    'Urgent: verify account immediately. Click here to login and confirm your password before your banking access is suspended.',
};
