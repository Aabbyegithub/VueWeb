<template>
    <div class="log-list-container">
      <!-- 工具栏和分页 -->
      <div class="toolbar">
        <div class="left">
          <!-- 筛选条件 -->
          <el-input
            v-model="searchUser"
            placeholder="操作人"
            style="width: 200px; margin-right: 10px;"
            @input="getLogList"
          />
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="margin-right: 10px;"
            @change="getLogList"
          />
        </div>
        <div class="right">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[20, 30, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
  
      <!-- 操作日志列表 -->
        <el-table :data="logList" border style="width: 100%; margin-top: -10px" :height="tableHeight" :header-cell-style="{ position: 'sticky', top: '0',zIndex: 1 }">
          <el-table-column type="index" label="序号" align="center" width="80" />
          <el-table-column prop="addUser" label="操作人" align="center" width="120" />
          <el-table-column prop="moduleName" label="操作模块" align="center" width="150" />
          <el-table-column prop="actionTypeName" label="操作类型" align="center" width="100" />
          <el-table-column prop="description" label="操作描述" align="left" header-align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="actionContent" label="操作内容" align="left" header-align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="addTimeString" label="操作时间" align="center" width="170" />
        </el-table>
      </div>
  </template>
  
  <script setup>
  
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useTableHeight } from '@/Common'
  import axios from '@/axios'
  import dayjs from 'dayjs'
  const { tableHeight } = useTableHeight()
  // 数据定义
  const logList = ref([])
  const searchUser = ref('')
  const dateRange = ref([])
  
  // 分页相关
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)
  
  // 获取操作日志列表
  const getLogList = async () => {
    try {
      const [startDate, endDate] = dateRange.value ? dateRange.value.map(date => dayjs(date).format('YYYY-MM-DD')) : []
      const response = await axios.get(`/Operlog/GetOperationlog`, {
        params: {
          User: searchUser.value,
          StartTime: startDate,
          EndTime: endDate,
          Page: currentPage.value,
          Size: pageSize.value
        }
      })
      logList.value = response.data.response
      total.value = response.data.count
    } catch (error) {
      ElMessage.error('获取操作日志列表失败')
    }
  }
  
  // 分页大小改变
  const handleSizeChange = (val) => {
    pageSize.value = val
    getLogList()
  }
  
  // 当前页改变
  const handleCurrentChange = (val) => {
    currentPage.value = val
    getLogList()
  }
  
  onMounted(() => {
    getLogList()
  })
  </script>
  
  <style scoped>
  .log-list-container {
    padding: 0px;
  }
  
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .left {
    display: flex;
    align-items: center;
  }
  </style>