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
            
            <router-link to="/addresses" class="px-3 py-1 text-sm text-gray-600 hover:text-green-600">地址管理</router-link>
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
                <div class="flex items-center justify-between">
                  <h4 class="font-medium text-gray-800">{{ item.product.name }}</h4>
                  <span v-if="item.product.stock === 0" class="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">已售罄</span>
                </div>
                <p class="text-sm text-gray-500">{{ item.product.category?.name }} · {{ item.product.unit }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-gray-500 text-sm">库存：</span>
                  <span :class="item.product.stock <= 5 ? 'text-red-500' : 'text-green-600'" class="text-sm font-medium">{{ item.product.stock }} {{ item.product.unit }}</span>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-red-500 font-bold">¥{{ item.product.salePrice }}</span>
                  
                  <div class="flex items-center space-x-2">
                    <button
                      @click="handleUpdateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.product.stock === 0"
                      class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="w-12 text-center">{{ item.quantity }}</span>
                    <button
                      @click="handleUpdateQuantity(item.id, item.quantity + 1)"
                      :disabled="item.product.stock === 0 || item.quantity >= item.product.stock"
                      class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <button
                @click="handleClearCart"
                class="text-gray-500 hover:text-red-500 transition-colors"
              >
                清空购物车
              </button>
              <span class="text-gray-600">共 {{ totalCount }} 件商品</span>
            </div>
          </div>

          <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center justify-between mb-3">
              <span class="text-gray-700 font-medium">收货地址</span>
              <router-link to="/addresses" class="text-sm text-green-600 hover:underline">管理地址</router-link>
            </div>
            
            <div v-if="addresses.length === 0" class="text-gray-500">
              <p>暂无收货地址，请先添加</p>
              <router-link to="/addresses" class="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                添加地址
              </router-link>
            </div>
            
            <div v-else class="space-y-2">
              <div
                v-for="address in addresses"
                :key="address.id"
                @click="selectedAddressId = address.id"
                :class="[
                  'p-3 rounded-lg border cursor-pointer transition-colors',
                  selectedAddressId === address.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                ]"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-1">
                      <span class="font-medium text-gray-800">{{ address.name }}</span>
                      <span class="text-gray-500">{{ address.phone }}</span>
                      <span
                        v-if="address.isDefault"
                        class="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full"
                      >
                        默认
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
                    </p>
                  </div>
                  <div
                    :class="[
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      selectedAddressId === address.id 
                        ? 'border-green-500' 
                        : 'border-gray-300'
                    ]"
                  >
                    <div
                      v-if="selectedAddressId === address.id"
                      class="w-3 h-3 bg-green-500 rounded-full"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="userInfo" class="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">当前积分：</span>
              <span class="text-orange-600 font-bold">{{ userInfo.points }}</span>
            </div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-gray-600">可抵扣金额：</span>
              <span class="text-green-600 font-bold">¥{{ maxDiscountAmount.toFixed(2) }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-gray-600">使用积分抵扣：</span>
              <input
                v-model.number="pointUsed"
                type="number"
                :min="0"
                :max="maxPointsToUse"
                :disabled="!canUsePoints"
                class="w-24 px-3 py-1 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-400"
                placeholder="输入积分"
              />
              <span class="text-gray-400 text-sm">最多{{ maxPointsToUse }}积分</span>
              <span v-if="!canUsePoints" class="text-red-500 text-sm">积分不足</span>
            </div>
            <div v-if="pointUsed > 0" class="mt-2 text-gray-600">
              将抵扣：¥{{ pointsDiscount.toFixed(2) }}
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="text-gray-600">商品总额：</span>
                <span class="text-gray-800">¥{{ totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-600">等级折扣：</span>
                <span class="text-green-600">-¥{{ discountAmount.toFixed(2) }}</span>
              </div>
              <div v-if="pointsDiscount > 0" class="flex items-center space-x-2">
                <span class="text-gray-600">积分抵扣：</span>
                <span class="text-orange-600">-¥{{ pointsDiscount.toFixed(2) }}</span>
              </div>
              <div class="flex items-center space-x-2 pt-1 border-t border-gray-100">
                <span class="text-gray-600">实付金额：</span>
                <span class="text-red-500 font-bold text-xl">¥{{ payAmount.toFixed(2) }}</span>
              </div>
            </div>
            <button
              @click="handleCheckout"
              :disabled="hasSoldOutItems"
              class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ hasSoldOutItems ? '存在已售罄商品' : '结算' }}
            </button>
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
const pointUsed = ref(0)
const addresses = ref<Address[]>([])
const selectedAddressId = ref<number | null>(null)

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

const maxPointsToUse = computed(() => {
  return Math.floor(totalPrice.value * 0.1 * 100)
})

const maxDiscountAmount = computed(() => {
  return Math.min(userInfo.value?.points || 0, maxPointsToUse.value) * 0.01
})

const canUsePoints = computed(() => {
  return (userInfo.value?.points || 0) > 0 && maxPointsToUse.value > 0
})

const discountAmount = computed(() => {
  return userInfo.value?.level === 'VIP' ? totalPrice.value * 0.05 : 0
})

const pointsDiscount = computed(() => {
  const points = Math.min(pointUsed.value, maxPointsToUse.value, userInfo.value?.points || 0)
  return points * 0.01
})

const payAmount = computed(() => {
  return Math.max(0, totalPrice.value - discountAmount.value - pointsDiscount.value)
})

const hasSoldOutItems = computed(() => {
  return cartItems.value.some(item => item.product.stock === 0)
})

async function loadCart() {
  try {
    cartItems.value = await getCart()
  } catch (error) {
    console.error('加载购物车失败:', error)
  }
}

async function loadAddresses() {
  try {
    addresses.value = await getAddresses()
    const defaultAddr = addresses.value.find(a => a.isDefault)
    if (defaultAddr) {
      selectedAddressId.value = defaultAddr.id
    } else if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id
    }
  } catch (error) {
    console.error('加载地址失败:', error)
  }
}

async function handleUpdateQuantity(id: number, quantity: number) {
  if (quantity < 1) {
    await handleDeleteItem(id)
    return
  }

  const item = cartItems.value.find(i => i.id === id)
  if (item && quantity > item.product.stock) {
    alert(`库存不足，最多购买 ${item.product.stock} 件`)
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
    if (!selectedAddressId.value) {
      alert('请先添加收货地址')
      router.push('/addresses')
      return
    }

    await createOrder({
      addressId: selectedAddressId.value,
      useCart: true,
      pointUsed: pointUsed.value || undefined
    })

    alert('下单成功')
    pointUsed.value = 0
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
  loadAddresses()
})
</script>
