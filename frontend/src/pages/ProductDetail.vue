<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <router-link to="/" class="text-2xl font-bold text-green-600">新鲜到家</router-link>
          
          <div class="flex items-center space-x-4">
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

    <div v-if="product" class="max-w-4xl mx-auto px-4 py-6">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/2">
            <div class="h-80 bg-gray-100 flex items-center justify-center">
              <img
                v-if="product.image"
                :src="`http://localhost:3000${product.image}`"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div class="md:w-1/2 p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ product.name }}</h2>
            <p class="text-gray-500 mb-4">{{ product.category?.name }}</p>
            
            <div class="flex items-baseline space-x-4 mb-4">
              <span class="text-red-500 font-bold text-3xl">¥{{ currentPrice }}</span>
              <span class="text-gray-400 line-through">¥{{ product.originalPrice }}</span>
              <span v-if="userInfo?.level === 'VIP'" class="px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded">VIP会员价</span>
            </div>

            <p class="text-gray-600 mb-4">{{ product.description }}</p>

            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-600">库存：<span class="text-green-600 font-medium">{{ product.stock }}</span> {{ product.unit }}</span>
              <span class="text-gray-600">销量：热卖中</span>
            </div>

            <div class="flex items-center space-x-4 mb-6">
              <span class="text-gray-600">数量：</span>
              <div class="flex items-center space-x-2">
                <button
                  @click="quantity = Math.max(1, quantity - 1)"
                  class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="w-12 text-center font-medium">{{ quantity }}</span>
                <button
                  @click="quantity = Math.min(product.stock, quantity + 1)"
                  class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex space-x-4">
              <button
                @click="handleAddToCart"
                class="flex-1 py-3 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                加入购物车
              </button>
              <button
                @click="handleBuyNow"
                class="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                立即购买
              </button>
            </div>
          </div>
        </div>

        <div class="p-6 border-t">
          <h3 class="font-bold text-gray-800 mb-4">商品详情</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-600">{{ product.description || '暂无详细描述' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-4xl mx-auto px-4 py-6">
      <div class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-500">商品不存在或已下架</p>
        <router-link to="/" class="inline-block mt-4 text-green-600 hover:underline">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct, type Product } from '../api/products'
import { addCartItem, getCartCount, type CartCountResult } from '../api/cart'
import { createOrder } from '../api/orders'
import { getAddresses, type Address } from '../api/addresses'

const route = useRoute()
const router = useRouter()
const product = ref<Product | null>(null)
const quantity = ref(1)
const cartCount = ref(0)

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const userInfo = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
})

const currentPrice = computed(() => {
  if (!product.value) return 0
  return userInfo.value?.level === 'VIP' ? product.value.vipPrice : product.value.salePrice
})

async function loadProduct() {
  const id = parseInt(route.params.id as string)
  if (isNaN(id)) return
  
  try {
    product.value = await getProduct(id)
    quantity.value = 1
  } catch (error) {
    console.error('加载商品失败:', error)
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

async function handleAddToCart() {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }

  if (!product.value) return

  try {
    await addCartItem({ productId: product.value.id, quantity: quantity.value })
    await loadCartCount()
    alert('添加成功')
  } catch (error: any) {
    alert(error.message || '添加失败')
  }
}

async function handleBuyNow() {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }

  if (!product.value) return

  try {
    const addresses: Address[] = await getAddresses()
    const defaultAddress = addresses.find((a: Address) => a.isDefault) || addresses[0]
    
    if (!defaultAddress) {
      alert('请先添加收货地址')
      return
    }

    await createOrder({
      addressId: defaultAddress.id,
      items: [{ productId: product.value.id, quantity: quantity.value }]
    })

    alert('下单成功')
    router.push('/')
  } catch (error: any) {
    alert(error.message || '下单失败')
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  cartCount.value = 0
  router.push('/')
}

onMounted(() => {
  loadProduct()
  loadCartCount()
})
</script>
