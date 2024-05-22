<template>
  <div class="app">
    <!-- 顶部项目名称 -->
    <header class="header">
      <div class="user-info">
        <img :src="userAvatar" alt="User Avatar" class="avatar">
        <span class="username">{{ userName }}</span>
      </div>
      <span class="project-name">测试前端项目</span>
    </header>
    
    <!-- 主体内容 -->
    <div class="main-container">
      <!-- 左侧菜单栏 -->
      <nav class="menu">
        <RecursiveMenu :menuItems="menuData" @navigate="handleNavigate" />
      </nav>
      
      <!-- 右侧页面内容 -->
      <main class="content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import RecursiveMenu from './RecursiveMenu.vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  components: {
    RecursiveMenu,
  },
  data() {
    return {
      // 模拟菜单数据
      menuData: [
        {
          name: '首页',
          path: '/',
        },
        {
          name: '服务',
          children: [
            {
              name: '定时器管理',
              path: '/Timer',
            },
            {
              name: '技术支持',
              path: '/services/support',
              children: [
                {
                  name: 'FAQ',
                  path: '/services/support/faq',
                },
                // 更多子菜单...
              ],
            },
          ],
        },
        // 更多菜单项...
      ],
    };
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userAvatar = route.query.userAvatar || '/image/tx.jpg';
    const userName = route.query.userName || 'Admin';

    const navigateTo = async (path) => {
      router.push(path);
    };

    const handleNavigate = (path) => {
      navigateTo(path);
    };

    return {
      handleNavigate,
      userAvatar,
      userName,
    };
  },
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使布局占满整个视窗 */
}

.header {
  display: flex;
  align-items: center; /* 垂直居中 */
  padding: 1rem;
  background-color: #02203a;
  color: white;
  height: 10px;
}

.user-info {
  display: flex; /* 水平排列 */
  align-items: center; /* 垂直居中 */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.username {
  font-weight: bold;
}

.project-name {
  margin-left: auto; /* 将项目名称推到右侧 */
}

.main-container {
  display: flex;
  flex: 1; /* 主体内容占据剩余空间 */
}

.menu {
  width: 200px;
  background-color: #02203a;
  padding: 1rem;
}

.content {
  flex: 1; /* 右侧内容占据剩余空间 */
  padding: 1rem;
  background-size: cover; /* 或contain根据需求调整 */
  background-position: center;
  background-repeat: no-repeat;
}
</style>
