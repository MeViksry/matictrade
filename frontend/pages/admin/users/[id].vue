<template>
  <div class="space-y-6">
    <!-- Back Button & Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <NuxtLink
          to="/admin/users"
          class="p-2 rounded-xl hover:bg-gray-100 hover:bg-dark-800 transition-colors"
        >
          <svg
            class="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold text-white">User Details</h1>
          <p class="text-gray-500">View and manage user information</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="sendPaymentReminder"
          class="px-4 py-2 border border-dark-600 text-white rounded-xl hover:bg-dark-800 transition-colors"
        >
          <span class="flex items-center space-x-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span>Send Reminder</span>
          </span>
        </button>
        <button
          @click="showExtendModal = true"
          class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
        >
          <span class="flex items-center space-x-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Extend Subscription</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <svg
          class="w-10 h-10 mx-auto animate-spin text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p class="mt-4 text-gray-500">Loading user details...</p>
      </div>
    </div>

    <!-- User Details -->
    <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - User Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Info Card -->
        <div class="card p-6">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div
                class="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center"
              >
                <span class="text-white text-2xl font-bold">
                  {{ user.fullName?.charAt(0) || "U" }}
                </span>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">
                  {{ user.fullName }}
                </h2>
                <p class="text-gray-500">@{{ user.username }}</p>
                <div class="flex items-center space-x-2 mt-2">
                  <span
                    class="px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="getRoleBadgeClass(user.role)"
                  >
                    {{ formatRole(user.role) }}
                  </span>
                  <span
                    class="px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="
                      user.isActive
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    "
                  >
                    {{ user.isActive ? "Active" : "Inactive" }}
                  </span>
                </div>
              </div>
            </div>
            <button
              @click="showEditModal = true"
              class="p-2 rounded-xl hover:bg-gray-100 hover:bg-dark-800 transition-colors"
            >
              <svg
                class="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase"
                >Email</label
              >
              <p class="text-white flex items-center space-x-2">
                <span>{{ user.email }}</span>
                <span v-if="user.isEmailVerified" class="text-green-500">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase"
                >Phone</label
              >
              <p class="text-white">{{ user.phone || "-" }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase"
                >Address</label
              >
              <p class="text-white">{{ user.address || "-" }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase"
                >Joined</label
              >
              <p class="text-white">{{ formatDate(user.createdAt) }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase"
                >Last Login</label
              >
              <p class="text-white">
                {{
                  user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Never"
                }}
              </p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase"
                >Login Count</label
              >
              <p class="text-white">{{ user.loginCount || 0 }} times</p>
            </div>
          </div>

          <!-- Password Section -->
          <div class="pt-4 mt-4 border-t border-dark-700">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase"
                  >Password</label
                >
                <p class="text-white font-mono">••••••••••••</p>
              </div>
              <button
                @click="openPasswordModal"
                class="flex items-center space-x-2 px-4 py-2 text-sm bg-red-900/20 text-red-600 text-red-400 rounded-xl hover:bg-red-900/30 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span>Reset Password</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Subscription Card -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-white">Subscription</h3>
            <button
              @click="openSubscriptionModal"
              class="text-sm text-primary-500 hover:text-primary-600"
            >
              Edit Subscription
            </button>
          </div>

          <div v-if="user.subscription" class="space-y-4">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="p-4 bg-dark-800 rounded-xl">
                <label class="text-xs font-medium text-gray-500">Plan</label>
                <p class="text-lg font-semibold text-white">
                  {{ user.subscription.plan }}
                </p>
              </div>
              <div class="p-4 bg-dark-800 rounded-xl">
                <label class="text-xs font-medium text-gray-500">Status</label>
                <p
                  class="text-lg font-semibold"
                  :class="getStatusColor(user.subscription.status)"
                >
                  {{ user.subscription.status }}
                </p>
              </div>
              <div class="p-4 bg-dark-800 rounded-xl">
                <label class="text-xs font-medium text-gray-500">Price</label>
                <p class="text-lg font-semibold text-white">
                  {{ formatCurrency(user.subscription.price) }}
                </p>
              </div>
              <div class="p-4 bg-dark-800 rounded-xl">
                <label class="text-xs font-medium text-gray-500"
                  >Days Left</label
                >
                <p
                  class="text-lg font-semibold"
                  :class="getDaysLeftColor(user.subscription.daysRemaining)"
                >
                  {{ user.subscription.daysRemaining ?? "N/A" }}
                </p>
              </div>
            </div>

            <div
              class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-dark-700"
            >
              <div>
                <label class="text-xs font-medium text-gray-500"
                  >Start Date</label
                >
                <p class="text-white">
                  {{
                    user.subscription.startDate
                      ? formatDate(user.subscription.startDate)
                      : "-"
                  }}
                </p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500"
                  >End Date</label
                >
                <p class="text-white">
                  {{
                    user.subscription.endDate
                      ? formatDate(user.subscription.endDate)
                      : "-"
                  }}
                </p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500"
                  >Auto Renew</label
                >
                <p class="text-white">
                  {{ user.subscription.autoRenew ? "Yes" : "No" }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-500">No subscription found</p>
          </div>
        </div>

        <!-- Bot Settings Card -->
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">Bot Settings</h3>
            <button
              @click="toggleBot"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="
                user.botActive ? 'bg-green-500' : 'bg-gray-300 bg-dark-600'
              "
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="user.botActive ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>
        </div>

        <!-- API Keys Card -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-white">API Keys</h3>
            <button
              v-if="user.apiKeys?.length > 0"
              @click="confirmResetApiKeys"
              class="text-sm text-red-500 hover:text-red-600"
            >
              Reset All Keys
            </button>
          </div>

          <div v-if="user.apiKeys?.length > 0" class="space-y-3">
            <div
              v-for="key in user.apiKeys"
              :key="key.id"
              class="flex items-center justify-between p-4 bg-dark-800 rounded-xl"
            >
              <div class="flex items-center space-x-3">
                <img
                  :src="`/images/${key.exchange.toLowerCase()}.svg`"
                  :alt="key.exchange"
                  class="w-8 h-8"
                />
                <div>
                  <p class="font-medium text-white">{{ key.exchange }}</p>
                  <p class="text-xs text-gray-500">
                    Added {{ formatDate(key.createdAt) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="
                    key.isValid
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  "
                >
                  {{ key.isValid ? "Valid" : "Invalid" }}
                </span>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="
                    key.isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  {{ key.isActive ? "Active" : "Inactive" }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-500">No API keys configured</p>
          </div>
        </div>

        <!-- Recent Trades -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-white mb-6">Recent Trades</h3>

          <div v-if="user.recentTrades?.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr
                  class="text-left text-xs font-medium text-gray-500 uppercase"
                >
                  <th class="pb-3">Symbol</th>
                  <th class="pb-3">Side</th>
                  <th class="pb-3">Entry</th>
                  <th class="pb-3">Exit</th>
                  <th class="pb-3">PnL</th>
                  <th class="pb-3">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-700">
                <tr v-for="trade in user.recentTrades" :key="trade.id">
                  <td class="py-3 font-medium text-white">
                    {{ trade.symbol }}
                  </td>
                  <td class="py-3">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded"
                      :class="
                        trade.side === 'LONG'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      "
                    >
                      {{ trade.side }}
                    </span>
                  </td>
                  <td class="py-3 text-gray-400">
                    ${{ trade.entryPrice.toFixed(2) }}
                  </td>
                  <td class="py-3 text-gray-400">
                    ${{ trade.exitPrice.toFixed(2) }}
                  </td>
                  <td
                    class="py-3"
                    :class="trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'"
                  >
                    {{ trade.pnl >= 0 ? "+" : "" }}${{ trade.pnl.toFixed(2) }}
                    <span class="text-xs"
                      >({{ trade.pnlPercent.toFixed(2) }}%)</span
                    >
                  </td>
                  <td class="py-3 text-gray-500 text-sm">
                    {{ formatDate(trade.closedAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-500">No trade history</p>
          </div>
        </div>
      </div>

      <!-- Right Column - Stats & Activity -->
      <div class="space-y-6">
        <!-- Quick Stats -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-white mb-4">
            Trading Statistics
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Total Volume</span>
              <span class="font-semibold text-white">
                ${{ (user.metrics?.totalVolume || 0).toLocaleString() }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Avg. Volume/Trade</span>
              <span class="font-semibold text-white">
                ${{ calculateAvgVolume() }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Total Trades</span>
              <span class="font-semibold text-white">
                {{ user._count?.tradeHistory || 0 }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Active Positions</span>
              <span class="font-semibold text-white">
                {{ user._count?.positions || 0 }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Total PnL</span>
              <span
                class="font-semibold"
                :class="
                  (user.metrics?.totalPnl || 0) >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                "
              >
                {{ (user.metrics?.totalPnl || 0) >= 0 ? "+" : "" }}${{
                  (user.metrics?.totalPnl || 0).toFixed(2)
                }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Win Rate</span>
              <span
                class="font-semibold"
                :class="
                  (user.metrics?.winRate || 0) >= 50
                    ? 'text-green-500'
                    : 'text-yellow-500'
                "
              >
                {{ (user.metrics?.winRate || 0).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div v-if="user.metrics" class="card p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Performance</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Win Rate</span>
              <span
                class="font-semibold"
                :class="
                  user.metrics.winRate >= 50 ? 'text-green-500' : 'text-red-500'
                "
              >
                {{ user.metrics.winRate.toFixed(1) }}%
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Total PnL</span>
              <span
                class="font-semibold"
                :class="
                  user.metrics.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'
                "
              >
                {{ user.metrics.totalPnl >= 0 ? "+" : "" }}${{
                  user.metrics.totalPnl.toFixed(2)
                }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Profit Factor</span>
              <span class="font-semibold text-white">
                {{ user.metrics.profitFactor.toFixed(2) }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Max Drawdown</span>
              <span class="font-semibold text-red-500">
                -{{ user.metrics.maxDrawdownPercent.toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Payment History -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Payments</h3>
            <button
              @click="showPaymentModal = true"
              class="text-sm text-primary-500 hover:text-primary-600"
            >
              + Add Payment
            </button>
          </div>

          <div v-if="user.paymentHistory?.length > 0" class="space-y-3">
            <div
              v-for="payment in user.paymentHistory.slice(0, 5)"
              :key="payment.id"
              class="flex items-center justify-between p-3 bg-dark-800 rounded-xl"
            >
              <div>
                <p class="font-medium text-white">
                  {{ formatCurrency(payment.amount) }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(payment.createdAt) }}
                </p>
              </div>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getPaymentStatusClass(payment.status)"
              >
                {{ payment.status }}
              </span>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <p class="text-gray-500 text-sm">No payment history</p>
          </div>
        </div>

        <!-- Admin Activity -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Admin Activity</h3>

          <div v-if="user.adminLogs?.length > 0" class="space-y-3">
            <div
              v-for="log in user.adminLogs.slice(0, 5)"
              :key="log.id"
              class="border-l-2 border-primary-500 pl-3 py-1"
            >
              <p class="text-sm font-medium text-white">
                {{ formatAction(log.action) }}
              </p>
              <p class="text-xs text-gray-500">
                by {{ log.admin?.fullName }} •
                {{ formatDateTime(log.createdAt) }}
              </p>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <p class="text-gray-500 text-sm">No admin activity</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Extend Subscription Modal -->
    <Modal v-model="showExtendModal" title="Extend Subscription" size="sm">
      <form @submit.prevent="extendSubscription" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Days to Extend
          </label>
          <input
            v-model.number="extendDays"
            type="number"
            min="1"
            max="365"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showExtendModal = false"
            class="px-4 py-2 rounded-xl border border-dark-600 text-white hover:bg-dark-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl"
          >
            {{ isSubmitting ? "Processing..." : "Extend" }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Process Payment Modal -->
    <Modal v-model="showPaymentModal" title="Process Payment" size="md">
      <form @submit.prevent="processPayment" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Amount (USDT)
          </label>
          <input
            v-model.number="paymentForm.amount"
            type="number"
            min="0"
            step="0.01"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Payment Method
          </label>
          <select
            v-model="paymentForm.paymentMethod"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="CRYPTO">USDT (Crypto)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Transaction ID (Optional)
          </label>
          <input
            v-model="paymentForm.transactionId"
            type="text"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Admin Notes
          </label>
          <textarea
            v-model="paymentForm.adminNotes"
            rows="2"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showPaymentModal = false"
            class="px-4 py-2 rounded-xl border border-dark-600 text-white hover:bg-dark-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl"
          >
            {{ isSubmitting ? "Processing..." : "Process Payment" }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Password Reset Modal -->
    <Modal v-model="showPasswordModal" title="Reset User Password" size="sm">
      <form @submit.prevent="resetPassword" class="space-y-4">
        <div class="p-4 bg-yellow-900/20 rounded-xl mb-4">
          <div class="flex items-start space-x-3">
            <svg
              class="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p class="text-sm font-medium text-yellow-200">Warning</p>
              <p class="text-sm text-yellow-300">
                This will change the user's password. Make sure to inform the
                user of their new password.
              </p>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            New Password
          </label>
          <div class="relative">
            <input
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Enter new password"
              class="w-full px-4 py-2.5 pr-12 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <svg
                v-if="showNewPassword"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            v-model="passwordForm.confirmPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="Confirm new password"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <p v-if="passwordError" class="text-sm text-red-500">
          {{ passwordError }}
        </p>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showPasswordModal = false"
            class="px-4 py-2 rounded-xl border border-dark-600 text-gray-300 hover:bg-dark-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            {{ isSubmitting ? "Resetting..." : "Reset Password" }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Edit Subscription Modal -->
    <Modal v-model="showSubscriptionModal" title="Edit Subscription" size="md">
      <form @submit.prevent="updateSubscription" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >Plan</label
            >
            <select
              v-model="subscriptionForm.plan"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="FREE">Free</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >Status</label
            >
            <select
              v-model="subscriptionForm.status"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >Price (USDT)</label
            >
            <input
              v-model.number="subscriptionForm.price"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >End Date</label
            >
            <input
              v-model="subscriptionForm.endDate"
              type="date"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              v-model="subscriptionForm.autoRenew"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span class="text-sm text-gray-300">Auto Renew</span>
          </label>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >Admin Notes</label
          >
          <textarea
            v-model="subscriptionForm.adminNotes"
            rows="2"
            placeholder="Optional notes..."
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showSubscriptionModal = false"
            class="px-4 py-2 rounded-xl border border-dark-600 text-gray-300 hover:bg-dark-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            {{ isSubmitting ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const route = useRoute();
const adminStore = useAdminStore();
const toast = useCustomToast();

const userId = route.params.id as string;

// State
const isLoading = ref(true);
const isSubmitting = ref(false);
const user = ref<any>(null);
const showEditModal = ref(false);
const showExtendModal = ref(false);
const showPaymentModal = ref(false);
const showSubscriptionModal = ref(false);
const showPasswordModal = ref(false);
const showNewPassword = ref(false);
const passwordError = ref("");
const extendDays = ref(30);

const paymentForm = reactive({
  amount: 0,
  paymentMethod: "CRYPTO",
  transactionId: "",
  adminNotes: "",
});

const passwordForm = reactive({
  newPassword: "",
  confirmPassword: "",
});

const subscriptionForm = reactive({
  plan: "MONTHLY",
  status: "ACTIVE",
  price: 0,
  endDate: "",
  autoRenew: false,
  adminNotes: "",
});

// Methods
const loadUser = async () => {
  isLoading.value = true;
  try {
    user.value = await adminStore.getUserById(userId);
  } catch (error: any) {
    toast.error(error.message || "Failed to load user");
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (date: string) => format(new Date(date), "dd MMM yyyy");
const formatDateTime = (date: string) =>
  format(new Date(date), "dd MMM yyyy HH:mm");
const formatCurrency = (value: number) => {
  return `${value.toFixed(2)} USDT`;
};

const calculateAvgVolume = () => {
  const totalVolume = user.value?.metrics?.totalVolume || 0;
  const totalTrades = user.value?._count?.tradeHistory || 0;
  if (totalTrades === 0) return "0";
  return (totalVolume / totalTrades).toLocaleString();
};

const formatRole = (role: string) => {
  const roles: Record<string, string> = {
    USER: "User",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
  };
  return roles[role] || role;
};

const formatAction = (action: string) => {
  return action
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    USER: "bg-gray-100 text-gray-600",
    ADMIN: "bg-blue-100 text-blue-600",
    SUPER_ADMIN: "bg-purple-100 text-purple-600",
  };
  return classes[role] || classes.USER;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    ACTIVE: "text-green-500",
    EXPIRED: "text-red-500",
    PENDING: "text-yellow-500",
    CANCELLED: "text-gray-500",
  };
  return colors[status] || "text-gray-500";
};

const getDaysLeftColor = (days: number | null) => {
  if (days === null) return "text-gray-500";
  if (days <= 0) return "text-red-500";
  if (days <= 3) return "text-yellow-500";
  return "text-green-500";
};

const getPaymentStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    PAID: "bg-green-100 text-green-600",
    PENDING: "bg-yellow-100 text-yellow-600",
    FAILED: "bg-red-100 text-red-600",
    REFUNDED: "bg-gray-100 text-gray-600",
  };
  return classes[status] || "bg-gray-100 text-gray-600";
};

const toggleBot = async () => {
  try {
    await adminStore.toggleUserBot(userId, !user.value.botActive);
    user.value.botActive = !user.value.botActive;
    toast.success(`Bot ${user.value.botActive ? "enabled" : "disabled"}`);
  } catch (error: any) {
    toast.error(error.message || "Failed to toggle bot");
  }
};

const sendPaymentReminder = async () => {
  try {
    await adminStore.sendPaymentReminder(userId);
    toast.success("Payment reminder sent");
  } catch (error: any) {
    toast.error(error.message || "Failed to send reminder");
  }
};

const extendSubscription = async () => {
  isSubmitting.value = true;
  try {
    await adminStore.extendSubscription(userId, extendDays.value);
    toast.success(`Subscription extended by ${extendDays.value} days`);
    showExtendModal.value = false;
    loadUser();
  } catch (error: any) {
    toast.error(error.message || "Failed to extend subscription");
  } finally {
    isSubmitting.value = false;
  }
};

const processPayment = async () => {
  isSubmitting.value = true;
  try {
    await adminStore.processPayment(userId, paymentForm as any);
    toast.success("Payment processed successfully");
    showPaymentModal.value = false;
    loadUser();
  } catch (error: any) {
    toast.error(error.message || "Failed to process payment");
  } finally {
    isSubmitting.value = false;
  }
};

const confirmResetApiKeys = async () => {
  if (!confirm("Are you sure you want to reset all API keys for this user?"))
    return;

  try {
    await adminStore.resetUserApiKeys(userId);
    toast.success("API keys reset successfully");
    loadUser();
  } catch (error: any) {
    toast.error(error.message || "Failed to reset API keys");
  }
};

const openPasswordModal = () => {
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
  passwordError.value = "";
  showNewPassword.value = false;
  showPasswordModal.value = true;
};

const resetPassword = async () => {
  passwordError.value = "";

  // Validation
  if (!passwordForm.newPassword) {
    passwordError.value = "Password is required";
    return;
  }
  if (passwordForm.newPassword.length < 6) {
    passwordError.value = "Password must be at least 6 characters";
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = "Passwords do not match";
    return;
  }

  isSubmitting.value = true;
  try {
    await adminStore.resetUserPassword(userId, passwordForm.newPassword);
    toast.success("Password reset successfully");
    showPasswordModal.value = false;
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  } catch (error: any) {
    toast.error(error.message || "Failed to reset password");
  } finally {
    isSubmitting.value = false;
  }
};

const openSubscriptionModal = () => {
  if (user.value?.subscription) {
    subscriptionForm.plan = user.value.subscription.plan || "MONTHLY";
    subscriptionForm.status = user.value.subscription.status || "ACTIVE";
    subscriptionForm.price = user.value.subscription.price || 0;
    subscriptionForm.endDate = user.value.subscription.endDate
      ? format(new Date(user.value.subscription.endDate), "yyyy-MM-dd")
      : "";
    subscriptionForm.autoRenew = user.value.subscription.autoRenew || false;
    subscriptionForm.adminNotes = "";
  }
  showSubscriptionModal.value = true;
};

const updateSubscription = async () => {
  isSubmitting.value = true;
  try {
    await adminStore.updateSubscription(userId, {
      plan: subscriptionForm.plan as any,
      status: subscriptionForm.status as any,
      price: subscriptionForm.price,
      endDate: subscriptionForm.endDate || undefined,
      autoRenew: subscriptionForm.autoRenew,
      adminNotes: subscriptionForm.adminNotes,
    });
    toast.success("Subscription updated successfully");
    showSubscriptionModal.value = false;
    loadUser();
  } catch (error: any) {
    toast.error(error.message || "Failed to update subscription");
  } finally {
    isSubmitting.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadUser();
});
</script>
