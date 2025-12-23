<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">System Health</h1>
        <p class="text-gray-500 mt-1">Monitor system status and performance</p>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-500">Last updated: {{ lastUpdated }}</span>
        <button
          @click="refreshHealth"
          :disabled="isLoading"
          class="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl transition-colors flex items-center space-x-2"
        >
          <svg
            class="w-4 h-4"
            :class="{ 'animate-spin': isLoading }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Overall Status -->
    <div
      class="card p-6"
      :class="getOverallStatusClass()"
    >
      <div class="flex items-center space-x-4">
        <div
          class="w-16 h-16 rounded-2xl flex items-center justify-center"
          :class="getOverallStatusIconClass()"
        >
          <svg v-if="health?.status === 'healthy'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="health?.status === 'degraded'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">
            System {{ health?.status === 'healthy' ? 'Operational' : health?.status === 'degraded' ? 'Degraded' : 'Down' }}
          </h2>
          <p class="text-gray-500 mt-1">
            All core services are {{ health?.status === 'healthy' ? 'running smoothly' : 'experiencing issues' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Service Status Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Database -->
      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div
              class="w-3 h-3 rounded-full"
              :class="health?.services?.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <span class="font-medium text-white">Database</span>
          </div>
          <span
            class="text-xs px-2 py-1 rounded-full"
            :class="health?.services?.database === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
          >
            {{ health?.services?.database || 'Unknown' }}
          </span>
        </div>
        <p class="text-sm text-gray-500">PostgreSQL connection</p>
      </div>

      <!-- Redis -->
      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div
              class="w-3 h-3 rounded-full"
              :class="health?.services?.redis === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'"
            ></div>
            <span class="font-medium text-white">Redis</span>
          </div>
          <span
            class="text-xs px-2 py-1 rounded-full"
            :class="health?.services?.redis === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'"
          >
            {{ health?.services?.redis || 'N/A' }}
          </span>
        </div>
        <p class="text-sm text-gray-500">Cache service</p>
      </div>

      <!-- API -->
      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="font-medium text-white">API</span>
          </div>
          <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
            healthy
          </span>
        </div>
        <p class="text-sm text-gray-500">Backend services</p>
      </div>

      <!-- WebSocket -->
      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="font-medium text-white">WebSocket</span>
          </div>
          <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
            healthy
          </span>
        </div>
        <p class="text-sm text-gray-500">Real-time connections</p>
      </div>
    </div>

    <!-- System Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Memory Usage -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Memory Usage</h3>
        
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-500">Heap Used</span>
              <span class="text-sm font-medium text-white">
                {{ formatBytes(health?.memory?.heapUsed || 0) }}
              </span>
            </div>
            <div class="w-full bg-dark-700 rounded-full h-3">
              <div
                class="bg-blue-500 h-3 rounded-full"
                :style="{ width: getMemoryPercentage('heapUsed') + '%' }"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-500">Heap Total</span>
              <span class="text-sm font-medium text-white">
                {{ formatBytes(health?.memory?.heapTotal || 0) }}
              </span>
            </div>
            <div class="w-full bg-dark-700 rounded-full h-3">
              <div
                class="bg-purple-500 h-3 rounded-full"
                :style="{ width: getMemoryPercentage('heapTotal') + '%' }"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-500">External</span>
              <span class="text-sm font-medium text-white">
                {{ formatBytes(health?.memory?.external || 0) }}
              </span>
            </div>
            <div class="w-full bg-dark-700 rounded-full h-3">
              <div
                class="bg-green-500 h-3 rounded-full"
                :style="{ width: getMemoryPercentage('external') + '%' }"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-500">RSS</span>
              <span class="text-sm font-medium text-white">
                {{ formatBytes(health?.memory?.rss || 0) }}
              </span>
            </div>
            <div class="w-full bg-dark-700 rounded-full h-3">
              <div
                class="bg-orange-500 h-3 rounded-full"
                :style="{ width: getMemoryPercentage('rss') + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Info -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">System Information</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <!-- Left Column -->
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-dark-700">
              <span class="text-gray-500">Hostname</span>
              <span class="font-medium text-white">{{ health?.hostname || 'N/A' }}</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-dark-700">
              <span class="text-gray-500">OS</span>
              <span class="font-medium text-white">{{ health?.osType || 'N/A' }} {{ health?.osRelease || '' }}</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-dark-700">
              <span class="text-gray-500">Platform</span>
              <span class="font-medium text-white">{{ health?.platform || 'N/A' }} ({{ health?.arch || 'N/A' }})</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-dark-700">
              <span class="text-gray-500">IP Address</span>
              <span class="font-medium text-white">{{ health?.ipAddress || 'N/A' }}</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-dark-700">
              <span class="text-gray-500">Process Uptime</span>
              <span class="font-medium text-white">{{ formatUptime(health?.uptime || 0) }}</span>
            </div>

            <div class="flex items-center justify-between py-3">
              <span class="text-gray-500">System Uptime</span>
              <span class="font-medium text-white">{{ formatUptime(health?.systemUptime || 0) }}</span>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-dark-700">
              <span class="text-gray-500">Node.js Version</span>
              <span class="font-medium text-white">{{ nodeVersion }}</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-dark-700">
              <span class="text-gray-500">Environment</span>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="environment === 'production' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'">
                {{ environment }}
              </span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-dark-700">
              <span class="text-gray-500">CPU</span>
              <span class="font-medium text-white">{{ health?.cpu?.cores || 0 }} cores @ {{ health?.cpu?.speed || 0 }} MHz</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-dark-700">
              <span class="text-gray-500">CPU Load</span>
              <span class="font-medium text-white">{{ health?.cpu?.usagePercent || 0 }}%</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-dark-700">
              <span class="text-gray-500">System Memory</span>
              <span class="font-medium text-white">{{ formatBytes(health?.systemMemory?.used || 0) }} / {{ formatBytes(health?.systemMemory?.total || 0) }} ({{ health?.systemMemory?.usagePercent || 0 }}%)</span>
            </div>

            <div class="flex items-center justify-between py-3">
              <span class="text-gray-500">Last Check</span>
              <span class="font-medium text-white">{{ health?.timestamp ? formatDateTime(health.timestamp) : 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          @click="clearCache"
          :disabled="isClearingCache"
          class="p-4 border border-dark-600 rounded-xl hover:bg-dark-800 transition-colors text-left"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-white">Clear Cache</p>
              <p class="text-xs text-gray-500">Remove all cached data</p>
            </div>
          </div>
        </button>

        <button
          @click="restartServices"
          class="p-4 border border-dark-600 rounded-xl hover:bg-dark-800 transition-colors text-left"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-white">Restart Services</p>
              <p class="text-xs text-gray-500">Restart background workers</p>
            </div>
          </div>
        </button>

        <button
          @click="runHealthCheck"
          class="p-4 border border-dark-600 rounded-xl hover:bg-dark-800 transition-colors text-left"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-white">Health Check</p>
              <p class="text-xs text-gray-500">Run full diagnostics</p>
            </div>
          </div>
        </button>

        <button
          @click="viewLogs"
          class="p-4 border border-dark-600 rounded-xl hover:bg-dark-800 transition-colors text-left"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-white">View Logs</p>
              <p class="text-xs text-gray-500">Check activity logs</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Recent Errors (if any) -->
    <div v-if="recentErrors.length > 0" class="card p-6">
      <h3 class="text-lg font-semibold text-red-600 mb-4">Recent Errors</h3>
      
      <div class="space-y-3">
        <div
          v-for="error in recentErrors"
          :key="error.id"
          class="p-4 bg-red-900/20 rounded-xl"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="font-medium text-red-700 text-red-400">{{ error.message }}</p>
              <p class="text-sm text-red-600/70 mt-1">{{ error.stack }}</p>
            </div>
            <span class="text-xs text-red-500">{{ formatDateTime(error.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const router = useRouter()
const adminStore = useAdminStore()
const toast = useCustomToast()

// State
const isLoading = ref(false)
const isClearingCache = ref(false)
const health = ref<any>(null)
const lastUpdated = ref('')
const recentErrors = ref<any[]>([])

// Computed
const nodeVersion = computed(() => health.value?.nodeVersion || 'N/A')
const environment = computed(() => health.value?.environment || 'unknown')

// Methods
const refreshHealth = async () => {
  isLoading.value = true
  try {
    health.value = await adminStore.getSystemHealth()
    lastUpdated.value = format(new Date(), 'HH:mm:ss')
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch system health')
  } finally {
    isLoading.value = false
  }
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  
  return parts.join(' ') || '< 1m'
}

const formatDateTime = (date: string) => format(new Date(date), 'dd MMM yyyy HH:mm:ss')

const getMemoryPercentage = (key: string) => {
  const value = health.value?.memory?.[key] || 0
  const max = health.value?.memory?.rss || 1
  return Math.min((value / max) * 100, 100)
}

const getOverallStatusClass = () => {
  switch (health.value?.status) {
    case 'healthy':
      return 'border-l-4 border-green-500'
    case 'degraded':
      return 'border-l-4 border-yellow-500'
    default:
      return 'border-l-4 border-red-500'
  }
}

const getOverallStatusIconClass = () => {
  switch (health.value?.status) {
    case 'healthy':
      return 'bg-green-100 text-green-600'
    case 'degraded':
      return 'bg-yellow-100 text-yellow-600'
    default:
      return 'bg-red-100 text-red-600'
  }
}

const clearCache = async () => {
  if (!confirm('Are you sure you want to clear all cache?')) return
  
  isClearingCache.value = true
  try {
    await adminStore.clearCache()
    toast.success('Cache cleared successfully')
  } catch (error: any) {
    toast.error(error.message || 'Failed to clear cache')
  } finally {
    isClearingCache.value = false
  }
}

const restartServices = () => {
  toast.info('Service restart feature coming soon')
}

const runHealthCheck = () => {
  refreshHealth()
  toast.success('Health check initiated')
}

const viewLogs = () => {
  router.push('/admin/logs')
}

// Lifecycle
onMounted(() => {
  refreshHealth()
  
  // Auto refresh every 10 seconds for real-time monitoring
  const interval = setInterval(refreshHealth, 10000)
  onUnmounted(() => clearInterval(interval))
})
</script>