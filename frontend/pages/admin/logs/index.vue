<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Activity Logs</h1>
        <p class="text-gray-500 mt-1">Track all admin actions and system events</p>
      </div>
      <button
        @click="exportLogs"
        class="inline-flex items-center space-x-2 px-4 py-2 border border-dark-600 rounded-xl hover:bg-dark-800 transition-colors text-white"
      >
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Export Logs</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
          <select
            v-model="filters.action"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white"
            @change="loadLogs"
          >
            <option value="">All Actions</option>
            <option value="CREATE_USER">Create User</option>
            <option value="UPDATE_USER">Update User</option>
            <option value="DELETE_USER">Delete User</option>
            <option value="UPDATE_SUBSCRIPTION">Update Subscription</option>
            <option value="EXTEND_SUBSCRIPTION">Extend Subscription</option>
            <option value="PROCESS_PAYMENT">Process Payment</option>
            <option value="SEND_PAYMENT_REMINDER">Send Reminder</option>
            <option value="TOGGLE_USER_BOT">Toggle Bot</option>
            <option value="RESET_API_KEYS">Reset API Keys</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
          <select
            v-model="filters.dateRange"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white"
            @change="loadLogs"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Admin</label>
          <input
            v-model="filters.adminSearch"
            type="text"
            placeholder="Search admin..."
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white placeholder-gray-500"
            @input="debouncedSearch"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Target User</label>
          <input
            v-model="filters.targetSearch"
            type="text"
            placeholder="Search target user..."
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white placeholder-gray-500"
            @input="debouncedSearch"
          />
        </div>
      </div>
    </div>

    <!-- Logs Timeline -->
    <div class="card">
      <div class="p-6 border-b border-dark-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-white">Activity Timeline</h3>
          <span class="text-sm text-gray-500">{{ pagination.total }} total entries</span>
        </div>
      </div>

      <div class="divide-y divide-dark-700">
        <div
          v-for="log in logs"
          :key="log.id"
          class="p-6 hover:bg-dark-800 transition-colors"
        >
          <div class="flex items-start space-x-4">
            <!-- Icon -->
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="getActionIconClass(log.action)"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="log.action.includes('CREATE') || log.action.includes('ACTIVATE')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                <path v-else-if="log.action.includes('UPDATE') || log.action.includes('EXTEND')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                <path v-else-if="log.action.includes('DELETE') || log.action.includes('DEACTIVATE')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                <path v-else-if="log.action.includes('PAYMENT')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else-if="log.action.includes('SUBSCRIPTION')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                <path v-else-if="log.action.includes('BOT') || log.action.includes('TOGGLE')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                <path v-else-if="log.action.includes('API') || log.action.includes('KEY')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                <path v-else-if="log.action.includes('REMINDER') || log.action.includes('SEND')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                <g v-else-if="log.action.includes('GET') || log.action.includes('READ') || log.action.includes('VIEW')">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </g>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-white">
                    {{ formatAction(log.action) }}
                  </p>
                  <p class="text-sm text-gray-500 mt-0.5">
                    by <span class="font-medium">{{ log.admin?.fullName || 'System' }}</span>
                    <span v-if="log.targetUser">
                      → <span class="font-medium">{{ log.targetUser?.fullName }}</span>
                    </span>
                  </p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-sm text-gray-500">{{ formatDateTime(log.createdAt) }}</p>
                  <p v-if="log.ipAddress" class="text-xs text-gray-400">{{ log.ipAddress }}</p>
                </div>
              </div>

              <!-- Details -->
              <div v-if="log.details" class="mt-3 p-3 bg-dark-800 rounded-lg">
                <p class="text-xs text-gray-500 mb-1">Details:</p>
                <pre class="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">{{ JSON.stringify(log.details, null, 2) }}</pre>
              </div>

              <!-- Quick Actions -->
              <div class="mt-3 flex items-center space-x-4">
                <button
                  v-if="log.targetUser"
                  @click="viewUser(log.targetUser.id)"
                  class="text-xs text-primary-500 hover:text-primary-600"
                >
                  View User →
                </button>
                <button
                  @click="copyLogId(log.id)"
                  class="text-xs text-gray-500 hover:text-gray-700"
                >
                  Copy Log ID
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="logs.length === 0 && !isLoading" class="p-12 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-4 text-gray-500">No activity logs found</p>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="p-12 text-center">
          <svg class="w-8 h-8 mx-auto animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p class="mt-4 text-gray-500">Loading logs...</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-dark-700 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Page {{ pagination.page }} of {{ pagination.totalPages }}
        </p>
        <div class="flex items-center space-x-2">
          <button
            @click="prevPage"
            :disabled="pagination.page === 1"
            class="px-4 py-2 rounded-xl border border-dark-600 disabled:opacity-50 hover:bg-dark-800 text-white"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.page === pagination.totalPages"
            class="px-4 py-2 rounded-xl border border-dark-600 disabled:opacity-50 hover:bg-dark-800 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { format, subDays, subWeeks, subMonths } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const router = useRouter()
const adminStore = useAdminStore()
const toast = useCustomToast()

// State
const isLoading = ref(false)
const logs = ref<any[]>([])

const filters = reactive({
  action: '',
  dateRange: 'week',
  adminSearch: '',
    targetSearch: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

// Methods
const loadLogs = async () => {
  isLoading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit
    }

    if (filters.action) params.action = filters.action

    // Date range - use ISO-8601 DateTime format
    const now = new Date()
    switch (filters.dateRange) {
      case 'today':
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        params.startDate = today.toISOString()
        break
      case 'week':
        params.startDate = subWeeks(now, 1).toISOString()
        break
      case 'month':
        params.startDate = subMonths(now, 1).toISOString()
        break
    }

    const response = await adminStore.getAdminLogs(params)
    logs.value = response.logs || []
    pagination.total = response.meta?.total || 0
    pagination.totalPages = response.meta?.totalPages || 0
  } catch (error: any) {
    toast.error(error.message || 'Failed to load logs')
  } finally {
    isLoading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  pagination.page = 1
  loadLogs()
}, 300)

const prevPage = () => {
  if (pagination.page > 1) {
    pagination.page--
    loadLogs()
  }
}

const nextPage = () => {
  if (pagination.page < pagination.totalPages) {
    pagination.page++
    loadLogs()
  }
}

const formatDateTime = (date: string) => format(new Date(date), 'dd MMM yyyy HH:mm:ss')

const formatAction = (action: string) => {
  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())
}

const getActionIcon = (action: string) => {
  // Return icon component based on action
  return 'div' // Simplified for this example
}

const getActionIconClass = (action: string) => {
  const classes: Record<string, string> = {
    CREATE_USER: 'bg-green-500/20 text-green-400',
    UPDATE_USER: 'bg-blue-500/20 text-blue-400',
    DELETE_USER: 'bg-red-500/20 text-red-400',
    UPDATE_SUBSCRIPTION: 'bg-purple-500/20 text-purple-400',
    EXTEND_SUBSCRIPTION: 'bg-indigo-500/20 text-indigo-400',
    PROCESS_PAYMENT: 'bg-emerald-500/20 text-emerald-400',
    SEND_PAYMENT_REMINDER: 'bg-yellow-500/20 text-yellow-400',
    TOGGLE_USER_BOT: 'bg-orange-500/20 text-orange-400',
    RESET_API_KEYS: 'bg-pink-500/20 text-pink-400',
    ACTIVATE_USER: 'bg-green-500/20 text-green-400',
    DEACTIVATE_USER: 'bg-gray-500/20 text-gray-400'
  }
  // Check for partial matches
  if (action.includes('GET') || action.includes('READ') || action.includes('VIEW')) {
    return 'bg-cyan-500/20 text-cyan-400'
  }
  return classes[action] || 'bg-gray-500/20 text-gray-400'
}

const viewUser = (userId: string) => {
  router.push(`/admin/users/${userId}`)
}

const copyLogId = async (id: string) => {
  await navigator.clipboard.writeText(id)
  toast.success('Log ID copied')
}

const exportLogs = () => {
  const headers = ['Date', 'Action', 'Admin', 'Target User', 'IP Address', 'Details']
  const rows = logs.value.map(log => [
    formatDateTime(log.createdAt),
    log.action,
    log.admin?.fullName || 'System',
    log.targetUser?.fullName || '-',
    log.ipAddress || '-',
    JSON.stringify(log.details || {})
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `admin-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)

  toast.success('Logs exported')
}

// Lifecycle
onMounted(() => {
  loadLogs()
})
</script>