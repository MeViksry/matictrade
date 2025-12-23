<!-- frontend/pages/dashboard/trading.vue -->
<template>
  <div class="min-h-screen bg-dark-900 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">Trading Dashboard</h1>
        <p class="text-gray-400">Monitor and execute trades across exchanges</p>
      </div>

      <!-- API Key Status Alert -->
      <div v-if="!exchangeStore.hasValidApiKey" class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div>
            <p class="text-red-500 font-medium">No Valid API Key Found</p>
            <p class="text-red-400 text-sm mt-1">
              Please add and validate an API key in the 
              <NuxtLink to="/dashboard/api-keys" class="underline hover:no-underline">API Keys</NuxtLink> 
              section to start trading.
            </p>
          </div>
        </div>
      </div>

      <!-- Bot Status & Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <!-- Bot Status Card -->
        <div class="bg-dark-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-white">Trading Bot</h3>
              <p class="text-sm text-gray-400">
                {{ botStatus.isRunning ? 'Running' : 'Stopped' }}
              </p>
            </div>
            <button
              @click="toggleBot"
              :disabled="!exchangeStore.hasValidApiKey || botStore.isLoading"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                botStatus.isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white',
                (!exchangeStore.hasValidApiKey || botStore.isLoading) && 'opacity-50 cursor-not-allowed'
              ]"
            >
              {{ botStore.isLoading ? '...' : botStatus.isRunning ? 'Stop Bot' : 'Start Bot' }}
            </button>
          </div>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">API Key:</span>
              <span :class="exchangeStore.hasValidApiKey ? 'text-green-500' : 'text-red-500'">
                {{ exchangeStore.hasValidApiKey ? 'Valid' : 'Invalid' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Active Exchange:</span>
              <span class="text-white capitalize">
                {{ activeExchange || 'None' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Open Positions:</span>
              <span class="text-white">{{ botStatus.openPositions }}</span>
            </div>
          </div>
        </div>

        <!-- Balance Card -->
        <div class="bg-dark-800 rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold text-white mb-2">Account Balance</h3>
          <div v-if="balance && exchangeStore.hasValidApiKey" class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-400">Total:</span>
              <span class="text-green-500 font-medium">${{ balance.totalBalance?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Available:</span>
              <span class="text-blue-500 font-medium">${{ balance.availableBalance?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Unrealized P&L:</span>
              <span :class="(balance.unrealizedPnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'">
                ${{ (balance.unrealizedPnl || 0).toFixed(2) }}
              </span>
            </div>
          </div>
          <div v-else class="text-gray-400 text-sm">
            {{ exchangeStore.hasValidApiKey ? 'Loading...' : 'Add API key to view balance' }}
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="bg-dark-800 rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold text-white mb-3">Quick Actions</h3>
          <div class="space-y-2">
            <NuxtLink 
              to="/dashboard/api-keys"
              class="w-full flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
              Manage API Keys
            </NuxtLink>
            <button
              @click="refreshAllData"
              :disabled="isRefreshing"
              class="w-full flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ isRefreshing ? 'Refreshing...' : 'Refresh Data' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Positions & Orders Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6">
        <!-- Positions -->
        <div class="bg-dark-800 rounded-lg shadow">
            <div class="p-4 border-b border-dark-700 flex justify-between items-center">
              <h3 class="text-lg font-semibold text-white">Open Positions</h3>
              <span class="text-sm text-gray-400">{{ positions.length }}</span>
            </div>
            <div class="p-4">
              <div v-if="positions.length === 0" class="text-center text-gray-400 py-8">
                No open positions
              </div>
              <div v-else class="space-y-3 max-h-96 overflow-y-auto">
                <div 
                  v-for="position in positions" 
                  :key="position.id"
                  class="p-3 border border-dark-700 rounded-lg"
                >
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-medium text-white">{{ position.symbol }}</span>
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      position.side === 'LONG' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                    ]">
                      {{ position.side }}
                    </span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span class="text-gray-400">Size:</span>
                      <span class="text-white ml-1">{{ position.size }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">Entry:</span>
                      <span class="text-white ml-1">${{ position.entryPrice?.toFixed(2) }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">P&L:</span>
                      <span :class="[
                        'ml-1 font-medium',
                        (position.unrealizedPnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                      ]">
                        ${{ (position.unrealizedPnl || 0).toFixed(2) }}
                      </span>
                    </div>
                    <div>
                      <span class="text-gray-400">Leverage:</span>
                      <span class="text-white ml-1">{{ position.leverage }}x</span>
                    </div>
                  </div>
                  <button
                    @click="closePosition(position.symbol)"
                    :disabled="!exchangeStore.hasValidApiKey"
                    class="w-full mt-2 py-1 px-3 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors disabled:opacity-50"
                  >
                    Close Position
                  </button>
                </div>
              </div>
            </div>
          </div>

        <!-- Open Orders -->
        <div class="bg-dark-800 rounded-lg shadow">
          <div class="p-4 border-b border-dark-700 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white">Open Orders</h3>
            <span class="text-sm text-gray-400">{{ orders.length }}</span>
          </div>
          <div class="p-4">
            <div v-if="orders.length === 0" class="text-center text-gray-400 py-8">
              No open orders
            </div>
            <div v-else class="space-y-3 max-h-96 overflow-y-auto">
              <div 
                v-for="order in orders" 
                :key="order.id"
                class="p-3 border border-dark-700 rounded-lg"
              >
                <div class="flex justify-between items-start mb-2">
                  <span class="font-medium text-white">{{ order.symbol }}</span>
                  <span :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    order.side === 'BUY' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                  ]">
                    {{ order.side }} {{ order.type }}
                  </span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span class="text-gray-400">Qty:</span>
                    <span class="text-white ml-1">{{ order.quantity }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Price:</span>
                    <span class="text-white ml-1" v-if="order.price">
                      ${{ order.price.toFixed(2) }}
                    </span>
                    <span v-else class="text-gray-400">Market</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Filled:</span>
                    <span class="text-white ml-1">{{ order.filledQuantity || 0 }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Leverage:</span>
                    <span class="text-white ml-1">{{ order.leverage }}x</span>
                  </div>
                </div>
                <button
                  @click="cancelOrder(order.id)"
                  :disabled="!exchangeStore.hasValidApiKey"
                  class="w-full mt-2 py-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors disabled:opacity-50"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Position, Order } from '~/types'

// Stores
const exchangeStore = useExchangeStore()
const botStore = useBotStore()

// Composables
const { post, get } = useApi()
const toast = useCustomToast()

// Reactive data
const balance = ref<any>(null)
const positions = ref<Position[]>([])
const orders = ref<Order[]>([])
const botStatus = ref({
  isRunning: false,
  hasValidApiKey: false,
  openPositions: 0
})
const isRefreshing = ref(false)

// Computed
const activeExchange = computed(() => {
  const activeKey = exchangeStore.activeApiKey
  return activeKey ? activeKey.exchange : null
})

// Methods
const fetchTradingData = async () => {
  if (!exchangeStore.hasValidApiKey) return

  try {
    const [balanceRes, positionsRes, ordersRes, statusRes] = await Promise.all([
      get('/api/exchange/balance'),
      get('/api/exchange/positions'),
      get('/api/exchange/orders'),
      get('/api/bot/status')
    ])

    if (balanceRes.success) balance.value = balanceRes.data
    if (positionsRes.success) positions.value = (positionsRes.data as Position[]) || []
    if (ordersRes.success) orders.value = (ordersRes.data as Order[]) || []
    if (statusRes.success && statusRes.data) {
      botStatus.value = statusRes.data as { isRunning: boolean; hasValidApiKey: boolean; openPositions: number }
    }
  } catch (error) {
    console.error('Failed to fetch trading data:', error)
  }
}

const refreshAllData = async () => {
  isRefreshing.value = true
  try {
    await Promise.all([
      exchangeStore.fetchApiKeys(),
      fetchTradingData()
    ])
    toast.success('Success', 'Data refreshed successfully')
  } catch (error) {
    console.error('Failed to refresh data:', error)
  } finally {
    isRefreshing.value = false
  }
}

const cancelOrder = async (orderId: string) => {
  try {
    const response = await post(`/api/exchange/order/${orderId}/cancel`)
    if (response.success) {
      toast.success('Success', 'Order cancelled successfully')
      await fetchTradingData()
    } else {
      toast.error('Error', response.message || 'Failed to cancel order')
    }
  } catch (error: any) {
    toast.error('Error', error.message || 'Failed to cancel order')
  }
}

const closePosition = async (symbol: string) => {
  try {
    const response = await post('/api/exchange/close-position', { symbol })
    if (response.success) {
      toast.success('Success', 'Position closed successfully')
      await fetchTradingData()
    } else {
      toast.error('Error', response.message || 'Failed to close position')
    }
  } catch (error: any) {
    toast.error('Error', error.message || 'Failed to close position')
  }
}

const toggleBot = async () => {
  try {
    const enabled = !botStatus.value.isRunning
    const response = await botStore.toggleBot(enabled)
    if (response?.success) {
      toast.success('Success', `Bot ${enabled ? 'started' : 'stopped'} successfully`)
      await fetchTradingData()
    } else {
      toast.error('Error', `Failed to ${enabled ? 'start' : 'stop'} bot`)
    }
  } catch (error: any) {
    toast.error('Error', error.message || 'Failed to toggle bot')
  }
}

// Lifecycle
onMounted(async () => {
  await exchangeStore.fetchApiKeys()
  await fetchTradingData()
})

// Watch for API key changes
watch(() => exchangeStore.hasValidApiKey, (hasValid) => {
  if (hasValid) {
    fetchTradingData()
  } else {
    // Clear data when no valid API key
    balance.value = null
    positions.value = []
    orders.value = []
  }
})

// Auto-refresh data every 30 seconds when has valid API key
const { pause, resume } = useIntervalFn(() => {
  if (exchangeStore.hasValidApiKey) {
    fetchTradingData()
  }
}, 30000)

// Pause when tab is not visible
const visibility = useDocumentVisibility()
watch(visibility, (visible) => {
  if (visible === 'visible' && exchangeStore.hasValidApiKey) {
    resume()
    fetchTradingData()
  } else {
    pause()
  }
})
</script>