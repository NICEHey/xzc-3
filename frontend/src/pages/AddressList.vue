<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-green-600 hover:text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </router-link>
            <h1 class="text-xl font-bold text-gray-800">地址管理</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ userInfo?.nickname }}</span>
            <button @click="handleLogout" class="px-3 py-1 text-sm text-red-600 hover:text-red-700">退出</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4 py-6">
      <button
        @click="showAddForm = true"
        class="w-full mb-4 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>添加新地址</span>
      </button>

      <div v-if="addresses.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p class="text-gray-500">暂无收货地址</p>
        <button
          @click="showAddForm = true"
          class="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          添加地址
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="address in addresses"
          :key="address.id"
          class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <span class="font-medium text-gray-800">{{ address.name }}</span>
                <span class="text-gray-500">{{ address.phone }}</span>
                <span
                  v-if="address.isDefault"
                  class="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full"
                >
                  默认地址
                </span>
              </div>
              <p class="text-gray-600">
                {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
              </p>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <button
                v-if="!address.isDefault"
                @click="handleSetDefault(address.id)"
                class="px-3 py-1 text-sm border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
              >
                设为默认
              </button>
              <button
                v-else
                class="px-3 py-1 text-sm bg-green-600 text-white rounded cursor-default"
              >
                默认地址
              </button>
              <button
                @click="handleEdit(address)"
                class="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
              >
                编辑
              </button>
              <button
                @click="handleDelete(address.id)"
                class="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showAddForm || editingAddress"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeForm"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="flex items-center justify-between p-4 border-b">
            <h2 class="text-lg font-bold text-gray-800">{{ editingAddress ? '编辑地址' : '添加地址' }}</h2>
            <button
              @click="closeForm"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">收货人</label>
              <input
                v-model="formData.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="请输入收货人姓名"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <input
                v-model="formData.phone"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="请输入手机号"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">省市区</label>
              <div class="flex space-x-2">
                <input
                  v-model="formData.province"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="省"
                />
                <input
                  v-model="formData.city"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="市"
                />
                <input
                  v-model="formData.district"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="区"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
              <textarea
                v-model="formData.detail"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="请输入详细地址"
              ></textarea>
            </div>

            <div class="flex items-center">
              <input
                v-model="formData.isDefault"
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label class="ml-2 text-sm text-gray-700">设为默认地址</label>
            </div>
          </div>

          <div class="flex items-center justify-end space-x-3 p-4 border-t">
            <button
              @click="closeForm"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              取消
            </button>
            <button
              @click="handleSubmit"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {{ editingAddress ? '保存修改' : '添加地址' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, type Address } from '../api/addresses'

const router = useRouter()
const addresses = ref<Address[]>([])
const showAddForm = ref(false)
const editingAddress = ref<Address | null>(null)

const formData = reactive({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const userInfo = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
})

async function loadAddresses() {
  try {
    addresses.value = await getAddresses()
  } catch (error) {
    console.error('加载地址失败:', error)
  }
}

function closeForm() {
  showAddForm.value = false
  editingAddress.value = null
  formData.name = ''
  formData.phone = ''
  formData.province = ''
  formData.city = ''
  formData.district = ''
  formData.detail = ''
  formData.isDefault = false
}

function handleEdit(address: Address) {
  editingAddress.value = address
  formData.name = address.name
  formData.phone = address.phone
  formData.province = address.province
  formData.city = address.city
  formData.district = address.district
  formData.detail = address.detail
  formData.isDefault = address.isDefault
}

async function handleSubmit() {
  try {
    if (!formData.name || !formData.phone || !formData.province || !formData.city || !formData.district || !formData.detail) {
      alert('请填写完整地址信息')
      return
    }

    if (editingAddress.value) {
      await updateAddress(editingAddress.value.id, {
        name: formData.name,
        phone: formData.phone,
        province: formData.province,
        city: formData.city,
        district: formData.district,
        detail: formData.detail,
        isDefault: formData.isDefault
      })
      alert('地址更新成功')
    } else {
      await addAddress({
        name: formData.name,
        phone: formData.phone,
        province: formData.province,
        city: formData.city,
        district: formData.district,
        detail: formData.detail,
        isDefault: formData.isDefault
      })
      alert('地址添加成功')
    }

    closeForm()
    await loadAddresses()
  } catch (error: any) {
    alert(error.message || '操作失败')
  }
}

async function handleSetDefault(addressId: number) {
  try {
    await setDefaultAddress(addressId)
    alert('默认地址设置成功')
    await loadAddresses()
  } catch (error: any) {
    alert(error.message || '设置失败')
  }
}

async function handleDelete(addressId: number) {
  if (!confirm('确定要删除这个地址吗？')) return
  
  try {
    await deleteAddress(addressId)
    alert('地址删除成功')
    await loadAddresses()
  } catch (error: any) {
    alert(error.message || '删除失败')
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}

onMounted(() => {
  loadAddresses()
})
</script>