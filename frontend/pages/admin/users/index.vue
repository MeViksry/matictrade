<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Users Management</h1>
        <p class="text-gray-400 mt-1">Manage all registered users</p>
      </div>
      <NuxtLink
        to="/admin/users/create"
        class="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add User</span>
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="lg:col-span-2">
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by name, email, username..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              @input="debouncedSearch"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Role Filter -->
        <select
          v-model="filters.role"
          class="px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          @change="loadUsers"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>

        <!-- Status Filter -->
        <select
          v-model="filters.isActive"
          class="px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          @change="loadUsers"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <!-- Subscription Status -->
        <select
          v-model="filters.subscriptionStatus"
          class="px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          @change="loadUsers"
        >
          <option value="">All Subscriptions</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-dark-700">
        <span class="text-sm text-gray-500">Active filters:</span>
        <span
          v-if="filters.search"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-900/30 text-primary-400"
        >
          Search: {{ filters.search }}
          <button @click="filters.search = ''; loadUsers()" class="ml-2 hover:text-primary-900">×</button>
        </span>
        <span
          v-if="filters.role"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400"
        >
          Role: {{ filters.role }}
          <button @click="filters.role = ''; loadUsers()" class="ml-2 hover:text-blue-900">×</button>
        </span>
        <span
          v-if="filters.isActive !== ''"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400"
        >
          Status: {{ filters.isActive === 'true' ? 'Active' : 'Inactive' }}
          <button @click="filters.isActive = ''; loadUsers()" class="ml-2 hover:text-green-900">×</button>
        </span>
        <span
          v-if="filters.subscriptionStatus"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400"
        >
          Subscription: {{ filters.subscriptionStatus }}
          <button @click="filters.subscriptionStatus = ''; loadUsers()" class="ml-2 hover:text-purple-900">×</button>
        </span>
        <button
          @click="clearFilters"
          class="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card overflow-hidden">
      <!-- Mobile Card View -->
      <div class="md:hidden divide-y divide-dark-700">
        <div
          v-for="user in users"
          :key="user.id + '-mobile'"
          class="p-4 hover:bg-dark-800 transition-colors"
        >
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center space-x-3 min-w-0">
              <div class="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden">
                <img 
                  v-if="user.profile?.avatar" 
                  :src="user.profile.avatar" 
                  :alt="user.fullName"
                  class="w-full h-full object-cover"
                />
                <div 
                  v-else
                  class="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
                >
                  <span class="text-white font-medium text-lg">
                    {{ user.fullName?.charAt(0) || 'U' }}
                  </span>
                </div>
              </div>
              <div class="min-w-0">
                <p class="font-medium text-white truncate">{{ user.fullName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                <p class="text-xs text-gray-400">@{{ user.username }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-1 flex-shrink-0">
              <NuxtLink
                :to="`/admin/users/${user.id}`"
                class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </NuxtLink>
              <button
                @click="openEditModal(user)"
                class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-gray-500">Role:</span>
              <span
                class="ml-1 px-2 py-0.5 text-xs font-medium rounded-full"
                :class="getRoleBadgeClass(user.role)"
              >{{ formatRole(user.role) }}</span>
            </div>
            <div>
              <span class="text-gray-500">Status:</span>
              <span class="ml-1 inline-flex items-center">
                <span class="w-2 h-2 rounded-full mr-1" :class="user.isActive ? 'bg-green-500' : 'bg-gray-400'"></span>
                <span :class="user.isActive ? 'text-green-500' : 'text-gray-500'">{{ user.isActive ? 'Active' : 'Inactive' }}</span>
              </span>
            </div>
            <div>
              <span class="text-gray-500">Subscription:</span>
              <span v-if="user.subscription" class="ml-1 px-2 py-0.5 text-xs font-medium rounded-full" :class="getPlanBadgeClass(user.subscription.plan)">
                {{ user.subscription.plan }}
              </span>
              <span v-else class="ml-1 text-gray-400">None</span>
            </div>
            <div>
              <span class="text-gray-500">Bot:</span>
              <button
                @click="toggleBot(user)"
                class="ml-1 relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                :class="user.botActive ? 'bg-green-500' : 'bg-dark-600'"
              >
                <span
                  class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform"
                  :class="user.botActive ? 'translate-x-5' : 'translate-x-1'"
                />
              </button>
            </div>
            <div class="col-span-2">
              <span class="text-gray-500">Joined:</span>
              <span class="ml-1 text-gray-400">{{ formatDate(user.createdAt) }}</span>
            </div>
          </div>
        </div>
        <div v-if="users.length === 0 && !isLoading" class="px-6 py-12 text-center text-gray-500">
          No users found
        </div>
        <div v-if="isLoading" class="px-6 py-12 text-center">
          <svg class="w-6 h-6 mx-auto animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span class="mt-2 block text-gray-500">Loading users...</span>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto -mx-px">
        <table class="w-full min-w-[900px]">
          <thead class="bg-dark-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <button @click="toggleSort('fullName')" class="flex items-center space-x-1 hover:text-gray-700">
                  <span>User</span>
                  <AdminSortIcon :active="filters.sortBy === 'fullName'" :direction="filters.sortOrder" />
                </button>
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <button @click="toggleSort('role')" class="flex items-center space-x-1 hover:text-gray-700">
                  <span>Role</span>
                  <AdminSortIcon :active="filters.sortBy === 'role'" :direction="filters.sortOrder" />
                </button>
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Subscription
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Bot
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <button @click="toggleSort('createdAt')" class="flex items-center space-x-1 hover:text-gray-700">
                  <span>Joined</span>
                  <AdminSortIcon :active="filters.sortBy === 'createdAt'" :direction="filters.sortOrder" />
                </button>
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-700">
            <tr
              v-for="user in users"
              :key="user.id"
              class="hover:bg-dark-800 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <!-- User Avatar with Photo Support -->
                  <div class="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                    <img 
                      v-if="user.profile?.avatar" 
                      :src="user.profile.avatar" 
                      :alt="user.fullName"
                      class="w-full h-full object-cover"
                      @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
                    />
                    <div 
                      v-if="!user.profile?.avatar"
                      class="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
                    >
                      <span class="text-white font-medium">
                        {{ user.fullName?.charAt(0) || 'U' }}
                      </span>
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-white truncate">
                      {{ user.fullName }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                    <p class="text-xs text-gray-400">@{{ user.username }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="getRoleBadgeClass(user.role)"
                >
                  {{ formatRole(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div v-if="user.subscription">
                  <span
                    class="px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="getPlanBadgeClass(user.subscription.plan)"
                  >
                    {{ user.subscription.plan }}
                  </span>
                  <p class="text-xs text-gray-500 mt-1">
                    <span v-if="user.subscription.daysRemaining !== null">
                      <span v-if="user.subscription.daysRemaining > 0" :class="user.subscription.isExpiringSoon ? 'text-yellow-500' : ''">
                        {{ user.subscription.daysRemaining }} days left
                      </span>
                      <span v-else class="text-red-500">Expired</span>
                    </span>
                  </p>
                </div>
                <span v-else class="text-xs text-gray-400">No subscription</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="user.isActive ? 'bg-green-500' : 'bg-gray-400'"
                  ></span>
                  <span class="text-sm" :class="user.isActive ? 'text-green-600' : 'text-gray-500'">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <p v-if="user.lastLoginAt" class="text-xs text-gray-400 mt-1">
                  Last login: {{ formatDate(user.lastLoginAt) }}
                </p>
              </td>
              <td class="px-6 py-4">
                <button
                  @click="toggleBot(user)"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  :class="user.botActive ? 'bg-green-500' : 'bg-dark-600'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="user.botActive ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-white">{{ formatDate(user.createdAt) }}</p>
                <p class="text-xs text-gray-500">{{ formatTime(user.createdAt) }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end space-x-2">
                  <NuxtLink
                    :to="`/admin/users/${user.id}`"
                    class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                    title="View Details"
                  >
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </NuxtLink>
                  <button
                    @click="openEditModal(user)"
                    class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                    title="Edit User"
                  >
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                    :title="user.isActive ? 'Deactivate User' : 'Activate User'"
                  >
                    <svg
                      class="w-5 h-5"
                      :class="user.isActive ? 'text-yellow-500' : 'text-green-500'"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        v-if="user.isActive"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                      <path
                        v-else
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  <button
                    v-if="authStore.user?.role === 'SUPER_ADMIN'"
                    @click="confirmDelete(user)"
                    class="p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                    title="Delete User"
                  >
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="users.length === 0 && !isLoading">
              <td colspan="7" class="px-6 py-12 text-center">
                <svg class="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p class="mt-4 text-gray-500">No users found</p>
                <NuxtLink
                  to="/admin/users/create"
                  class="inline-flex items-center mt-4 text-primary-500 hover:text-primary-600"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add your first user
                </NuxtLink>
              </td>
            </tr>

            <!-- Loading State -->
            <tr v-if="isLoading">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span class="text-gray-500">Loading users...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-dark-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-500">
          Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
          {{ pagination.total }} users
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="goToPage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-2 rounded-lg border border-dark-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-800 transition-colors text-white"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="goToPage(page as number)"
              class="px-4 py-2 rounded-lg border transition-colors"
              :class="pagination.page === page 
                ? 'bg-primary-500 text-white border-primary-500' 
                : 'border-dark-600 hover:bg-dark-800 text-white'"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-gray-400">...</span>
          </template>
          
          <button
            @click="goToPage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-3 py-2 rounded-lg border border-dark-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-800 transition-colors text-white"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <Modal v-model="showEditModal" title="Edit User" size="lg">
      <form @submit.prevent="updateUser" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              v-model="editForm.fullName"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Phone
            </label>
            <input
              v-model="editForm.phone"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Address
          </label>
          <textarea
            v-model="editForm.address"
            rows="2"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Role
            </label>
            <select
              v-model="editForm.role"
              :disabled="authStore.user?.role !== 'SUPER_ADMIN'"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <div class="flex items-center space-x-6 pt-6">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                v-model="editForm.isActive"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-300">Active</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                v-model="editForm.botActive"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-300">Bot Active</span>
            </label>
          </div>
        </div>
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="showEditModal = false"
            class="px-4 py-2 rounded-xl border border-dark-600 hover:bg-dark-800 transition-colors text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Delete User" size="sm">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">
          Delete User
        </h3>
        <p class="text-gray-500 mb-6">
          Are you sure you want to delete <strong>{{ selectedUser?.fullName }}</strong>? 
          This action cannot be undone and all user data will be permanently removed.
        </p>
        <div class="flex justify-center space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 rounded-xl border border-dark-600 hover:bg-dark-800 transition-colors text-white"
          >
            Cancel
          </button>
          <button
            @click="deleteUser"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            {{ isSubmitting ? 'Deleting...' : 'Delete User' }}
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

const authStore = useAuthStore()
const adminStore = useAdminStore()
const toast = useCustomToast()

// State
const isLoading = ref(false)
const isSubmitting = ref(false)
const users = ref<any[]>([])
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref<any>(null)

// Filters
const filters = reactive({
  search: '',
  role: '',
  isActive: '',
  subscriptionStatus: '',
  sortBy: 'createdAt',
  sortOrder: 'desc' as 'asc' | 'desc'
})

// Pagination
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

// Edit Form
const editForm = reactive({
  fullName: '',
  phone: '',
  address: '',
  role: 'USER',
  isActive: true,
  botActive: false
})

// Computed
const hasActiveFilters = computed(() => {
  return filters.search || filters.role || filters.isActive !== '' || filters.subscriptionStatus
})

const visiblePages = computed(() => {
  const total = pagination.totalPages
  const current = pagination.page
  const pages: (number | string)[] = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  
  return pages
})

// Methods
const loadUsers = async () => {
  isLoading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    }
    
    if (filters.search) params.search = filters.search
    if (filters.role) params.role = filters.role
    if (filters.isActive !== '') params.isActive = filters.isActive === 'true'
    if (filters.subscriptionStatus) params.subscriptionStatus = filters.subscriptionStatus
    
    const response = await adminStore.getUsers(params)
    users.value = response.users || []
    pagination.total = response.total || 0
    pagination.totalPages = response.totalPages || 0
  } catch (error: any) {
    toast.error(error.message || 'Failed to load users')
  } finally {
    isLoading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  pagination.page = 1
  loadUsers()
}, 300)

const toggleSort = (field: string) => {
  if (filters.sortBy === field) {
    filters.sortOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc'
  } else {
    filters.sortBy = field
    filters.sortOrder = 'desc'
  }
  loadUsers()
}

const goToPage = (page: number) => {
  if (page < 1 || page > pagination.totalPages) return
  pagination.page = page
  loadUsers()
}

const clearFilters = () => {
  filters.search = ''
  filters.role = ''
  filters.isActive = ''
  filters.subscriptionStatus = ''
  pagination.page = 1
  loadUsers()
}

const formatDate = (date: string) => format(new Date(date), 'dd MMM yyyy')
const formatTime = (date: string) => format(new Date(date), 'HH:mm')

const formatRole = (role: string) => {
  const roles: Record<string, string> = {
    USER: 'User',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin'
  }
  return roles[role] || role
}

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    USER: 'bg-gray-800 text-gray-400',
    ADMIN: 'bg-blue-900/30 text-blue-400',
    SUPER_ADMIN: 'bg-purple-900/30 text-purple-400'
  }
  return classes[role] || classes.USER
}

const getPlanBadgeClass = (plan: string) => {
  const classes: Record<string, string> = {
    MONTHLY: 'bg-blue-900/30 text-blue-400',
    YEARLY: 'bg-purple-900/30 text-purple-400',
    CUSTOM: 'bg-orange-900/30 text-orange-400',
    FREE: 'bg-gray-800 text-gray-400'
  }
  return classes[plan] || classes.FREE
}

const openEditModal = (user: any) => {
  selectedUser.value = user
  editForm.fullName = user.fullName
  editForm.phone = user.phone || ''
  editForm.address = user.address || ''
  editForm.role = user.role
  editForm.isActive = user.isActive
  editForm.botActive = user.botActive
  showEditModal.value = true
}

const updateUser = async () => {
  if (!selectedUser.value) return
  
  isSubmitting.value = true
  try {
    await adminStore.updateUser(selectedUser.value.id, {
      fullName: editForm.fullName,
      phone: editForm.phone,
      address: editForm.address,
      role: editForm.role as any,
      isActive: editForm.isActive,
      botActive: editForm.botActive
    })
    toast.success('User updated successfully')
    showEditModal.value = false
    loadUsers()
  } catch (error: any) {
    toast.error(error.message || 'Failed to update user')
  } finally {
    isSubmitting.value = false
  }
}

const toggleUserStatus = async (user: any) => {
  try {
    if (user.isActive) {
      await adminStore.deactivateUser(user.id)
      toast.success('User deactivated')
    } else {
      await adminStore.activateUser(user.id)
      toast.success('User activated')
    }
    loadUsers()
  } catch (error: any) {
    toast.error(error.message || 'Failed to update user status')
  }
}

const toggleBot = async (user: any) => {
  try {
    await adminStore.toggleUserBot(user.id, !user.botActive)
    toast.success(`Bot ${!user.botActive ? 'enabled' : 'disabled'} for ${user.fullName}`)
    loadUsers()
  } catch (error: any) {
    toast.error(error.message || 'Failed to toggle bot')
  }
}

const confirmDelete = (user: any) => {
  selectedUser.value = user
  showDeleteModal.value = true
}

const deleteUser = async () => {
  if (!selectedUser.value) return
  
  isSubmitting.value = true
  try {
    await adminStore.deleteUser(selectedUser.value.id)
    toast.success('User deleted successfully')
    showDeleteModal.value = false
    loadUsers()
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete user')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>