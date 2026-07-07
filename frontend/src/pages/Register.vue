<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">手机号</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="请输入手机号"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">密码</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-2">昵称</label>
          <input
            v-model="form.nickname"
            type="text"
            placeholder="请输入昵称"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400 transition-colors"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>
        <p class="mt-4 text-center text-gray-600">
          已有账号？<router-link to="/login" class="text-green-600 hover:underline">立即登录</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register, type RegisterData } from '../api/auth'

const router = useRouter()
const loading = ref(false)
const form = ref<RegisterData>({
  phone: '',
  password: '',
  nickname: ''
})

async function handleRegister() {
  if (!form.value.phone || !form.value.password) {
    alert('请填写手机号和密码')
    return
  }

  loading.value = true
  try {
    await register(form.value)
    alert('注册成功，请登录')
    router.push('/login')
  } catch (error: any) {
    alert(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>
