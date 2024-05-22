<template>
  <div id="class">
    <div id="login">
      <h2>登陆</h2>
      <el-form :model="loginForm" status-icon ref="loginForm" label-width="80px">
        <el-form-item label="服务器">
          <el-select  v-model="value" clearable placeholder="选择服务器">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input type="username"  v-model="username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登陆</el-button>
          <el-button type="primary" @click="handclean">清除</el-button>
          <!-- <el-button type="primary" @click="handregister">注册</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
  </template>
<script>
  import axios from 'axios';
  import { ref } from 'vue';
  import { ElMessageBox } from 'element-plus';
  import { useRouter } from 'vue-router';
  const { environment } = require('/public/config.js');

export default{
  setup(){
      // 数据声明
      // const loginForm = ref({
      //   username: '',
      //   password: '',
      // });
  
      const username = ref("");const password = ref("");
      const value = ref('');
      const options = ref([]);

      // 异步加载下拉选项数据
      const loadOptions = async () => {
        try {
          const response = await axios.get(`${environment.apiUrl}/api/Org/GetOrg`);
          // console.log('下拉框',response.data);
          options.value = response.data.map(item => ({
            value: item.id, // 假设返回的数据中id字段作为value
            label: item.serveName // 假设name字段作为label
          }));
        } catch (error) {
          await ElMessageBox.alert('获取服务器失败。', '登录错误', {
              confirmButtonText: '确定',
              type: 'error',
            });
        }
      };
      loadOptions();
      // login.value.username = this.loginForm.username;
      // login.value.password = this.loginForm.password;
      const router = useRouter();

      // 方法
      const handleLogin = async () => {
        // 登录验证逻辑
        console.log('尝试登录:', username,password);
        try {
          const response = await axios.get(`${environment.apiUrl}/User/Login?UserName=${username.value}&PassWord=${password.value}&orgid=${value.value}`);
          if (response.data.success) {
            localStorage.setItem('token', response.data.response.token);
            // console.log('lq',response.data.response.token);
            router.push({ path: '/menu', query: { userAvatar: '/image/tx.jpg', userName: response.data.response.userName} });
          } else {
            await ElMessageBox.alert('登录失败，请检查您的用户名和密码。', '登录错误', {
              confirmButtonText: '确定',
              type: 'error',
            });
          }
        } catch (error) {
          //router.push('/Menu',{userAvatar:'/image/tx.jpg',userName:'LuQiang'});
          
          await ElMessageBox.alert('登录时发生错误，请稍后再试。', '错误', {
            confirmButtonText: '确定',
            type: 'error',
          });
          console.error('登录失败:', error);
        }
      };

      const handclean = () => {
        username.value = '';
        password.value = '';
        value.value = '';
        console.log("清除");
      };
      const handregister = async () =>{
          try{
              const response = await axios.post(`${environment.apiUrl}/api/User/AddUser`);
              if(response.data.success){
                ElMessageBox.alert('注册成功')
              }else{
                ElMessageBox.alert('注册失败')
              }
          }catch{
            ElMessageBox.alert('注册失败')
          }
      };
      return{
        username,
        password,
        value,
        options,
        handleLogin,
        handclean,
        handregister
      }
  }
}

</script>
<style scoped>
#class {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 确保至少占据视口高度 */
}

#login {
  width: 100%; /* 或者使用其他适当的百分比宽度 */
  max-width: 350px; /* 限制最大宽度 */
  /* margin: 0 auto; 居中 */
  margin: 300px 300px 100px auto;
  padding: 20px;
  border: 1px solid #b63737;
  background-color: rgb(40, 9, 177);
  border-radius: 5px;
}

/* 背景图片调整 */
#class {
  background-image: url('/public/image/Web.jpg');
  background-size: cover; /* 或contain根据需求调整 */
  background-position: center;
  background-repeat: no-repeat;
}
</style>

