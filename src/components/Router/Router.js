import { createRouter, createWebHistory } from 'vue-router';
// import Home from '../Menu/MenuPage.vue'; 

const routes = [
  { path: '/', component: ()=>import('../Login/LoginPage.vue') },
  { path: '/Menu', component: ()=>import('../Menu/MenuPage.vue') ,props: (route) => ({ userAvatar: route.params.userAvatar, userName: route.params.userName})},
  { path: '/Timer', component: ()=>import('../Timer/TimerPage.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;