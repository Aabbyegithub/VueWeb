<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">系统登录</h2>
      <el-form :model="loginForm" status-icon ref="loginForm" label-width="80px" class="login-form">
        <el-form-item label="服务器">
          <el-select v-model="value" clearable placeholder="请选择服务器" class="full-width">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input type="text" v-model="username" clearable placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密  码">
          <el-input type="password" v-model="password" show-password placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="button-group">
          <el-button type="primary" @click="handleLogin" :loading="loading">登录</el-button>
          <el-button @click="handclean">重置</el-button>
        </el-form-item>
      </el-form>
      <p class="copyright">&copy; 2024 Aabbye的测试系统. 保留所有权利。</p>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const value = ref('');
    const options = ref([]);
    const loading = ref(false);
    const router = useRouter();

    const loadOptions = async () => {
      try {
        const response = await axios.get(`/Org/GetOrg`);
        options.value = response.data.map(item => ({
          value: item.id,
          label: item.serveName
        }));
      } catch (error) {
        ElMessageBox.alert('获取服务器列表失败，请检查网络连接。', '错误提示', {
          confirmButtonText: '确定',
          type: 'error',
        });
      }
    };

    loadOptions();

    const handleLogin = async () => {
      if (!username.value || !password.value || !value.value) {
        ElMessageBox.alert('请填写完整的登录信息', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
        return;
      }

      loading.value = true;
      try {
        const response = await axios.get(`/User/Login?UserName=${username.value}&PassWord=${password.value}&orgid=${value.value}`);
        if (response.data.success) {
          // 使用 Pinia store 保存用户信息和 token
          const userStore = useUserStore();
          userStore.setToken(response.data.response.token);
          userStore.setUserInfo({
            name: response.data.response.userName,
            avatar: '/image/tx.jpg',
            IsFirst: response.data.response.isFirst
          });
          
          router.push({
            name: 'menu',
            params: {
              userName: response.data.response.userName,
              userAvatar: '/image/tx.jpg'
            }
          });
        } else {
          ElMessageBox.alert('登录失败，请检查用户名和密码。', '登录提示', {
            confirmButtonText: '确定',
            type: 'error',
          });
        }
      } catch (error) {
        ElMessageBox.alert('登录失败，请稍后重试。', '错误提示', {
          confirmButtonText: '确定',
          type: 'error',
        });
        console.error('登录错误:', error);
      } finally {
        loading.value = false;
      }
    };

    const handclean = () => {
      username.value = '';
      password.value = '';
      value.value = '';
    };

    return {
      username,
      password,
      value,
      options,
      loading,
      handleLogin,
      handclean
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('https://th.bing.com/th/id/R.8417587e78dc6c6028fa1c7b7758555e?rik=iydQurjIWIQRYw&pid=ImgRaw&r=0');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-box {
  width: 400px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.login-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.full-width {
  width: 100%;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;

  .el-button {
    width: 120px;
  }
}

.copyright {
  text-align: center;
  color: #666;
  font-size: 12px;
  margin-top: 20px;
}

:deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
}

:deep(.el-button) {
  padding: 12px 20px;
  font-size: 14px;
}
</style>
