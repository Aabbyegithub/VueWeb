<template>
  <el-container class="layout-container">
    <!-- 头部 -->
    <el-header class="header-container">
      <div class="header-left">
        <el-button type="text" @click="toggleSidebar">
          <el-icon><Fold v-if="isCollapse"/><Expand v-else/></el-icon>
        </el-button>
        <h2>{{ t('system.title') }}</h2>
      </div>
      <div class="header-right">
        <el-button
          class="theme-button"
          type="text"
          @click="toggleTheme"
        >
          <el-icon><Moon v-if="isDarkTheme"/><Sunny v-else/></el-icon>
        </el-button>
        
        <el-badge :value="unreadCount" :max="99" :hidden="unreadCount === 0" class="message-badge">
          <el-button
            class="message-button large-button"
            type="text"
            @click="showMessages"
          >
            <el-icon><Message /></el-icon>
          </el-button>
        </el-badge>

        <el-dropdown @command="handleLanguageChange" class="language-dropdown" trigger="hover">
          <el-button type="text" class="language-selector">
            <el-icon class="language-icon"><Language /></el-icon>
            <span class="language-text">{{ currentLanguage }}</span>
            <el-icon class="arrow-icon"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu class="language-menu">
              <el-dropdown-item command="zh">
                <el-icon><Check v-if="locale === 'zh'" /></el-icon>
                中文
              </el-dropdown-item>
              <el-dropdown-item command="en">
                <el-icon><Check v-if="locale === 'en'" /></el-icon>
                English
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :src="userInfo.avatar" />
            <span>{{ userInfo.name }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">{{ t('user.profile') }}</el-dropdown-item>
              <el-dropdown-item command="logout">{{ t('user.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="main-container">
      <!-- 侧边栏 -->
      <el-aside :style="{ width: isCollapse ? '65px' : '200px', transition: 'width 0.3s' }" class="aside-container">
        <el-menu
          :collapse="isCollapse"
          :unique-opened="false"
          :default-active="activeTab"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <template v-for="menu in menuList" :key="menu.id">
            <el-menu-item v-if="!menu.children.length" :index="menu.path">
              <el-icon><component :is="menu.icon || 'HomeFilled'" /></el-icon>
              <span>{{ menu.name }}</span>
            </el-menu-item>
            
            <el-sub-menu v-else :index="menu.path">
              <template #title>
                <el-icon><component :is="menu.icon || 'Menu'" /></el-icon>
                <span>{{ menu.name }}</span>
              </template>
              <el-menu-item v-for="child in menu.children" :key="child.id" :index="child.path">
                <el-icon><component :is="child.icon || 'Document'" /></el-icon>
                <span>{{ child.name }}</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-aside>

      <!-- 主要内容区 -->
      <el-main>
        <el-tabs
          v-model="activeTab"
          type="card"
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.path"
            :label="tab.title"
            :name="tab.path"
            :closable="tab.path !== '/Home/home'"
          >
            <component :is="tab.component" />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
<!-- 个人信息完善弹窗 -->
<el-dialog
  v-model="showUserInfoDialog"
  title="完善个人信息" 
  width="500px"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
>
  <el-form :model="userInfoForm" :rules="rules" ref="userInfoFormRef" label-width="100px">
    <el-form-item class="avatar-item">
      <div class="avatar-wrapper" style="margin-left: -60px">
        <el-avatar 
          :size="100" 
          :src="userInfoForm.avatar || '/image/tx.jpg'"
          @click="triggerAvatarUpload"
        />
        <input
          type="file"
          ref="avatarInput"
          style="display: none"
          accept="image/*"
          @change="handleAvatarChange"
        />
      </div>
      <div class="avatar-hover-text" style="margin-left: 80px; font-size: 30px">{{ userInfoForm.userName || '账号显示错误'}}</div>
    </el-form-item>
    <el-form-item label="姓名" prop="user">
      <el-input v-model="userInfoForm.user" placeholder="请输入真实姓名"></el-input>
    </el-form-item>
    <el-form-item label="账号" prop="userName">
      <el-input v-model="userInfoForm.userName" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="userInfoForm.phone" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="userInfoForm.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="submitUserInfo">确认</el-button>
    </span>
  </template>
</el-dialog>

<!-- 未读消息弹窗 -->
<el-dialog
  v-model="showMessageDialog"
  title="系统消息"
  width="800px"
>
  <div style="height: 500px; overflow-y: auto;">
    <el-table :data="unreadMessages" border style="width: 100%; margin-top: 10px" :height="tableHeight" :header-cell-style="{ position: 'sticky', top: '0',  zIndex: 1 }">
      <el-table-column type="index" label="序号" width="60" header-align="center" align="center"/>
      <el-table-column prop="subject" label="标题" width="100" header-align="center" align="center"/>
      <el-table-column prop="msg" label="内容" header-align="center" />
      <el-table-column prop="addTimeString" label="时间" width="170" header-align="center" align="center"/>
    </el-table>
  </div>
</el-dialog>

</template>

<script setup>
import { ref, onMounted, defineProps, defineAsyncComponent, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {ElMessage, ElMessageBox,useLocale } from 'element-plus';
import axios from '@/axios';
import { Moon, Sunny, Message, Language } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'; // 中文语言包
import en from 'element-plus/dist/locale/en.mjs'; // 英文语言包
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
// 菜单折叠状态
const isCollapse = ref(false)
//个人信息是否弹出
const showUserInfoDialog = ref(false)
//个人信息表单
const userInfoFormRef = ref(null)
// 当前激活的标签
const activeTab = ref('')
// 打开的标签页
const tabs = ref([])
// 用户信息
const userInfo = ref({
  name: '',
  avatar: ''
})
//个人信息表单
const userInfoForm = ref({
  user: '',
  userName: '',
  phone: '',
  email: ''
})
const rules = ref({
  user: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }], 
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
})
// 菜单列表
const menuList = ref([])

const router = useRouter()

// 在 script setup 中添加 props 定义
const props = defineProps(['userName', 'userAvatar'])

// Add avatarInput ref near the top with other refs
const avatarInput = ref(null)

// 未读消息相关
const showMessageDialog = ref(false)
const unreadMessages = ref([])

// 获取菜单数据
const getMenuList = async () => {
  try {
    const response = await axios.get(`/Menu/GetMenuList`);
     menuList.value = response.data.response;
  } catch (error) {
    console.error('获取菜单失败:', error)
  }
}
// 提交个人信息
const submitUserInfo = () => {
  userInfoFormRef.value.validate((valid) => {
    if (valid) {
      axios.post('/User/UpdateUserMsge', userInfoForm.value).then(response => {
        if (response.data.start === 200) {
          ElMessage.success('个人信息修改成功');
          showUserInfoDialog.value = false;
        }else{
          ElMessage.error(response.data.message);
        }
      })
    }
  })
}
//获取个人信息
const getUserInfo = async () => {
  try {
    const response = await axios.get('/User/GetUserMsg');
    userInfoForm.value = response.data.response;
  } catch (error) {
    ElMessage.error('获取个人信息失败');
  }
}
// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 处理用户下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      // 打开个人信息页面
      await getUserInfo();
      showUserInfoDialog.value = true;
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 清除数据
        userStore.clearToken();
        userStore.clearUserInfo();
        // 返回登录界面
        router.push('/');
      }).catch(() => {
        // 取消则不做任何处理
      });
      break
  }
}

// 处理菜单选择
const handleMenuSelect = (path) => {
  const menuItem = findMenuItem(menuList.value, path)
  if (menuItem) {
    addTab(path, menuItem.name)
  }
}

// 递归查找菜单项
const findMenuItem = (items, path) => {
  for (const item of items) {
    if (item.path === path) {
      return item
    }
    if (item.children && item.children.length) {
      const found = findMenuItem(item.children, path)
      if (found) return found
    }
  }
  return null
}

// 添加标签页
const addTab = async (path, title) => {
  const isExist = tabs.value.some(tab => tab.path === path)
  if (!isExist) {
    // 修改动态导入的路径处理
    const componentPath = path.replace(/^\//, '').replace(/\//g, '/');
    const component = defineAsyncComponent(() => 
      import(`@/components/${componentPath}.vue`).catch(() => {
        console.error(`Failed to load component: ${componentPath}`);
        return {
          template: '<div>页面不存在</div>'
        }
      })
    )
    
    tabs.value.push({
      path,
      title,
      component
    })
  }
  activeTab.value = path
}

// 关闭标签页
const removeTab = (targetPath) => {
  // 首页路径
  const homePath = '/Home/home';
  
  // 如果是首页，则不允许闭
  if (targetPath === homePath) {
    return;
  }

  const targetIndex = tabs.value.findIndex(tab => tab.path === targetPath)
  tabs.value.splice(targetIndex, 1)
  
  if (activeTab.value === targetPath) {
    activeTab.value = tabs.value[targetIndex - 1]?.path || tabs.value[0]?.path
  }
}

// 使用 VueUse 的 useDark 来管理主题
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: ''
})
const toggleDark = useToggle(isDark)

const isDarkTheme = ref(isDark.value)

// 切换主题
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  toggleDark()
  // 保存主题设置到本地存储
  userStore.setTheme(isDarkTheme.value ? 'dark' : 'light')
}

const unreadCount = ref(0)
let messageTimer = null

const showMessages = async () => {
  try {
    const response = await axios.get('/User/GetMsg')
    unreadMessages.value = response.data.response
    showMessageDialog.value = true
  } catch (error) {
    ElMessage.error('获取系统消息失败')
  }
}

// 获取未读消息数
const getUnreadCount = async () => {
  try {
    const response = await axios.get('/User/GetMsgCount')
    unreadCount.value = response.data
  } catch (error) {
    console.error('获取未读消息数失败:', error)
  }
}

const currentLanguage = ref('中文')
const { t, locale } = useI18n()
const { locale: elLocale } = useLocale()
const handleLanguageChange = (lang) => {
  locale.value = lang
  if(lang === 'zh'){
    elLocale.value = zhCn;
  }else{
    elLocale.value = en;
  }
  currentLanguage.value = lang === 'zh' ? '中文' : 'English'
  userStore.setLanguage(lang)
  document.documentElement.lang = lang

}

// 头像上传
const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 创建 FormData 用于文件上传
  const formData = new FormData()
  formData.append('avatar', file)

  try {
    const response = await axios.post('/User/UploadAvatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (response.data.start === 200) {
      userInfoForm.value.avatar = response.data.response
      ElMessage.success('头像上传成功')
    }
  } catch (error) {
    ElMessage.error('头像上传失败')
  }
}

const triggerAvatarUpload = () => {
  if (avatarInput.value) {
    avatarInput.value.click();
  }
}

onMounted(async () => {
  // 获取用户信息
  if (!props.userName || !props.userAvatar) {
    const storedUserInfo = userStore.getUserInfo();
    userInfo.value = {
      name: storedUserInfo.name || '默认用户名',
      avatar: storedUserInfo.avatar || '/image/tx.jpg',
      IsFirst: storedUserInfo.IsFirst || false
    };
  } else {
    userInfo.value = {
      name: props.userName,
      avatar: props.userAvatar,
      IsFirst: props.IsFirst || false
    };
  }
  if(userInfo.value.IsFirst === false){
    await getUserInfo();
    showUserInfoDialog.value = true;
  }
  // 确保菜单数据加载
  await getMenuList()
  
  // 初始化首页标签
  addTab('/Home/home', '首页')
  
  // 初始获取未读消息数
  await getUnreadCount()
  
  // 设置定时器，每分钟获取一次未读消息数
  messageTimer = setInterval(getUnreadCount, 60000)

  const savedLanguage = userStore.getLanguage() || 'zh'
  handleLanguageChange(savedLanguage)

  // 从本地存储读取主题设置
  const savedTheme = userStore.getTheme()
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark'
    if (isDarkTheme.value) {
      document.documentElement.classList.add('dark')
    }
  }
})

onUnmounted(() => {
  // 组件卸载时清除定时器
  if (messageTimer) {
    clearInterval(messageTimer)
  }
})
</script>

<style lang="scss">
// 全局样式
body {
  background-color: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  transition: background-color 0.3s, color 0.3s;
}

// 组件局部样式
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  .main-container {
    flex: 1;
    overflow: hidden;
  }

  .el-header {
    background-color: var(--header-bg-color);
    border-bottom: 1px solid var(--header-border-color);
    transition: background-color 0.3s, border-color 0.3s;
  }

  .el-aside {
    height: 100%;
    background-color: var(--menu-bg-color);
    border-right: 1px solid var(--el-border-color);
    transition: background-color 0.3s, border-color 0.3s;
    
    .sidebar-menu {
      height: 100%;
      border-right: none;
    }
  }

  .el-menu {
    background-color: var(--menu-bg-color);
    border-right: none;
    
    .el-menu-item,
    .el-sub-menu__title {
      color: var(--el-text-color-regular);
      
      &:hover {
        background-color: var(--el-bg-color-page);
      }
    }
    
    .el-menu-item.is-active {
      color: var(--el-color-primary);
      background-color: var(--el-bg-color-page);
    }
  }

  .el-main {
    background-color: var(--el-bg-color-page);
    transition: background-color 0.3s;
    height: 100%;
    padding: 5px;
    overflow-y: hidden;
  }
}

.theme-button {
  font-size: 20px;
  padding: 0;
  color: var(--el-text-color-regular);
  transition: color 0.3s;
  margin-right: 20px;
  
  &:hover {
    color: var(--el-color-primary);
  }
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: var(--header-bg-color);
  border-bottom: 1px solid var(--header-border-color);
  transition: background-color 0.3s, border-color 0.3s;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.message-badge {
  margin-right: 10px;
}

.language-dropdown {
  margin-right: 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info span {
  margin-left: 10px;
}

.large-button {
  font-size: 24px;
  padding: 10px;
}
</style>