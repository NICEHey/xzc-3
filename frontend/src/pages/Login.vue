<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">用户登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">手机号</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="请输入手机号"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-2">密码</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400 transition-colors"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <p class="mt-4 text-center text-gray-600">
          还没有账号？<router-link to="/register" class="text-green-600 hover:underline">立即注册</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, type LoginData, type LoginResult } from '../api/auth'

const router = useRouter()
const loading = ref(false)
const form = ref<LoginData>({
  phone: '',
  password: ''
})

async function handleLogin() {
  if (!form.value.phone || !form.value.password) {
    alert('请填写完整信息')
    return
  }

  loading.value = true
  try {
    const result: LoginResult = await login(form.value)
    localStorage.setItem('token', result.token)
    localStorage.setItem('user', JSON.stringify(result.user))
    alert('登录成功')
    router.push('/')
  } catch (error: any) {
    alert(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>
