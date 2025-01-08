import axios from 'axios';
import router from '@/components/Router/Router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user';
const { environment } = require('/public/config.js');
axios.defaults.baseURL = environment.apiUrl; // 根据你的后端 API 基础路径进行调整
// 请求拦截器
axios.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    const token = userStore.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 响应拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 清除本地存储的用户信息
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          
          // 显示提示消息
          ElMessage.error('登录已过期，请重新登录')
          
          // 如果当前不在登录页，则重定向到登录页
          if (router.currentRoute.value.path !== '/') {
            router.push({
              path: '/',
              query: {
                redirect: router.currentRoute.value.fullPath // 保存当前路由，以便登录后返回
              }
            })
          }
          break
          
        case 403:
          ElMessage.error('没有权限访问')
          break
          
        case 404:
          ElMessage.error('请求的资源不存在')
          break
          
        case 500:
          ElMessage.error('服务器错误')
          break
          
        default:
          ElMessage.error(error.response.data.message || '未知错误')
      }
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      ElMessage.error('网络错误，请检查您的网络连接')
    } else {
      // 请求配置发生错误
      ElMessage.error('请求配置错误')
    }
    return Promise.reject(error)
  }
)
export default axios;
