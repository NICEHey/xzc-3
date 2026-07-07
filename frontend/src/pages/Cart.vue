<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <router-link to="/" class="text-2xl font-bold text-green-600">新鲜到家</router-link>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
              <router-link to="/cart" class="flex items-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span v-if="cartItems.length > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ totalCount }}
                </span>
              </router-link>
            </div>
            
            <span class="text-gray-600">{{ userInfo?.nickname }}</span>
            <button @click="handleLogout" class="px-3 py-1 text-sm text-red-600 hover:text-red-700">退出</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4 py-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">购物车</h2>
      
      <div v-if="cartItems.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-500">购物车是空的</p>
        <router-link to="/" class="inline-block mt-4 text-green-600 hover:underline">去逛逛</router-link>
      </div>

      <div v-else>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="divide-y divide-gray-100">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex items-center p-4 hover:bg-gray-50"
            >
              <div class="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  v-if="item.product.image"
                  :src="`http://localhost:3000${item.product.image}`"
                  :alt="item.product.name"
                  class="w-full h-full object-cover"
                />
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div class="flex-1 ml-4">
                <h4 class="font-medium text-gray-800">{{ item.product.name }}</h4>
                <p class="text-sm text-gray-500">{{ item.product.category?.name }} · {{ item.product.unit }}</p>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-red-500 font-bold">¥{{ item.product.salePrice }}</span>
                  
                  <div class="flex items-center space-x-2">
                    <button
                      @click="handleUpdateQuantity(item.id, item.quantity - 1)"
                      class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="w-12 text-center">{{ item.quantity }}</span>
                    <button
                      @click="handleUpdateQuantity(item.id, item.quantity + 1)"
                      class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <button
                @click="handleDeleteItem(item.id)"
                class="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-4 bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button
                @click="handleClearCart"
                class="text-gray-500 hover:text-red-500 transition-colors"
              >
                清空购物车
              </button>
              <span class="text-gray-600">共 {{ totalCount }} 件商品</span>
            </div>
            <div class="flex items-center space-x-4">
              <div>
                <span class="text-gray-600">合计：</span>
                <span class="text-red-500 font-bold text-xl">¥{{ totalPrice.toFixed(2) }}</span>
              </div>
              <button
                @click="handleCheckout"
                class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                结算
              </button>
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
import { getCart, updateCartItem, deleteCartItem, clearCart, type CartItem } from '../api/cart'
import { createOrder } from '../api/orders'
import { getAddresses, type Address } from '../api/addresses'

const router = useRouter()
const cartItems = ref<CartItem[]>([])

const userInfo = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
})

const totalCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = userInfo.value?.level === 'VIP' ? item.product.vipPrice : item.product.salePrice
    return sum + price * item.quantity
  }, 0)
})

async function loadCart() {
  try {
    cartItems.value = await getCart()
  } catch (error) {
    console.error('加载购物车失败:', error)
  }
}

async function handleUpdateQuantity(id: number, quantity: number) {
  if (quantity < 1) {
    await handleDeleteItem(id)
    return
  }

  try {
    await updateCartItem(id, { quantity })
    await loadCart()
  } catch (error: any) {
    alert(error.message || '更新失败')
  }
}

async function handleDeleteItem(id: number) {
  try {
    await deleteCartItem(id)
    await loadCart()
  } catch (error: any) {
    alert(error.message || '删除失败')
  }
}

async function handleClearCart() {
  if (!confirm('确定要清空购物车吗？')) return
  
  try {
    await clearCart()
    await loadCart()
  } catch (error: any) {
    alert(error.message || '清空失败')
  }
}

async function handleCheckout() {
  try {
    const addresses: Address[] = await getAddresses()
    const defaultAddress = addresses.find((a: Address) => a.isDefault) || addresses[0]
    
    if (!defaultAddress) {
      alert('请先添加收货地址')
      return
    }

    await createOrder({
      addressId: defaultAddress.id,
      useCart: true
    })

    alert('下单成功')
    await loadCart()
  } catch (error: any) {
    alert(error.message || '下单失败')
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}

onMounted(() => {
  loadCart()
})
</script>
