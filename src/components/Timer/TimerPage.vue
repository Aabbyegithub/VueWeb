<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="date" label="Date" width="120" />
      <el-table-column prop="name" label="Name" width="120" />
      <el-table-column prop="address" label="Address" width="600" />
      <el-table-column fixed="right" label="Operations" width="150">
        <template #default="scope">
          <el-button size="mini" @click="editRow(scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="deleteRow(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px">
      <el-button type="primary" @click="showAddDialog">Add Row</el-button>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="currentRow">
        <el-form-item label="Date" prop="date">
          <el-input v-model="currentRow.date"></el-input>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="currentRow.name"></el-input>
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input v-model="currentRow.address"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveRow">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentRow = ref({ date: '', name: '', address: '' })

const fetchData = async () => {
  try {
    const response = await axios.get('/api/data')
    tableData.value = response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const showAddDialog = () => {
  currentRow.value = { date: '', name: '', address: '' }
  dialogTitle.value = 'Add Row'
  dialogVisible.value = true
}

const editRow = row => {
  currentRow.value = { ...row }
  dialogTitle.value = 'Edit Row'
  dialogVisible.value = true
}

const deleteRow = async row => {
  try {
    await axios.delete(`/api/data/${row.id}`)
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
    }
  } catch (error) {
    console.error('Error deleting row:', error)
  }
}

const saveRow = async () => {
  try {
    if (dialogTitle.value === 'Add Row') {
      const response = await axios.post('/api/data', currentRow.value)
      tableData.value.push(response.data)
    } else {
      await axios.put(`/api/data/${currentRow.value.id}`, currentRow.value)
      const index = tableData.value.findIndex(item => item.id === currentRow.value.id)
      if (index !== -1) {
        tableData.value[index] = { ...currentRow.value }
      }
    }
    dialogVisible.value = false
  } catch (error) {
    console.error('Error saving row:', error)
  }
}

fetchData()
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
