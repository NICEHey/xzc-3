<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <router-link to="/" class="text-2xl font-bold text-green-600">新鲜到家</router-link>
          
          <div class="flex items-center space-x-4">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索商品..."
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
              @keyup.enter="handleSearch"
            />
            
            <div v-if="isLoggedIn" class="relative">
              <router-link to="/cart" class="flex items-center text-gray-700 hover:text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ cartCount }}
                </span>
              </router-link>
            </div>
            
            <div class="flex items-center space-x-2">
              <template v-if="isLoggedIn">
                <span class="text-gray-600">{{ userInfo?.nickname }}</span>
                <button @click="handleLogout" class="px-3 py-1 text-sm text-red-600 hover:text-red-700">退出</button>
              </template>
              <template v-else>
                <router-link to="/login" class="px-3 py-1 text-sm text-gray-600 hover:text-green-600">登录</router-link>
                <router-link to="/register" class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">注册</router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex space-x-6">
        <div class="w-48 flex-shrink-0">
          <div class="bg-white rounded-lg shadow p-4">
            <h3 class="font-bold text-gray-800 mb-4">商品分类</h3>
            <ul class="space-y-2">
              <li>
                <button
                  @click="selectedCategory = undefined"
                  :class="['w-full text-left px-3 py-2 rounded', selectedCategory === undefined ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100']"
                >
                  全部商品
                </button>
              </li>
              <li v-for="cat in categories" :key="cat.id">
                <button
                  @click="selectedCategory = cat.id"
                  :class="['w-full text-left px-3 py-2 rounded', selectedCategory === cat.id ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100']"
                >
                  {{ cat.icon }} {{ cat.name }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex-1">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="product in products"
              :key="product.id"
              class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              @click="goToProduct(product.id)"
            >
              <div class="h-40 bg-gray-100 flex items-center justify-center">
                <img
                  v-if="product.image"
                  :src="`http://localhost:3000${product.image}`"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="p-4">
                <h4 class="font-medium text-gray-800 truncate">{{ product.name }}</h4>
                <p class="text-sm text-gray-500 mb-2">{{ product.category?.name }}</p>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-red-500 font-bold text-lg">¥{{ product.salePrice }}</span>
                    <span class="text-gray-400 text-sm line-through ml-2">¥{{ product.originalPrice }}</span>
                  </div>
                  <button
                    @click.stop="handleAddToCart(product.id)"
                    class="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    :disabled="!isLoggedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProducts, getCategories, type Product, type Category } from '../api/products'
import { addCartItem, getCartCount, type CartCountResult } from '../api/cart'

const router = useRouter()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const selectedCategory = ref<number | undefined>(undefined)
const searchKeyword = ref('')
const loading = ref(false)

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const userInfo = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
})

const cartCount = ref(0)

async function loadProducts() {
  loading.value = true
  try {
    const result = await getProducts({
      page: 1,
      pageSize: 100,
      categoryId: selectedCategory.value,
      keyword: searchKeyword.value || undefined
    })
    products.value = result.products
  } catch (error) {
    console.error('加载商品失败:', error)
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    categories.value = await getCategories()
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

async function loadCartCount(): Promise<void> {
  if (!isLoggedIn.value) return
  try {
    const result: CartCountResult = await getCartCount()
    cartCount.value = result.count
  } catch (error) {
    console.error('加载购物车数量失败:', error)
  }
}

function handleSearch() {
  loadProducts()
}

function goToProduct(id: number) {
  router.push(`/product/${id}`)
}

async function handleAddToCart(productId: number) {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }

  try {
    await addCartItem({ productId, quantity: 1 })
    await loadCartCount()
    alert('添加成功')
  } catch (error: any) {
    alert(error.message || '添加失败')
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  cartCount.value = 0
  router.push('/')
}

onMounted(() => {
  loadProducts()
  loadCategories()
  loadCartCount()
})
</script>
