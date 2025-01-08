import { createRouter, createWebHistory } from 'vue-router';
// import Home from '../Menu/MenuPage.vue'; 

const routes = [
  { 
    path: '/', 
    name: 'login',
    component: ()=>import('../Login/LoginPage.vue'),
    props: true,
    meta: { title: '登录' }
  },
  { 
    path: '/Menu', 
    name: 'menu',
    component: ()=>import('../Menu/MenuPage.vue'),
    props: true,
    //meta: { title: '首页' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录
  const isAuthenticated = localStorage.getItem('token');
  
  // 如果用户未登录且访问的不是登录页，则重定向到登录页
  if (!isAuthenticated && to.path !== '/') {
    next('/');
  } else {
    next();
  }
});

export default router;