import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './components/Router/Router'
import i18n from './i18n'
import '/public/Style/style.scss'
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 中文语言包
import enUs from 'element-plus/es/locale/lang/en'; // 英文语言包
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()





// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(i18n)
app.use(pinia)
const currentLang = localStorage.getItem('language') || 'zh'
app.use(ElementPlus, {
  locale: currentLang === 'zh' ? zhCn : enUs,
})
app.mount('#app')


