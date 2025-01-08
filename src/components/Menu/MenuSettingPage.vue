<template>
  <div class="menu-setting-container">
    <!-- 菜单管理工具栏和分页 -->
    <div class="toolbar">
      <div class="left">
        <el-button type="primary" @click="handleAdd">{{ t('common.add') }}</el-button>
        <el-input
          v-model="searchKeyword"
          :placeholder="t('common.search')"
          style="width: 200px; margin-left: 10px"
          clearable
          @clear="handleSearch"
          @input="handleSearch"
        >
          <template #suffix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="right">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[20, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 菜单列表 -->
    <el-table :data="menuList" border style="width: 100%; margin-top: -10px" :height="tableHeight" :header-cell-style="{ position: 'sticky', top: '0',  zIndex: 1 }">
      <el-table-column prop="menuCode" label="菜单编码" align="center" width="130" />
      <el-table-column prop="menuName" label="菜单名称" width="150"/>
      <el-table-column prop="parentMenu" label="上级菜单" header-align="center" align="left" />
      <el-table-column prop="menuPath" label="菜单路径" align="center" width="200" />
      <el-table-column prop="isActive" label="当前状态" align="center" width="100" />
      <el-table-column prop="addUser" label="创建人" align="center" width="100" />
      <el-table-column prop="addTimeString" label="创建时间" align="center" width="180" />
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 菜单表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="menuForm" :rules="rules" ref="menuFormRef" label-width="100px">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentMenu">
          <el-select v-model="menuForm.parentMenu" placeholder="请选择上级菜单">
            <el-option
              v-for="item in parentMenuOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单路径" prop="menuPath">
          <el-input v-model="menuForm.menuPath" placeholder="请输入菜单路径"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitMenu" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue'
import axios from '@/axios'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useTableHeight,ChangeLanguage } from '@/Common'
const { t } = useI18n()
const { tableHeight } = useTableHeight()
watch( () => {
    ChangeLanguage()
})
// 数据定义
const menuList = ref([])
const searchKeyword = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const parentMenuOptions = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const menuForm = ref({
  menuName: '',
  parentMenu: '',
  menuPath: ''
})

const rules = {
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  menuPath: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }]
}

const menuFormRef = ref(null)

// 获取菜单列表
const getMenuList = async () => {
  try {
    const response = await axios.get(`/Menu/GetMenuData?MenuName=${searchKeyword.value}&PageIndex=${currentPage.value}&PageSize=${pageSize.value}`)
    menuList.value = response.data.response
    total.value = response.data.count
  } catch (error) {
    ElMessage.error('获取菜单列表失败')
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  getMenuList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getMenuList()
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  getMenuList()
}

// 添加菜单
const handleAdd = () => {
  dialogTitle.value = '添加菜单'
  menuForm.value = {
    menuName: '',
    parentMenu: '',
    menuPath: ''
  }
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row) => {
  dialogTitle.value = '编辑菜单'
  menuForm.value = { ...row }
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = async (row) => {
  try {
    await axios.post('/Menu/DeleteMenu', { id: row.id })
    ElMessage.success('删除成功')
    getMenuList()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 提交菜单
const submitMenu = async () => {
  try {
    await menuFormRef.value.validate()
    submitLoading.value = true
    if (dialogTitle.value === '添加菜单') {
      await axios.post('/Menu/AddMenu', menuForm.value)
      ElMessage.success('添加成功')
    } else {
      await axios.post('/Menu/UpdateMenu', menuForm.value)
      ElMessage.success('编辑成功')
    }
    dialogVisible.value = false
    getMenuList()
  } catch (error) {
    ElMessage.error('提交失败')
  } finally {
    submitLoading.value = false
  }
}

// 获取上级菜单选项
const getParentMenuOptions = async () => {
  try {
    const response = await axios.get('/Menu/GetParentMenuOptions')
    parentMenuOptions.value = response.data.response
  } catch (error) {
    ElMessage.error('获取上级菜单选项失败')
  }
}

onMounted(() => {
  getMenuList()
  getParentMenuOptions()
})
</script>

<style scoped>
.menu-setting-container {
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
