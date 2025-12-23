<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Analytics</h1>
        <p class="text-gray-400 mt-1">Detailed insights and reports</p>
      </div>
      <div class="flex items-center space-x-3">
        <select
          v-model="selectedPeriod"
          class="px-4 py-2 pr-10 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
          style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%239CA3AF%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1rem;"
          @change="loadAnalytics"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="1y">Last Year</option>
        </select>
        <button
          @click="exportReport"
          class="px-4 py-2 border border-dark-600 rounded-xl hover:bg-dark-700 transition-colors flex items-center space-x-2 text-white"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export Report</span>
        </button>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Total Revenue</p>
            <p class="text-2xl font-bold text-white">
              {{ formatCurrency(revenueData?.total || 0) }}
            </p>
            <p class="text-xs mt-1" :class="revenueData?.growth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ revenueData?.growth >= 0 ? '+' : '' }}{{ revenueData?.growth?.toFixed(1) }}% vs last period
            </p>
          </div>
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Total Users</p>
            <p class="text-2xl font-bold text-white">
              {{ userData?.totalUsers || 0 }}
            </p>
            <p class="text-xs mt-1 text-blue-500">
              {{ userData?.newUsers || 0 }} new this period
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Active Users</p>
            <p class="text-2xl font-bold text-white">
              {{ userData?.activeUsers || 0 }}
            </p>
            <p class="text-xs mt-1 text-gray-500">
              {{ ((userData?.activeUsers / userData?.totalUsers) * 100 || 0).toFixed(1) }}% of total
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Total Transactions</p>
            <p class="text-2xl font-bold text-white">
              {{ transactionData?.totalTransactions || 0 }}
            </p>
            <p class="text-xs mt-1 text-gray-500">
              Avg: {{ formatCurrency(transactionData?.averageTransactionValue || 0) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Revenue Trend</h3>
          <div class="flex items-center space-x-4 text-sm">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-green-500 rounded-full"></span>
              <span class="text-gray-500">Revenue</span>
            </div>
          </div>
        </div>
        <div class="h-72">
          <canvas ref="revenueChartRef"></canvas>
        </div>
      </div>

      <!-- User Growth Chart -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">User Growth</h3>
          <div class="flex items-center space-x-4 text-sm">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span class="text-gray-500">Total</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-green-500 rounded-full"></span>
              <span class="text-gray-500">Active</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-500 rounded-full"></span>
              <span class="text-gray-500">New</span>
            </div>
          </div>
        </div>
        <div class="h-72">
          <canvas ref="userChartRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Subscription Distribution -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-6">Subscription Distribution</h3>
        <div class="h-64 flex items-center justify-center">
          <canvas ref="subscriptionChartRef"></canvas>
        </div>
        <div class="mt-4 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span class="text-sm text-gray-500">Monthly</span>
            </div>
            <span class="text-sm font-medium text-white">
              {{ formatCurrency(subscriptionData?.revenueByPlan?.monthly || 0) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-500 rounded-full"></span>
              <span class="text-sm text-gray-500">Yearly</span>
            </div>
            <span class="text-sm font-medium text-white">
              {{ formatCurrency(subscriptionData?.revenueByPlan?.yearly || 0) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-orange-500 rounded-full"></span>
              <span class="text-sm text-gray-500">Custom</span>
            </div>
            <span class="text-sm font-medium text-white">
              {{ formatCurrency(subscriptionData?.revenueByPlan?.custom || 0) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Transaction Volume -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-6">Transaction Volume</h3>
        <div class="h-64">
          <canvas ref="transactionChartRef"></canvas>
        </div>
      </div>

      <!-- Top Metrics -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-6">Key Metrics</h3>
        <div class="space-y-4">
          <div class="p-4 bg-dark-800 rounded-xl">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-500">Churn Rate</span>
              <span class="text-lg font-bold" :class="(userData?.churnRate || 0) > 5 ? 'text-red-500' : 'text-green-500'">
                {{ userData?.churnRate?.toFixed(1) || 0 }}%
              </span>
            </div>
            <div class="w-full bg-dark-700 rounded-full h-2">
              <div
                class="h-2 rounded-full"
                :class="(userData?.churnRate || 0) > 5 ? 'bg-red-500' : 'bg-green-500'"
                :style="{ width: Math.min(userData?.churnRate || 0, 100) + '%' }"
              ></div>
            </div>
          </div>

          <div class="p-4 bg-dark-800 rounded-xl">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-500">Subscription Growth</span>
              <span class="text-lg font-bold" :class="(subscriptionData?.growthRate || 0) >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ subscriptionData?.growthRate >= 0 ? '+' : '' }}{{ subscriptionData?.growthRate?.toFixed(1) || 0 }}%
              </span>
            </div>
            <div class="w-full bg-dark-700 rounded-full h-2">
              <div
                class="bg-green-500 h-2 rounded-full"
                :style="{ width: Math.min(Math.abs(subscriptionData?.growthRate || 0), 100) + '%' }"
              ></div>
            </div>
          </div>

          <div class="p-4 bg-dark-800 rounded-xl">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-500">Active Subscriptions</span>
              <span class="text-lg font-bold text-blue-500">
                {{ subscriptionData?.active || 0 }}
              </span>
            </div>
            <div class="flex items-center space-x-2 text-sm">
              <span class="text-yellow-500">{{ subscriptionData?.expiringThisWeek || 0 }} expiring</span>
              <span class="text-gray-400">•</span>
              <span class="text-red-500">{{ subscriptionData?.expired || 0 }} expired</span>
            </div>
          </div>

          <div class="p-4 bg-dark-800 rounded-xl">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Average Revenue Per User</span>
              <span class="text-lg font-bold text-purple-500">
                {{ formatCurrency((revenueData?.total || 0) / (userData?.totalUsers || 1)) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Users Table -->
    <div class="card overflow-hidden">
      <div class="p-6 border-b border-dark-700">
        <h3 class="text-lg font-semibold text-white">Top Users by Volume</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-dark-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Rank</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Plan</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Total Volume</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Trades</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Avg Volume</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-700">
            <tr
              v-for="(user, index) in topUsers"
              :key="user.userId"
              class="hover:bg-dark-800"
            >
              <td class="px-6 py-4">
                <span
                  class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold"
                  :class="index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ index + 1 }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ user.fullName?.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">{{ user.fullName }}</p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="getPlanBadgeClass(user.subscriptionPlan)"
                >
                  {{ user.subscriptionPlan }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-white">
                ${{ user.totalVolume?.toLocaleString() || 0 }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-400">
                {{ user.totalTrades || 0 }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-400">
                ${{ user.averageVolume?.toLocaleString() || 0 }}
              </td>
            </tr>
            <tr v-if="topUsers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                No data available
              </td>
            </tr>
          </tbody>
        </table>
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

const adminStore = useAdminStore()
const toast = useCustomToast()

// State
const selectedPeriod = ref<'7d' | '30d' | '1y'>('30d')
const revenueData = ref<any>(null)
const userData = ref<any>(null)
const transactionData = ref<any>(null)
const subscriptionData = ref<any>(null)
const volumeStats = ref<any>(null)
const topUsers = ref<any[]>([])

// Chart refs
const revenueChartRef = ref<HTMLCanvasElement | null>(null)
const userChartRef = ref<HTMLCanvasElement | null>(null)
const subscriptionChartRef = ref<HTMLCanvasElement | null>(null)
const transactionChartRef = ref<HTMLCanvasElement | null>(null)

let revenueChart: Chart | null = null
let userChart: Chart | null = null
let subscriptionChart: Chart | null = null
let transactionChart: Chart | null = null

// Methods
const formatCurrency = (value: number) => {
  return `${value.toFixed(2)} USDT`
}

const getPlanBadgeClass = (plan: string) => {
  const classes: Record<string, string> = {
    MONTHLY: 'bg-blue-100 text-blue-600',
    YEARLY: 'bg-purple-100 text-purple-600',
    CUSTOM: 'bg-orange-100 text-orange-600',
    FREE: 'bg-gray-100 text-gray-600'
  }
  return classes[plan] || classes.FREE
}

const loadAnalytics = async () => {
  try {
    const [revenue, users, transactions, subscriptions, volume] = await Promise.all([
      adminStore.getRevenueAnalytics(selectedPeriod.value),
      adminStore.getUserAnalytics(selectedPeriod.value),
      adminStore.getTransactionAnalytics(selectedPeriod.value),
      adminStore.getSubscriptionAnalytics(),
      adminStore.getUserVolumeStats()
    ])

    revenueData.value = revenue
    userData.value = users
    transactionData.value = transactions
    subscriptionData.value = subscriptions
    volumeStats.value = volume
    topUsers.value = volume?.topUsers || []

    await nextTick()
    updateCharts()
  } catch (error: any) {
    toast.error(error.message || 'Failed to load analytics')
  }
}

const updateCharts = () => {
  // Revenue Chart
  if (revenueChartRef.value && revenueData.value?.data) {
    if (revenueChart) revenueChart.destroy()

    const ctx = revenueChartRef.value.getContext('2d')
    if (ctx) {
      revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: revenueData.value.data.map((d: any) => format(new Date(d.date), 'dd MMM')),
          datasets: [{
            label: 'Revenue',
            data: revenueData.value.data.map((d: any) => d.revenue),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: {
              grid: { color: 'rgba(156, 163, 175, 0.1)' },
              ticks: {
                callback: (value) => Number(value).toFixed(2) + ' USDT'
              }
            }
          }
        }
      })
    }
  }

  // User Chart
  if (userChartRef.value && userData.value?.data) {
    if (userChart) userChart.destroy()

    const ctx = userChartRef.value.getContext('2d')
    if (ctx) {
      userChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: userData.value.data.map((d: any) => format(new Date(d.date), 'dd MMM')),
          datasets: [
            {
              label: 'Total',
              data: userData.value.data.map((d: any) => d.total),
              borderColor: '#3b82f6',
              backgroundColor: 'transparent',
              tension: 0.4
            },
            {
              label: 'Active',
              data: userData.value.data.map((d: any) => d.active),
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              tension: 0.4
            },
            {
              label: 'New',
              data: userData.value.data.map((d: any) => d.new),
              borderColor: '#8b5cf6',
              backgroundColor: 'transparent',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(156, 163, 175, 0.1)' } }
          }
        }
      })
    }
  }

  // Subscription Chart
  if (subscriptionChartRef.value && subscriptionData.value) {
    if (subscriptionChart) subscriptionChart.destroy()

    const ctx = subscriptionChartRef.value.getContext('2d')
    if (ctx) {
      subscriptionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Monthly', 'Yearly', 'Custom'],
          datasets: [{
            data: [
              subscriptionData.value.revenueByPlan?.monthly || 0,
              subscriptionData.value.revenueByPlan?.yearly || 0,
              subscriptionData.value.revenueByPlan?.custom || 0
            ],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: { legend: { display: false } }
        }
      })
    }
  }

  // Transaction Chart
  if (transactionChartRef.value && transactionData.value?.data) {
    if (transactionChart) transactionChart.destroy()

    const ctx = transactionChartRef.value.getContext('2d')
    if (ctx) {
      transactionChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: transactionData.value.data.map((d: any) => format(new Date(d.date), 'dd')),
          datasets: [{
            label: 'Transactions',
            data: transactionData.value.data.map((d: any) => d.count),
            backgroundColor: '#f59e0b',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(156, 163, 175, 0.1)' } }
          }
        }
      })
    }
  }
}

const exportReport = () => {
  try {
    // Build CSV content
    const sections: string[] = []
    
    // Header
    sections.push('MATIC TRADE - Analytics Report')
    sections.push(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`)
    sections.push(`Period: ${selectedPeriod.value === '7d' ? 'Last 7 Days' : selectedPeriod.value === '30d' ? 'Last 30 Days' : 'Last Year'}`)
    sections.push('')
    
    // Overview Statistics
    sections.push('=== OVERVIEW STATISTICS ===')
    sections.push(`Total Revenue,${revenueData.value?.total || 0}`)
    sections.push(`Revenue Growth,${revenueData.value?.growth?.toFixed(2) || 0}%`)
    sections.push(`Total Users,${userData.value?.totalUsers || 0}`)
    sections.push(`Active Users,${userData.value?.activeUsers || 0}`)
    sections.push(`New Users This Period,${userData.value?.newUsers || 0}`)
    sections.push(`Total Transactions,${transactionData.value?.totalTransactions || 0}`)
    sections.push(`Average Transaction Value,${transactionData.value?.averageTransactionValue || 0}`)
    sections.push('')
    
    // Subscription Analytics
    sections.push('=== SUBSCRIPTION ANALYTICS ===')
    sections.push(`Active Subscriptions,${subscriptionData.value?.active || 0}`)
    sections.push(`Expiring This Week,${subscriptionData.value?.expiringThisWeek || 0}`)
    sections.push(`Expired,${subscriptionData.value?.expired || 0}`)
    sections.push(`Pending,${subscriptionData.value?.pending || 0}`)
    sections.push(`Subscription Growth Rate,${subscriptionData.value?.growthRate?.toFixed(2) || 0}%`)
    sections.push('')
    
    // Revenue by Plan
    sections.push('=== REVENUE BY PLAN ===')
    sections.push(`Monthly Plan,${subscriptionData.value?.revenueByPlan?.monthly || 0}`)
    sections.push(`Yearly Plan,${subscriptionData.value?.revenueByPlan?.yearly || 0}`)
    sections.push(`Custom Plan,${subscriptionData.value?.revenueByPlan?.custom || 0}`)
    sections.push('')
    
    // Revenue Trend Data
    if (revenueData.value?.data?.length) {
      sections.push('=== REVENUE TREND ===')
      sections.push('Date,Revenue,Users,Transactions')
      revenueData.value.data.forEach((d: any) => {
        sections.push(`${d.date},${d.revenue || 0},${d.users || 0},${d.transactions || 0}`)
      })
      sections.push('')
    }
    
    // Top Users by Volume
    if (topUsers.value?.length) {
      sections.push('=== TOP USERS BY VOLUME ===')
      sections.push('Rank,Name,Email,Plan,Total Volume,Total Trades,Average Volume')
      topUsers.value.forEach((user: any, index: number) => {
        sections.push(`${index + 1},${user.fullName || '-'},${user.email || '-'},${user.subscriptionPlan || '-'},${user.totalVolume || 0},${user.totalTrades || 0},${user.averageVolume || 0}`)
      })
    }
    
    // Create and download CSV
    const csvContent = sections.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Report exported successfully')
  } catch (error: any) {
    toast.error('Failed to export report: ' + (error.message || 'Unknown error'))
  }
}

// Lifecycle
onMounted(() => {
  loadAnalytics()
})

onUnmounted(() => {
  if (revenueChart) revenueChart.destroy()
  if (userChart) userChart.destroy()
  if (subscriptionChart) subscriptionChart.destroy()
  if (transactionChart) transactionChart.destroy()
})
</script>