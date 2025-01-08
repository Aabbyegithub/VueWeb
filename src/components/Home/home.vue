<template>
  <div class="home-container">
    <el-calendar class="small-calendar">
      <template #header="{ date }">
        <span class="calendar-header">{{ date }}</span>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  height: 100%;
  background-color: #f5f7fa;
  overflow: auto; /* Allow scrollbars */
}

.small-calendar {
  height: calc(100vh - 180px); /* Reduced height for a smaller calendar */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.small-calendar :deep(.el-calendar__header) {
  padding: 15px; /* Adjusted padding for smaller calendar */
  font-size: 18px; /* Reduced font size */
  border-bottom: 1px solid #ebeef5;
}

.small-calendar :deep(.el-calendar__body) {
  padding: 15px; /* Adjusted padding for smaller calendar */
}

.small-calendar :deep(.el-calendar-day) {
  height: 100px; /* Reduced height for calendar days */
  padding: 6px; /* Adjusted padding for smaller calendar days */
  font-size: 14px; /* Reduced font size for calendar days */
}

.calendar-header {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}
</style>
