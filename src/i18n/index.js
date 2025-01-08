import { createI18n } from 'vue-i18n'
import en from '/public/Langes/en.js'
import zh from '/public/Langes/zh.js'


const messages = {
  en,
  zh
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true, 
  locale: localStorage.getItem('language') || 'zh',
  fallbackLocale: 'zh',
  messages
})

export default i18n 