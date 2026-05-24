import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const currentEnterpriseId = localStorage.getItem('currentUser') || 'ansh.patel';
  config.headers['X-Enterprise-ID'] = currentEnterpriseId;
  return config;
});

export default axiosClient;