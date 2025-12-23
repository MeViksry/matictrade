<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <p class="text-gray-400 mt-1">Welcome back, {{ authStore.user?.fullName }}!</p>
      </div>
      <div class="flex items-center space-x-3">
        <select
          v-model="selectedPeriod"
          class="px-4 py-2 pr-10 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer bg-no-repeat bg-right"
          :style="selectDropdownStyle"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="1y">Last Year</option>
        </select>
        <button
          @click="refreshData"
          :disabled="isLoading"
          class="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl transition-colors"
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

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminStatCard
        title="Total Users"
        :value="stats?.totalUsers || 0"
        :change="calculateChange('users')"
        changeLabel="vs last period"
        icon="users"
        color="blue"
      />
      <AdminStatCard
        title="Active Subscriptions"
        :value="stats?.activeSubscriptions || 0"
        :change="calculateChange('subscriptions')"
        changeLabel="vs last period"
        icon="subscription"
        color="green"
      />
      <AdminStatCard
        title="Total Revenue"
        :value="formatCurrency(stats?.totalRevenue || 0)"
        :change="calculateChange('revenue')"
        changeLabel="vs last period"
        icon="revenue"
        color="purple"
        :isFormatted="true"
      />
      <AdminStatCard
        title="Active Bots"
        :value="stats?.usersWithActiveBots || 0"
        :change="calculateChange('bots')"
        changeLabel="of total users"
        icon="bot"
        color="orange"
      />
    </div>

    <!-- Secondary Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-gray-400 truncate">New Users Today</p>
            <p class="text-2xl font-bold text-white mt-1">
              {{ stats?.newUsersToday || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-gray-400 truncate">Expiring Soon</p>
            <p class="text-2xl font-bold text-yellow-500 mt-1">
              {{ stats?.subscriptionExpiringSoon || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-gray-400 truncate">Pending Payments</p>
            <p class="text-2xl font-bold text-orange-500 mt-1">
              {{ stats?.pendingPayments || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-gray-400 truncate">Revenue (7 Days)</p>
            <p class="text-xl sm:text-2xl font-bold text-green-500 mt-1 break-all">
              {{ formatCurrency(stats?.revenue7Days || 0) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Revenue Overview</h3>
          <div class="flex items-center space-x-2">
            <span class="w-3 h-3 bg-primary-500 rounded-full"></span>
            <span class="text-sm text-gray-500">Revenue</span>
          </div>
        </div>
        <div class="h-64">
          <canvas ref="revenueChartRef"></canvas>
        </div>
      </div>

      <!-- Users Chart -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">User Growth</h3>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span class="text-sm text-gray-500">Total</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-green-500 rounded-full"></span>
              <span class="text-sm text-gray-500">Active</span>
            </div>
          </div>
        </div>
        <div class="h-64">
          <canvas ref="usersChartRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Subscription Distribution -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-6">Subscription Plans</h3>
        <div class="h-48 flex items-center justify-center">
          <canvas ref="subscriptionChartRef"></canvas>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p class="text-2xl font-bold text-blue-500">{{ subscriptionAnalytics?.active || 0 }}</p>
            <p class="text-xs text-gray-500">Active</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-yellow-500">{{ subscriptionAnalytics?.expiringThisWeek || 0 }}</p>
            <p class="text-xs text-gray-500">Expiring</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-500">{{ subscriptionAnalytics?.expired || 0 }}</p>
            <p class="text-xs text-gray-500">Expired</p>
          </div>
        </div>
      </div>

      <!-- Recent Users -->
      <div class="card p-6 lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Recent Users</h3>
          <NuxtLink
            to="/admin/users"
            class="text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            View all →
          </NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th class="pb-3">User</th>
                <th class="pb-3">Plan</th>
                <th class="pb-3">Status</th>
                <th class="pb-3">Bot</th>
                <th class="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-700">
              <tr v-for="user in recentUsers" :key="user.id" class="hover:bg-dark-800">
                <td class="py-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span class="text-white text-xs font-medium">
                        {{ user.fullName?.charAt(0) || 'U' }}
                      </span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-white">{{ user.fullName }}</p>
                      <p class="text-xs text-gray-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getPlanBadgeClass(user.subscription?.plan)"
                  >
                    {{ user.subscription?.plan || 'FREE' }}
                  </span>
                </td>
                <td class="py-3">
                  <span
                    class="flex items-center space-x-1"
                    :class="user.isActive ? 'text-green-500' : 'text-gray-400'"
                  >
                    <span class="w-2 h-2 rounded-full" :class="user.isActive ? 'bg-green-500' : 'bg-gray-400'"></span>
                    <span class="text-xs">{{ user.isActive ? 'Active' : 'Inactive' }}</span>
                  </span>
                </td>
                <td class="py-3">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="user.botActive ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'"
                  >
                    {{ user.botActive ? 'ON' : 'OFF' }}
                  </span>
                </td>
                <td class="py-3 text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
              </tr>
              <tr v-if="recentUsers.length === 0">
                <td colspan="5" class="py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Expiring Subscriptions Alert -->
    <div v-if="expiringSubscriptions.length > 0" class="card p-6 border-l-4 border-yellow-500">
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="text-lg font-semibold text-white">
            Subscriptions Expiring Soon
          </h4>
          <p class="text-sm text-gray-500 mt-1">
            {{ expiringSubscriptions.length }} subscription(s) will expire within 3 days
          </p>
          <div class="mt-4 space-y-2">
            <div
              v-for="sub in expiringSubscriptions.slice(0, 3)"
              :key="sub.userId"
              class="flex items-center justify-between p-3 bg-yellow-900/10 rounded-xl"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-yellow-900/50 rounded-full flex items-center justify-center">
                  <span class="text-yellow-400 text-sm font-medium">
                    {{ sub.userFullName?.charAt(0) || 'U' }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-white">{{ sub.userFullName }}</p>
                  <p class="text-xs text-gray-500">{{ sub.userEmail }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-yellow-600">{{ sub.daysRemaining }} days left</p>
                <button
                  @click="sendReminder(sub.userId)"
                  class="text-xs text-primary-500 hover:text-primary-600"
                >
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
          <NuxtLink
            v-if="expiringSubscriptions.length > 3"
            to="/admin/subscriptions"
            class="inline-block mt-3 text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            View all {{ expiringSubscriptions.length }} expiring subscriptions →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { format } from 'date-fns'

Chart.register(...registerables)

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const authStore = useAuthStore()
const adminStore = useAdminStore()
const toast = useCustomToast()

const isLoading = ref(false)
const selectedPeriod = ref<'7d' | '30d' | '1y'>('30d')

const stats = ref<any>(null)
const revenueAnalytics = ref<any>(null)
const userAnalytics = ref<any>(null)
const subscriptionAnalytics = ref<any>(null)
const recentUsers = ref<any[]>([])
const expiringSubscriptions = ref<any[]>([])

// Chart refs
const revenueChartRef = ref<HTMLCanvasElement | null>(null)
const usersChartRef = ref<HTMLCanvasElement | null>(null)
const subscriptionChartRef = ref<HTMLCanvasElement | null>(null)

let revenueChart: Chart | null = null
let usersChart: Chart | null = null
let subscriptionChart: Chart | null = null

// Computed
const selectDropdownStyle = computed(() => ({
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
  backgroundSize: '1.25rem',
  backgroundPosition: 'right 0.5rem center'
}))

// Methods
const formatCurrency = (value: number) => {
  return `${value.toFixed(2)} USDT`
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy')
}

const calculateChange = (type: string) => {
  // Calculate real changes based on analytics data
  switch (type) {
    case 'users':
      // Calculate user growth from user analytics
      if (userAnalytics.value?.data && userAnalytics.value.data.length >= 2) {
        const data = userAnalytics.value.data
        const firstTotal = data[0]?.total || 0
        const lastTotal = data[data.length - 1]?.total || 0
        if (firstTotal > 0) {
          return parseFloat((((lastTotal - firstTotal) / firstTotal) * 100).toFixed(1))
        }
      }
      return userAnalytics.value?.totalUsers > 0 ? 100 : 0
      
    case 'subscriptions':
      // Calculate subscription growth
      if (subscriptionAnalytics.value?.growthRate !== undefined) {
        return subscriptionAnalytics.value.growthRate
      }
      return 0
      
    case 'revenue':
      // Calculate revenue growth from revenue analytics
      if (revenueAnalytics.value?.growth !== undefined) {
        return revenueAnalytics.value.growth
      }
      return 0
      
    case 'bots':
      // Calculate active bots percentage of total users
      if (stats.value?.totalUsers > 0) {
        const percentage = (stats.value.usersWithActiveBots / stats.value.totalUsers) * 100
        return parseFloat(percentage.toFixed(1))
      }
      return 0
      
    default:
      return 0
  }
}

const getPlanBadgeClass = (plan: string) => {
  const classes: Record<string, string> = {
    'MONTHLY': 'bg-blue-900/30 text-blue-400',
    'YEARLY': 'bg-purple-900/30 text-purple-400',
    'CUSTOM': 'bg-orange-900/30 text-orange-400',
    'FREE': 'bg-gray-800 text-gray-400'
  }
  return classes[plan] || classes['FREE']
}

const sendReminder = async (userId: string) => {
  try {
    await adminStore.sendPaymentReminder(userId)
    toast.success('Reminder sent successfully')
  } catch (error: any) {
    toast.error(error.message || 'Failed to send reminder')
  }
}

const loadData = async () => {
  isLoading.value = true
  try {
    // Load dashboard stats
    stats.value = await adminStore.getDashboardStats()

    // Load analytics
    const [revenue, users, subscriptions] = await Promise.all([
      adminStore.getRevenueAnalytics(selectedPeriod.value),
      adminStore.getUserAnalytics(selectedPeriod.value),
      adminStore.getSubscriptionAnalytics()
    ])

    revenueAnalytics.value = revenue
    userAnalytics.value = users
    subscriptionAnalytics.value = subscriptions

    // Load recent users
    const usersResponse = await adminStore.getUsers({
      page: 1,
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    recentUsers.value = usersResponse.users || []

    // Load expiring subscriptions
    expiringSubscriptions.value = await adminStore.getExpiringSubscriptions()

    // Update charts
    await nextTick()
    updateCharts()
  } catch (error: any) {
    toast.error(error.message || 'Failed to load dashboard data')
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  loadData()
}

const updateCharts = () => {
  // Revenue Chart
  if (revenueChartRef.value && revenueAnalytics.value?.data) {
    if (revenueChart) revenueChart.destroy()

    const ctx = revenueChartRef.value.getContext('2d')
    if (ctx) {
      revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: revenueAnalytics.value.data.map((d: any) => format(new Date(d.date), 'dd MMM')),
          datasets: [{
            label: 'Revenue',
            data: revenueAnalytics.value.data.map((d: any) => d.revenue),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#9ca3af' }
            },
            y: {
              grid: { color: 'rgba(156, 163, 175, 0.1)' },
              ticks: {
                color: '#9ca3af',
                callback: (value) => formatCurrency(Number(value))
              }
            }
          }
        }
      })
    }
  }

  // Users Chart
  if (usersChartRef.value && userAnalytics.value?.data) {
    if (usersChart) usersChart.destroy()

    const ctx = usersChartRef.value.getContext('2d')
    if (ctx) {
      usersChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: userAnalytics.value.data.map((d: any) => format(new Date(d.date), 'dd MMM')),
          datasets: [
            {
              label: 'Total Users',
              data: userAnalytics.value.data.map((d: any) => d.total),
              borderColor: '#3b82f6',
              backgroundColor: 'transparent',
              tension: 0.4,
              pointRadius: 0
            },
            {
              label: 'Active Users',
              data: userAnalytics.value.data.map((d: any) => d.active),
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              tension: 0.4,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#9ca3af' }
            },
            y: {
              grid: { color: 'rgba(156, 163, 175, 0.1)' },
              ticks: { color: '#9ca3af' }
            }
          }
        }
      })
    }
  }

  // Subscription Chart (Doughnut)
  if (subscriptionChartRef.value && subscriptionAnalytics.value) {
    if (subscriptionChart) subscriptionChart.destroy()

    const ctx = subscriptionChartRef.value.getContext('2d')
    if (ctx) {
      const { revenueByPlan } = subscriptionAnalytics.value
      subscriptionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Monthly', 'Yearly', 'Custom'],
          datasets: [{
            data: [
              revenueByPlan?.monthly || 0,
              revenueByPlan?.yearly || 0,
              revenueByPlan?.custom || 0
            ],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { display: false }
          }
        }
      })
    }
  }
}

// Watch period change
watch(selectedPeriod, () => {
  loadData()
})

// Lifecycle
onMounted(() => {
  loadData()
})

onUnmounted(() => {
  if (revenueChart) revenueChart.destroy()
  if (usersChart) usersChart.destroy()
  if (subscriptionChart) subscriptionChart.destroy()
})
</script>