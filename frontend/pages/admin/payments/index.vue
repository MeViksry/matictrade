<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Payments</h1>
        <p class="text-gray-400 mt-1">Manage payment history and transactions</p>
      </div>
      <button
        @click="exportPayments"
        class="inline-flex items-center space-x-2 px-4 py-2 border border-dark-600 rounded-xl hover:bg-dark-700 transition-colors text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Export CSV</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Total Revenue</p>
            <p class="text-2xl font-bold text-white">
              {{ formatCurrency(stats.totalRevenue) }}
            </p>
          </div>
          <div class="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-green-500 mt-2 flex items-center">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          +{{ stats.revenueGrowth }}% from last month
        </p>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">This Month</p>
            <p class="text-2xl font-bold text-blue-500">
              {{ formatCurrency(stats.thisMonthRevenue) }}
            </p>
          </div>
          <div class="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Pending</p>
            <p class="text-2xl font-bold text-yellow-500">{{ stats.pendingCount }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          {{ formatCurrency(stats.pendingAmount) }} total pending
        </p>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Avg. Transaction</p>
            <p class="text-2xl font-bold text-purple-500">
              {{ formatCurrency(stats.avgTransaction) }}
            </p>
          </div>
          <div class="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Table -->
    <div class="card overflow-hidden">
      <!-- Filters -->
      <div class="p-4 border-b border-dark-700">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="lg:col-span-2">
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search by user, transaction ID..."
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                @input="debouncedSearch"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <select
            v-model="filters.status"
            class="px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white"
            @change="loadPayments"
          >
            <option value="">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <select
            v-model="filters.method"
            class="px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white"
            @change="loadPayments"
          >
            <option value="">All Methods</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="E_WALLET">E-Wallet</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="CRYPTO">Crypto</option>
            <option value="MANUAL">Manual</option>
          </select>

          <select
            v-model="filters.period"
            class="px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white"
            @change="loadPayments"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden divide-y divide-dark-700">
        <div
          v-for="payment in payments"
          :key="payment.id + '-mobile'"
          class="p-4 hover:bg-dark-800 transition-colors"
        >
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center space-x-3 min-w-0">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-medium">{{ payment.user?.fullName?.charAt(0) || 'U' }}</span>
              </div>
              <div class="min-w-0">
                <p class="font-medium text-white truncate">{{ payment.user?.fullName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ payment.user?.email }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-1 flex-shrink-0">
              <button
                @click="viewDetails(payment)"
                class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                v-if="payment.status === 'PENDING'"
                @click="confirmPayment(payment)"
                class="p-2 rounded-lg hover:bg-green-900/20 transition-colors"
              >
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                v-if="payment.status === 'PENDING'"
                @click="rejectPayment(payment)"
                class="p-2 rounded-lg hover:bg-red-900/20 transition-colors"
              >
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-gray-500">Amount:</span>
              <span class="ml-1 font-semibold text-white">{{ formatCurrency(payment.amount) }}</span>
            </div>
            <div>
              <span class="text-gray-500">Status:</span>
              <span
                class="ml-1 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                :class="getStatusBadgeClass(payment.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full mr-1" :class="getStatusDotClass(payment.status)"></span>
                {{ payment.status }}
              </span>
            </div>
            <div>
              <span class="text-gray-500">Method:</span>
              <span class="ml-1 px-2 py-0.5 text-xs font-medium rounded-full" :class="getMethodBadgeClass(payment.paymentMethod)">
                {{ formatMethod(payment.paymentMethod) }}
              </span>
            </div>
            <div>
              <span class="text-gray-500">Date:</span>
              <span class="ml-1 text-gray-400">{{ formatDate(payment.createdAt) }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-gray-500">Transaction ID:</span>
              <span class="ml-1 text-gray-400 text-xs">{{ payment.transactionId || payment.id.slice(0, 8) }}</span>
            </div>
          </div>
        </div>
        <div v-if="payments.length === 0 && !isLoading" class="px-6 py-12 text-center text-gray-500">
          No payments found
        </div>
        <div v-if="isLoading" class="px-6 py-12 text-center">
          <svg class="w-6 h-6 mx-auto animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span class="mt-2 block text-gray-500">Loading payments...</span>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-dark-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Transaction</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-700">
            <tr
              v-for="payment in payments"
              :key="payment.id"
              class="hover:bg-dark-800 transition-colors"
            >
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-white">
                    {{ payment.transactionId || payment.id.slice(0, 8) }}
                  </p>
                  <p v-if="payment.providerRef" class="text-xs text-gray-500">
                    Ref: {{ payment.providerRef }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">
                      {{ payment.user?.fullName?.charAt(0) || 'U' }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">
                      {{ payment.user?.fullName }}
                    </p>
                    <p class="text-xs text-gray-500">{{ payment.user?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-semibold text-white">
                  {{ formatCurrency(payment.amount) }}
                </p>
                <p class="text-xs text-gray-500">{{ payment.currency }}</p>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="getMethodBadgeClass(payment.paymentMethod)"
                >
                  {{ formatMethod(payment.paymentMethod) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="getStatusBadgeClass(payment.status)"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                    :class="getStatusDotClass(payment.status)"
                  ></span>
                  {{ payment.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-white">
                  {{ formatDate(payment.createdAt) }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatTime(payment.createdAt) }}
                </p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewDetails(payment)"
                    class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                    title="View Details"
                  >
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    v-if="payment.status === 'PENDING'"
                    @click="confirmPayment(payment)"
                    class="p-2 rounded-lg hover:bg-green-900/20 transition-colors"
                    title="Confirm Payment"
                  >
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    v-if="payment.status === 'PENDING'"
                    @click="rejectPayment(payment)"
                    class="p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                    title="Reject Payment"
                  >
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    v-if="payment.status === 'PAID'"
                    @click="refundPayment(payment)"
                    class="p-2 rounded-lg hover:bg-orange-900/20 transition-colors"
                    title="Refund"
                  >
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="payments.length === 0 && !isLoading">
              <td colspan="7" class="px-6 py-12 text-center">
                <svg class="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p class="mt-4 text-gray-500">No payments found</p>
              </td>
            </tr>

            <!-- Loading -->
            <tr v-if="isLoading">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span class="text-gray-500">Loading payments...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-dark-700 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Showing {{ payments.length }} of {{ pagination.total }} payments
        </p>
        <div class="flex items-center space-x-2">
          <button
            @click="loadMore"
            v-if="hasMore"
            class="px-4 py-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            Load More
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Details Modal -->
    <Modal v-model="showDetailsModal" title="Payment Details" size="lg">
      <div v-if="selectedPayment" class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
          <div>
            <p class="text-sm text-gray-500">Transaction ID</p>
            <p class="text-lg font-semibold text-white">
              {{ selectedPayment.transactionId || selectedPayment.id }}
            </p>
          </div>
          <span
            class="px-3 py-1.5 text-sm font-medium rounded-full"
            :class="getStatusBadgeClass(selectedPayment.status)"
          >
            {{ selectedPayment.status }}
          </span>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">User</p>
            <p class="font-medium text-white">
              {{ selectedPayment.user?.fullName }}
            </p>
            <p class="text-sm text-gray-500">{{ selectedPayment.user?.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Amount</p>
            <p class="text-xl font-bold text-white">
              {{ formatCurrency(selectedPayment.amount) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Payment Method</p>
            <p class="font-medium text-white">
              {{ formatMethod(selectedPayment.paymentMethod) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Date</p>
            <p class="font-medium text-white">
              {{ formatDateTime(selectedPayment.createdAt) }}
            </p>
          </div>
          <div v-if="selectedPayment.paidAt">
            <p class="text-sm text-gray-500">Paid At</p>
            <p class="font-medium text-white">
              {{ formatDateTime(selectedPayment.paidAt) }}
            </p>
          </div>
          <div v-if="selectedPayment.providerRef">
            <p class="text-sm text-gray-500">Provider Reference</p>
            <p class="font-medium text-white">
              {{ selectedPayment.providerRef }}
            </p>
          </div>
        </div>

        <!-- Payment Proof -->
        <div v-if="selectedPayment.paymentProof">
          <p class="text-sm text-gray-500 mb-2">Payment Proof</p>
          <img
            :src="selectedPayment.paymentProof"
            alt="Payment Proof"
            class="max-w-full h-auto rounded-xl border border-dark-700"
          />
        </div>

        <!-- Admin Notes -->
        <div v-if="selectedPayment.adminNotes">
          <p class="text-sm text-gray-500 mb-2">Admin Notes</p>
          <p class="p-3 bg-dark-800 rounded-xl text-gray-300">
            {{ selectedPayment.adminNotes }}
          </p>
        </div>

        <!-- Actions -->
        <div v-if="selectedPayment.status === 'PENDING'" class="flex justify-end space-x-3 pt-4 border-t border-dark-700">
          <button
            @click="rejectPayment(selectedPayment); showDetailsModal = false"
            class="px-4 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-900/20"
          >
            Reject
          </button>
          <button
            @click="confirmPayment(selectedPayment); showDetailsModal = false"
            class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { format } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const adminStore = useAdminStore()
const toast = useCustomToast()

// State
const isLoading = ref(false)
const payments = ref<any[]>([])
const selectedPayment = ref<any>(null)
const showDetailsModal = ref(false)

const stats = reactive({
  totalRevenue: 0,
  thisMonthRevenue: 0,
  pendingCount: 0,
  pendingAmount: 0,
  avgTransaction: 0,
  revenueGrowth: 0
})

const filters = reactive({
  search: '',
  status: '',
  method: '',
  period: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

// Computed
const hasMore = computed(() => payments.value.length < pagination.total)

// Methods
const loadPayments = async () => {
  isLoading.value = true
  try {
    // Load payments from API
    const response = await adminStore.getPayments({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      status: filters.status || undefined,
      paymentMethod: filters.method || undefined,
      period: filters.period || undefined
    })

    payments.value = response.payments
    pagination.total = response.total

    // Load stats from API
    await loadStats()
  } catch (error: any) {
    toast.error(error.message || 'Failed to load payments')
  } finally {
    isLoading.value = false
  }
}

const loadStats = async () => {
  try {
    const statsData = await adminStore.getPaymentStats()
    stats.totalRevenue = statsData.totalRevenue
    stats.thisMonthRevenue = statsData.thisMonthRevenue
    stats.pendingCount = statsData.pendingCount
    stats.pendingAmount = statsData.pendingAmount
    stats.avgTransaction = statsData.avgTransaction
    stats.revenueGrowth = statsData.revenueGrowth
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const debouncedSearch = useDebounceFn(() => {
  pagination.page = 1
  loadPayments()
}, 300)

const loadMore = () => {
  pagination.page++
  loadPayments()
}

const formatCurrency = (value: number) => {
  return `${value.toFixed(2)} USDT`
}

const formatDate = (date: string) => format(new Date(date), 'dd MMM yyyy')
const formatTime = (date: string) => format(new Date(date), 'HH:mm')
const formatDateTime = (date: string) => format(new Date(date), 'dd MMM yyyy HH:mm')

const formatMethod = (method: string) => {
  const methods: Record<string, string> = {
    BANK_TRANSFER: 'Bank Transfer',
    E_WALLET: 'E-Wallet',
    CREDIT_CARD: 'Credit Card',
    CRYPTO: 'Crypto',
    MANUAL: 'Manual'
  }
  return methods[method] || method
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    PAID: 'bg-green-500/20 text-green-400',
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    FAILED: 'bg-red-500/20 text-red-400',
    REFUNDED: 'bg-gray-800 text-gray-400',
    PROCESSING: 'bg-blue-500/20 text-blue-400'
  }
  return classes[status] || 'bg-gray-800 text-gray-400'
}

const getStatusDotClass = (status: string) => {
  const classes: Record<string, string> = {
    PAID: 'bg-green-500',
    PENDING: 'bg-yellow-500',
    FAILED: 'bg-red-500',
    REFUNDED: 'bg-gray-500',
    PROCESSING: 'bg-blue-500'
  }
  return classes[status] || 'bg-gray-500'
}

const getMethodBadgeClass = (method: string) => {
  const classes: Record<string, string> = {
    BANK_TRANSFER: 'bg-blue-500/20 text-blue-400',
    E_WALLET: 'bg-purple-500/20 text-purple-400',
    CREDIT_CARD: 'bg-indigo-500/20 text-indigo-400',
    CRYPTO: 'bg-orange-500/20 text-orange-400',
    MANUAL: 'bg-gray-800 text-gray-400'
  }
  return classes[method] || 'bg-gray-800 text-gray-400'
}

const viewDetails = (payment: any) => {
  selectedPayment.value = payment
  showDetailsModal.value = true
}

const confirmPayment = async (payment: any) => {
  if (!confirm('Confirm this payment? This will activate the user account.')) return

  try {
    await adminStore.updatePaymentStatus(payment.id, 'PAID', 'Payment confirmed by admin')
    toast.success('Payment confirmed and user account activated')
    loadPayments()
  } catch (error: any) {
    toast.error(error.message || 'Failed to confirm payment')
  }
}

const rejectPayment = async (payment: any) => {
  const reason = prompt('Enter rejection reason (optional):')
  if (reason === null) return // User cancelled

  try {
    await adminStore.updatePaymentStatus(payment.id, 'FAILED', reason || 'Payment verification failed')
    toast.success('Payment rejected')
    loadPayments()
  } catch (error: any) {
    toast.error(error.message || 'Failed to reject payment')
  }
}

const refundPayment = async (payment: any) => {
  const reason = prompt('Enter refund reason (optional):')
  if (reason === null) return // User cancelled

  try {
    await adminStore.updatePaymentStatus(payment.id, 'REFUNDED', reason || 'Refund processed')
    toast.success('Payment refunded')
    loadPayments()
  } catch (error: any) {
    toast.error(error.message || 'Failed to refund payment')
  }
}

const exportPayments = () => {
  // Generate CSV
  const headers = ['Transaction ID', 'User', 'Email', 'Amount', 'Method', 'Status', 'Date']
  const rows = payments.value.map(p => [
    p.transactionId || p.id,
    p.user?.fullName,
    p.user?.email,
    p.amount,
    p.paymentMethod,
    p.status,
    formatDateTime(p.createdAt)
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `payments-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)

  toast.success('Payments exported')
}

// Lifecycle
onMounted(() => {
  loadPayments()
})
</script>