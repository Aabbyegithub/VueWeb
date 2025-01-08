<template>
  <div class="user-list-container">
    <!-- 工具栏和分页 -->
    <div class="toolbar">
      <div class="left">
        <el-button type="primary" @click="handleAdd">新增用户</el-button>
        <el-input
          v-model="searchKeyword"
          placeholder="请输入用户名称搜索"
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
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 用户列表 -->
    <el-table :data="userList" border style="width: 100%; margin-top: -10px">
      <el-table-column prop="userCode" label="人员编码" align="center" width="120" />
      <el-table-column prop="userName" label="姓名" align="center" width="120" />
      <el-table-column prop="position" label="职务" align="center" width="120" />
      <el-table-column prop="department" label="部门" align="center" width="120" />
      <el-table-column prop="email" label="邮箱" align="center" width="180" />
      <el-table-column prop="phone" label="电话" align="center" width="120" />
      <el-table-column prop="status" label="状态" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
            {{ scope.row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="addUser" label="创建人" align="center" width="120" />
      <el-table-column prop="addTime" label="创建时间" align="center" width="180" />
      <el-table-column label="操作" width="280" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="success" size="small" @click="handleAssignRole(scope.row)">分配角色</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 用户表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="100px">
        <el-form-item label="人员编码" prop="userCode">
          <el-input v-model="userForm.userCode" placeholder="请输入人员编码"/>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="职务" prop="position">
          <el-input v-model="userForm.position" placeholder="请输入职务"/>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="userForm.department" placeholder="请输入部门"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入电话"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            :active-value="'1'"
            :inactive-value="'0'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUser" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 角色分配对话框 -->
    <el-dialog
      title="角色分配"
      v-model="roleDialogVisible"
      width="500px"
    >
      <el-transfer
        v-model="selectedRoles"
        :data="roleList"
        :props="{
          key: 'id',
          label: 'roleName'
        }"
      />
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUserRoles" :loading="loading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import axios from '@/axios'

// 数据定义
const userList = ref([])
const roleList = ref([])
const searchKeyword = ref('')
const dialogVisible = ref(false)
const roleDialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const loading = ref(false)
const selectedRoles = ref([])
const currentUser = ref(null)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const userForm = ref({
  userCode: '',
  userName: '',
  position: '',
  department: '',
  email: '',
  phone: '',
  status: '1'
})

const rules = {
  userCode: [{ required: true, message: '请输入人员编码', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const userFormRef = ref(null)

// 获取用户列表
const getUserList = async () => {
  try {
    const response = await axios.get(`/User/GetUserList?keyword=${searchKeyword.value}&pageIndex=${currentPage.value}&pageSize=${pageSize.value}`)
    userList.value = response.data.response
    total.value = response.data.count
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  }
}

// 获取角色列表
const getRoleList = async () => {
  try {
    const response = await axios.get('/Role/GetAllRoles')
    roleList.value = response.data.response
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  getUserList()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  getUserList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getUserList()
}

// 新增用户
const handleAdd = () => {
  dialogTitle.value = '新增用户'
  userForm.value = {
    userCode: '',
    userName: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    status: '1'
  }
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  userForm.value = { ...row }
  dialogVisible.value = true
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await axios.delete(`/User/DeleteUser/${row.id}`)
      ElMessage.success('删除成功')
      getUserList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 分配角色
const handleAssignRole = async (row) => {
  currentUser.value = row
  roleDialogVisible.value = true
  try {
    const response = await axios.get(`/User/GetUserRoles?userId=${row.id}`)
    selectedRoles.value = response.data.response.map(role => role.id)
  } catch (error) {
    ElMessage.error('获取用户角色失败')
  }
}

// 保存用户角色
const saveUserRoles = async () => {
  if (!currentUser.value) return
  
  loading.value = true
  try {
    await axios.post('/User/AssignRoles', {
      userId: currentUser.value.id,
      roleIds: selectedRoles.value
    })
    ElMessage.success('角色分配成功')
    roleDialogVisible.value = false
  } catch (error) {
    ElMessage.error('角色分配失败')
  } finally {
    loading.value = false
  }
}

// 提交用户表单
const submitUser = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (userForm.value.id) {
          await axios.put('/User/UpdateUser', userForm.value)
          ElMessage.success('更新成功')
        } else {
          await axios.post('/User/AddUser', userForm.value)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        getUserList()
      } catch (error) {
        ElMessage.error(userForm.value.id ? '更新失败' : '添加失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

onMounted(() => {
  getUserList()
  getRoleList()
})
</script>

<style scoped>
.user-list-container {
  padding: 20px;
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

:deep(.el-transfer) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
