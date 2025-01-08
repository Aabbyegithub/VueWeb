import { ref, onMounted, onUnmounted } from 'vue'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 中文语言包
// import enUs from 'element-plus/es/locale/lang/en'; // 英文语言包


/**
 * 更新语言设置
 * @param {string} locale 语言
 * @param {Object} elLocale Element Plus 语言包
 * @param {Object} currentLanguage 当前语言
 */
export function ChangeLanguage() {

}



/**
 * 格式化日期时间
 * @param {Date|string|number} date 日期对象、日期字符串或时间戳
 * @param {string} format 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export const debounce = (fn, delay) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {number} limit 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export const throttle = (fn, limit) => {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 深拷贝函数
 * @param {any} obj 要拷贝的对象
 * @returns {any} 拷贝后的新对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  const copy = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key])
    }
  }
  return copy
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 检查对象是否为空
 * @param {Object} obj 要检查的对象
 * @returns {boolean} 是否为空
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0
}

/**
 * 将查询参数对象转换为URL查询字符串
 * @param {Object} params 查询参数对象
 * @returns {string} URL查询字符串
 */
export const objectToQueryString = (params) => {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
}
/**
 * 表格高度
 */
export function useTableHeight(options = {}) {
  const {
    // 工具栏高度 (toolbar)
     toolbarHeight = 60,
    // 表格与工具栏的间距
     tableMargin = 5
  } = options
  const tableHeight = ref(0)
      // 系统头部高度 (el-header)
  const headerHeight = 60
      // 标签页高度 (el-tabs)
  const  tabsHeight = 45
  // 计算表格高度
  const calculateTableHeight = () => {

    
    // 计算表格可用高度
    const availableHeight = window.innerHeight - 
      headerHeight - 
      tabsHeight - 
      toolbarHeight - 
      tableMargin
    
    tableHeight.value = availableHeight
  }

  // 监听窗口大小变化
  const handleResize = () => {
    calculateTableHeight()
  }

  onMounted(() => {
    calculateTableHeight()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    tableHeight
  }
}

