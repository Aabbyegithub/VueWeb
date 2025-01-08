import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    permissions: [],
    roles: [],
    token: null,
    userInfo: null,
    language: 'zh',
    theme: 'light'
  }),
  
  actions: {
    // 权限相关
    setPermissions(permissions) {
      this.permissions = permissions
    },
    
    // 角色相关
    setRoles(roles) {
      this.roles = roles
    },
    
    // Token 相关
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    clearToken() {
      this.token = null
      localStorage.removeItem('token')
    },
    getToken() {
      return this.token || localStorage.getItem('token')
    },
    
    // 用户信息相关
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    
    getUserInfo() {
      if (!this.userInfo) {
        const stored = localStorage.getItem('userInfo')
        if (stored) {
          this.userInfo = JSON.parse(stored)
        }
      }
      return this.userInfo || {}
    },
    
    clearUserInfo() {
      this.userInfo = null
      localStorage.removeItem('userInfo')
    },
    
    // 语言设置
    setLanguage(lang) {
      this.language = lang
      localStorage.setItem('language', lang)
    },
    
    getLanguage() {
      if (!this.language) {
        this.language = localStorage.getItem('language') || 'zh'
      }
      return this.language
    },
    
    // 主题设置
    setTheme(theme) {
      this.theme = theme
      localStorage.setItem('theme', theme)
    },
    
    getTheme() {
      if (!this.theme) {
        this.theme = localStorage.getItem('theme') || 'light'
      }
      return this.theme
    }
  }
}) 