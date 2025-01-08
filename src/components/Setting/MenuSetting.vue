<template>
  <div class="menu-setting-container">
    <!-- 角色管理工具栏和分页 -->
    <div class="toolbar">
      <div class="left">
        <el-button type="primary" @click="handleAdd">{{ t('role.addRole') }}</el-button>
        <el-input
          v-model="searchKeyword"
          :placeholder="t('role.searchPlaceholder')"
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
          :pager-count="5"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 角色列表 -->
    <el-table :data="roleList" border style="width: 100%; margin-top: -10px" :height="tableHeight" :header-cell-style="{ position: 'sticky', top: '0',  zIndex: 1 }">
       <el-table-column prop="roleCode" :label="t('role.roleCode')" align="center" width="130" />
      <el-table-column prop="roleName" :label="t('role.roleName')"  width="150"/>
      <el-table-column prop="roleDepicted" :label="t('role.roleDesc')" header-align="center" align="left" />
      <el-table-column prop="isTrue" :label="t('role.status')" align="center" width="100" />
      <el-table-column prop="addUser" :label="t('role.creator')" align="center" width="100" />
      <el-table-column prop="addTimeString" :label="t('role.createTime')" align="center" width="180" />
      <el-table-column :label="t('common.operations')" width="250" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">{{ t('common.edit') }}</el-button>
          <el-button type="success" size="small" @click="handlePermission(scope.row)">{{ t('role.permission') }}</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">{{ t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="roleForm" :rules="rules" ref="roleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDepicted">
          <el-input type="textarea" v-model="roleForm.roleDepicted" placeholder="请输入角色描述"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRole" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限设置对话框 -->
    <el-dialog
      title="权限设置"
      v-model="permissionDialogVisible"
      width="600px"
    >
      <el-tree
        ref="menuTree"
        :data="menuList"
        show-checkbox
        node-key="id"
        :props="{
          label: 'name',
          children: 'children'
        }"
        @check="handleMenuCheck"
      />
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMenuPermissions" :loading="loading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue'
import axios from '@/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useTableHeight,ChangeLanguage } from '@/Common'
const {t} = useI18n()

watch( () => {
  ChangeLanguage()
})

const { tableHeight } = useTableHeight()

// 数据定义
const roleList = ref([])
const menuList = ref([])
const searchKeyword = ref('')
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const loading = ref(false)
const menuTree = ref(null)
const currentRole = ref(null)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const roleForm = ref({
  roleName: '',
  roleDepicted: ''
})

const rules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
}

const roleFormRef = ref(null)

// 获取角色列表
const getRoleList = async () => {
  try {
    const response = await axios.get(`/Role/GetRoleData?RoleName=${searchKeyword.value}&PageIndex=${currentPage.value}&PageSize=${pageSize.value}`)
    roleList.value = response.data.response
    total.value = response.data.count
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  getRoleList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getRoleList()
}

// 获取菜单列表
const getMenuList = async () => {
  try {
    const response = await axios.get('/Menu/GetMenuList')
    menuList.value = response.data.response
  } catch (error) {
    ElMessage.error('获取菜单列表失败')
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  getRoleList()
}

// 新增角色
const handleAdd = () => {
  dialogTitle.value = '新增角色'
  roleForm.value = {
    roleName: '',
    roleDepicted: ''
  }
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (row) => {
  dialogTitle.value = '编辑角色'
  roleForm.value = { ...row }
  dialogVisible.value = true
}

// 删除角色
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await axios.delete(`/Role/DeleteRole/${row.id}`)
      ElMessage.success('删除成功')
      getRoleList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 打开权限设置
const handlePermission = async (row) => {
  currentRole.value = row
  permissionDialogVisible.value = true
  try {
    const response = await axios.get(`/Menu/GetRoleMenus?roleId=${row.id}`)
    const roleMenuIds = response.data.response.map(menu => menu.id)
    menuTree.value.setCheckedKeys(roleMenuIds)
  } catch (error) {
    ElMessage.error('获取角色菜单权限失败')
  }
}

// 提交角色表单
const submitRole = async () => {
  if (!roleFormRef.value) return
  
  await roleFormRef.value.validate(async (valid) => {
    if (valid) {
      var message = '';
      submitLoading.value = true
      try {
        if (roleForm.value.id) {
          const response = await axios.get(`/Role/EditRole?Id=${roleForm.value.id}&RoleName=${roleForm.value.roleName}&RoleDepicted=${roleForm.value.roleDepicted}`)
          if(response.data.start == 200) {
            message = response.data.response
          } else {
            message = response.data.message
            throw new Error(message)
          }
        } else {
          const response = await axios.get(`/Role/AddRole?RoleName=${roleForm.value.roleName}&RoleDepicted=${roleForm.value.roleDepicted}`)
          if(response.data.start == 200) {
            message = response.data.response
          } else {
            message = response.data.message
            throw new Error(message)
          }
        }
        ElMessage.success(message)
        dialogVisible.value = false
        getRoleList()
      } catch (error) {
        ElMessage.error(message)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 保存菜单权限
const saveMenuPermissions = async () => {
  if (!currentRole.value) return

  const checkedKeys = menuTree.value.getCheckedKeys()
  const halfCheckedKeys = menuTree.value.getHalfCheckedKeys()
  const allSelectedKeys = [...checkedKeys, ...halfCheckedKeys]

  loading.value = true
  try {
    await axios.post('/Menu/SaveRoleMenus', {
      roleId: currentRole.value.id,
      menuIds: allSelectedKeys
    })
    ElMessage.success(t('common.success'))
    permissionDialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

// 菜单选择改变时的处理
const handleMenuCheck = (data, checked) => {
  console.log('选中的菜单:', data, checked)
}

onMounted(() => {
  getRoleList()
  getMenuList()
})
</script>

<style scoped>
.menu-setting-container {
  padding: 0px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.toolbar .left {
  display: flex;
  align-items: center;
}

.toolbar .right {
  margin-left: auto;
}

.el-dialog :deep(.el-tree) {
  margin: 0 20px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
