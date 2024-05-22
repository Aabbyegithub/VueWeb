import axios from 'axios';
const { environment } = require('/public/config.js');
axios.defaults.baseURL = environment.apiUrl; // 根据你的后端 API 基础路径进行调整

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
