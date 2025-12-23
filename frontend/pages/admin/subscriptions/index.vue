<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Subscriptions</h1>
        <p class="text-gray-400 mt-1">Manage user subscriptions and renewals</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="sendBulkReminders"
          :disabled="expiringCount === 0"
          class="px-4 py-2 border border-dark-600 rounded-xl hover:bg-dark-800 disabled:opacity-50 transition-colors text-white"
        >
          <span class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Send Bulk Reminders</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Active</p>
            <p class="text-2xl font-bold text-green-500">{{ stats?.active || 0 }}</p>
          </div>
          <div class="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Expiring This Week</p>
            <p class="text-2xl font-bold text-yellow-500">{{ stats?.expiringThisWeek || 0 }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Expired</p>
            <p class="text-2xl font-bold text-red-500">{{ stats?.expired || 0 }}</p>
          </div>
          <div class="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Pending</p>
            <p class="text-2xl font-bold text-orange-500">{{ stats?.pending || 0 }}</p>
          </div>
          <div class="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue by Plan -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Revenue by Plan</h3>
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-gray-500">Monthly</span>
              <span class="text-sm font-medium text-white">
                {{ formatCurrency(stats?.revenueByPlan?.monthly || 0) }}
              </span>
            </div>
            <div class="w-full bg-dark-700 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full"
                :style="{ width: getRevenuePercentage('monthly') + '%' }"
              ></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-gray-500">Yearly</span>
              <span class="text-sm font-medium text-white">
                {{ formatCurrency(stats?.revenueByPlan?.yearly || 0) }}
              </span>
            </div>
            <div class="w-full bg-dark-700 rounded-full h-2">
              <div
                class="bg-purple-500 h-2 rounded-full"
                :style="{ width: getRevenuePercentage('yearly') + '%' }"
              ></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-gray-500">Custom</span>
              <span class="text-sm font-medium text-white">
                {{ formatCurrency(stats?.revenueByPlan?.custom || 0) }}
              </span>
            </div>
            <div class="w-full bg-dark-700 rounded-full h-2">
              <div
                class="bg-orange-500 h-2 rounded-full"
                :style="{ width: getRevenuePercentage('custom') + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expiring Soon List -->
      <div class="card p-6 lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Expiring Soon</h3>
          <span class="text-sm text-gray-500">Next 7 days</span>
        </div>
        
        <div v-if="expiringSubscriptions.length > 0" class="space-y-3">
          <div
            v-for="sub in expiringSubscriptions"
            :key="sub.userId"
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-dark-800 rounded-xl"
          >
            <div class="flex items-center space-x-3 min-w-0">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-medium">{{ sub.userFullName?.charAt(0) || 'U' }}</span>
              </div>
              <div class="min-w-0">
                <p class="font-medium text-white truncate">{{ sub.userFullName }}</p>
                <p class="text-sm text-gray-500 truncate">{{ sub.userEmail }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-13 sm:pl-0">
              <div class="text-left sm:text-right">
                <p
                  class="font-medium"
                  :class="sub.daysRemaining <= 1 ? 'text-red-500' : sub.daysRemaining <= 3 ? 'text-yellow-500' : 'text-white'"
                >
                  {{ sub.daysRemaining }} day{{ sub.daysRemaining !== 1 ? 's' : '' }} left
                </p>
                <p class="text-xs text-gray-500">{{ sub.plan }}</p>
              </div>
              <div class="flex items-center space-x-1">
                <button
                  @click="openExtendModal(sub)"
                  class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                  title="Extend"
                >
                  <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button
                  @click="sendReminder(sub.userId)"
                  class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                  title="Send Reminder"
                >
                  <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <NuxtLink
                  :to="`/admin/users/${sub.userId}`"
                  class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                  title="View User"
                >
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <svg class="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mt-2 text-gray-500">No subscriptions expiring soon</p>
        </div>
      </div>
    </div>

    <!-- All Subscriptions Table -->
    <div class="card overflow-hidden">
      <div class="p-4 border-b border-dark-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 class="text-lg font-semibold text-white">All Subscriptions</h3>
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <select
              v-model="filters.status"
              class="flex-1 sm:flex-none px-3 py-2 pr-8 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white appearance-none cursor-pointer bg-no-repeat bg-right min-w-[120px]"
              :style="selectDropdownStyle"
              @change="loadSubscriptions"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              v-model="filters.plan"
              class="flex-1 sm:flex-none px-3 py-2 pr-8 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white appearance-none cursor-pointer bg-no-repeat bg-right min-w-[120px]"
              :style="selectDropdownStyle"
              @change="loadSubscriptions"
            >
              <option value="">All Plans</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="CUSTOM">Custom</option>
              <option value="FREE">Free</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden divide-y divide-dark-700">
        <div
          v-for="sub in subscriptions"
          :key="sub.id + '-mobile'"
          class="p-4 hover:bg-dark-800 transition-colors"
        >
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center space-x-3 min-w-0">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-medium">{{ sub.userFullName?.charAt(0) || 'U' }}</span>
              </div>
              <div class="min-w-0">
                <p class="font-medium text-white truncate">{{ sub.userFullName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ sub.userEmail }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-1 flex-shrink-0">
              <button
                @click="openExtendModal(sub)"
                class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                title="Extend"
              >
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button
                @click="openEditModal(sub)"
                class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                title="Edit"
              >
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <NuxtLink
                :to="`/admin/users/${sub.userId}`"
                class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                title="View User"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </NuxtLink>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm pl-13">
            <div>
              <span class="text-gray-500">Plan:</span>
              <span
                class="ml-1 px-2 py-0.5 text-xs font-medium rounded-full"
                :class="getPlanBadgeClass(sub.plan)"
              >{{ sub.plan }}</span>
            </div>
            <div>
              <span class="text-gray-500">Status:</span>
              <span
                class="ml-1 px-2 py-0.5 text-xs font-medium rounded-full"
                :class="getStatusBadgeClass(sub.status)"
              >{{ sub.status }}</span>
            </div>
            <div>
              <span class="text-gray-500">Price:</span>
              <span class="ml-1 text-white">{{ formatCurrency(sub.price || 0) }}</span>
            </div>
            <div>
              <span class="text-gray-500">Days Left:</span>
              <span class="ml-1 font-medium" :class="getDaysLeftColor(sub.daysRemaining)">
                {{ sub.daysRemaining !== null ? sub.daysRemaining : '-' }}
              </span>
            </div>
            <div class="col-span-2">
              <span class="text-gray-500">End Date:</span>
              <span class="ml-1 text-gray-400">{{ sub.endDate ? formatDate(sub.endDate) : '-' }}</span>
            </div>
          </div>
        </div>
        <div v-if="subscriptions.length === 0 && !isLoading" class="px-6 py-12 text-center text-gray-500">
          No subscriptions found
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-dark-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Plan</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">End Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Days Left</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-700">
            <tr
              v-for="sub in subscriptions"
              :key="sub.id"
              class="hover:bg-dark-800 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ sub.userFullName?.charAt(0) || 'U' }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">{{ sub.userFullName }}</p>
                    <p class="text-xs text-gray-500">{{ sub.userEmail }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="getPlanBadgeClass(sub.plan)"
                >
                  {{ sub.plan }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="getStatusBadgeClass(sub.status)"
                >
                  {{ sub.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-white">
                {{ formatCurrency(sub.price || 0) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ sub.endDate ? formatDate(sub.endDate) : '-' }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-sm font-medium"
                  :class="getDaysLeftColor(sub.daysRemaining)"
                >
                  {{ sub.daysRemaining !== null ? sub.daysRemaining : '-' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="openExtendModal(sub)"
                    class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                    title="Extend"
                  >
                    <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button
                    @click="openEditModal(sub)"
                    class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                    title="Edit"
                  >
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <NuxtLink
                    :to="`/admin/users/${sub.userId}`"
                    class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                    title="View User"
                  >
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </NuxtLink>
                </div>
              </td>
            </tr>
            <tr v-if="subscriptions.length === 0 && !isLoading">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                No subscriptions found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Extend Modal -->
    <Modal v-model="showExtendModal" title="Extend Subscription" size="sm">
      <form @submit.prevent="extendSubscription" class="space-y-4">
        <div v-if="selectedSub" class="p-4 bg-dark-800 rounded-xl mb-4">
          <p class="font-medium text-white">{{ selectedSub.userFullName }}</p>
          <p class="text-sm text-gray-500">Current plan: {{ selectedSub.plan }}</p>
          <p class="text-sm text-gray-500">
            Expires: {{ selectedSub.endDate ? formatDate(selectedSub.endDate) : 'N/A' }}
          </p>
        </div>
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
            class="px-4 py-2 rounded-xl border border-dark-600 text-gray-300 hover:bg-dark-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            {{ isSubmitting ? 'Processing...' : 'Extend' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Edit Subscription Modal -->
    <Modal v-model="showEditModal" title="Edit Subscription" size="md">
      <form @submit.prevent="updateSubscription" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Plan</label>
            <select
              v-model="editForm.plan"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="FREE">Free</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              v-model="editForm.status"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Price</label>
            <input
              v-model.number="editForm.price"
              type="number"
              min="0"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">End Date</label>
            <input
              v-model="editForm.endDate"
              type="date"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              v-model="editForm.autoRenew"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span class="text-sm text-gray-300">Auto Renew</span>
          </label>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Admin Notes</label>
          <textarea
            v-model="editForm.adminNotes"
            rows="2"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showEditModal = false"
            class="px-4 py-2 rounded-xl border border-dark-600 text-gray-300 hover:bg-dark-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const adminStore = useAdminStore()
const toast = useCustomToast()

// State
const isLoading = ref(false)
const isSubmitting = ref(false)
const stats = ref<any>(null)
const subscriptions = ref<any[]>([])
const expiringSubscriptions = ref<any[]>([])
const selectedSub = ref<any>(null)
const showExtendModal = ref(false)
const showEditModal = ref(false)
const extendDays = ref(30)

const filters = reactive({
  status: '',
  plan: ''
})

const editForm = reactive({
  plan: '',
  status: '',
  price: 0,
  endDate: '',
  autoRenew: false,
  adminNotes: ''
})

// Computed
const expiringCount = computed(() => expiringSubscriptions.value.length)

const selectDropdownStyle = computed(() => ({
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
  backgroundSize: '1.25rem',
  backgroundPosition: 'right 0.5rem center'
}))

// Methods
const loadData = async () => {
  isLoading.value = true
  try {
    // Load stats
    stats.value = await adminStore.getSubscriptionAnalytics()
    
    // Load expiring subscriptions
    expiringSubscriptions.value = await adminStore.getExpiringSubscriptions()
    
    // Load all subscriptions
    await loadSubscriptions()
  } catch (error: any) {
    toast.error(error.message || 'Failed to load data')
  } finally {
    isLoading.value = false
  }
}

const loadSubscriptions = async () => {
  try {
    const params: any = {
      page: 1,
      limit: 50,
      sortBy: 'endDate',
      sortOrder: 'asc'
    }
    
    if (filters.status) params.subscriptionStatus = filters.status
    
    const response = await adminStore.getUsers(params)
    
    subscriptions.value = (response.users || [])
      .filter((u: any) => u.subscription)
      .filter((u: any) => !filters.plan || u.subscription.plan === filters.plan)
      .map((u: any) => ({
        ...u.subscription,
        userId: u.id,
        userFullName: u.fullName,
        userEmail: u.email
      }))
  } catch (error: any) {
    toast.error(error.message || 'Failed to load subscriptions')
  }
}

const formatDate = (date: string) => format(new Date(date), 'dd MMM yyyy')

const formatCurrency = (value: number) => {
  return `${value.toFixed(2)} USDT`
}

const getPlanBadgeClass = (plan: string) => {
  const classes: Record<string, string> = {
    MONTHLY: 'bg-blue-900/30 text-blue-400',
    YEARLY: 'bg-purple-900/30 text-purple-400',
    CUSTOM: 'bg-orange-900/30 text-orange-400',
    FREE: 'bg-gray-900/30 text-gray-400'
  }
  return classes[plan] || classes.FREE
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    ACTIVE: 'bg-green-900/30 text-green-400',
    EXPIRED: 'bg-red-900/30 text-red-400',
    PENDING: 'bg-yellow-900/30 text-yellow-400',
    CANCELLED: 'bg-gray-900/30 text-gray-400',
    SUSPENDED: 'bg-orange-900/30 text-orange-400'
  }
  return classes[status] || 'bg-gray-900/30 text-gray-400'
}

const getDaysLeftColor = (days: number | null) => {
  if (days === null) return 'text-gray-500'
  if (days <= 0) return 'text-red-500'
  if (days <= 3) return 'text-yellow-500'
  if (days <= 7) return 'text-orange-500'
  return 'text-green-500'
}

const getRevenuePercentage = (plan: string) => {
  if (!stats.value?.revenueByPlan) return 0
  const total = (stats.value.revenueByPlan.monthly || 0) + 
                (stats.value.revenueByPlan.yearly || 0) + 
                (stats.value.revenueByPlan.custom || 0)
  if (total === 0) return 0
  return ((stats.value.revenueByPlan[plan] || 0) / total * 100).toFixed(0)
}

const openExtendModal = (sub: any) => {
  selectedSub.value = sub
  extendDays.value = 30
  showExtendModal.value = true
}

const openEditModal = (sub: any) => {
  selectedSub.value = sub
  editForm.plan = sub.plan
  editForm.status = sub.status
  editForm.price = sub.price || 0
  editForm.endDate = sub.endDate ? format(new Date(sub.endDate), 'yyyy-MM-dd') : ''
  editForm.autoRenew = sub.autoRenew || false
  editForm.adminNotes = sub.adminNotes || ''
  showEditModal.value = true
}

const extendSubscription = async () => {
  if (!selectedSub.value) return
  
  isSubmitting.value = true
  try {
    await adminStore.extendSubscription(selectedSub.value.userId, extendDays.value)
    toast.success(`Subscription extended by ${extendDays.value} days`)
    showExtendModal.value = false
    loadData()
  } catch (error: any) {
    toast.error(error.message || 'Failed to extend subscription')
  } finally {
    isSubmitting.value = false
  }
}

const updateSubscription = async () => {
  if (!selectedSub.value) return
  
  isSubmitting.value = true
  try {
    await adminStore.updateSubscription(selectedSub.value.userId, {
      plan: editForm.plan as any,
      status: editForm.status as any,
      price: editForm.price,
      endDate: editForm.endDate || undefined,
      autoRenew: editForm.autoRenew,
      adminNotes: editForm.adminNotes
    })
    toast.success('Subscription updated')
    showEditModal.value = false
    loadData()
  } catch (error: any) {
    toast.error(error.message || 'Failed to update subscription')
  } finally {
    isSubmitting.value = false
  }
}

const sendReminder = async (userId: string) => {
  try {
    await adminStore.sendPaymentReminder(userId)
    toast.success('Reminder sent')
  } catch (error: any) {
    toast.error(error.message || 'Failed to send reminder')
  }
}

const sendBulkReminders = async () => {
  if (!confirm(`Send payment reminders to ${expiringCount.value} users?`)) return
  
  try {
    for (const sub of expiringSubscriptions.value) {
      await adminStore.sendPaymentReminder(sub.userId)
    }
    toast.success(`Reminders sent to ${expiringCount.value} users`)
  } catch (error: any) {
    toast.error(error.message || 'Failed to send reminders')
  }
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>