<template>
  <div class="min-h-screen bg-dark-950">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-700 transform transition-transform duration-300 lg:translate-x-0 flex flex-col',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-dark-700">
        <NuxtLink to="/admin" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <img src="/logo.png" alt="Logo" class="w-6 h-6 object-contain" />
          </div>
          <div>
            <span class="text-lg font-bold text-white">MaticTrade</span>
            <span class="block text-xs text-primary-500 font-medium">Admin Panel</span>
          </div>
        </NuxtLink>
        <button
          @click="sidebarOpen = false"
          class="lg:hidden p-1 rounded-lg hover:bg-dark-800"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div v-for="section in navigation" :key="section.title" class="mb-6">
          <h3 class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {{ section.title }}
          </h3>
          <NuxtLink
            v-for="item in section.items"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
            :class="[
              isActive(item.path)
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'text-gray-400 hover:bg-dark-800 hover:text-white'
            ]"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 mr-3 transition-colors"
              :class="isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'"
            />
            {{ item.name }}
            <span
              v-if="item.badge"
              class="ml-auto px-2 py-0.5 text-xs font-medium rounded-full"
              :class="item.badgeColor || 'bg-primary-900/30 text-primary-400'"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
        </div>
      </nav>

      <!-- User Info -->
      <div class="p-4 border-t border-dark-700">
        <div class="flex items-center space-x-3 p-3 rounded-xl bg-dark-800">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
            <span class="text-white font-medium">
              {{ authStore.user?.fullName?.charAt(0) || 'A' }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">
              {{ authStore.user?.fullName }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ authStore.user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin' }}
            </p>
          </div>
          <button
            @click="handleLogout"
            class="p-2 rounded-lg hover:bg-dark-700 transition-colors"
            title="Logout"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Top Header -->
      <header class="sticky top-0 z-30 h-16 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700">
        <div class="flex items-center justify-between h-full px-4 sm:px-6">
          <!-- Left: Mobile menu + Breadcrumb -->
          <div class="flex items-center space-x-4">
            <button
              @click="sidebarOpen = true"
              class="lg:hidden p-2 rounded-xl hover:bg-dark-800"
            >
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <!-- Breadcrumb -->
            <nav class="hidden sm:flex items-center space-x-2 text-sm">
              <NuxtLink to="/admin" class="text-gray-500 hover:text-gray-300">
                Admin
              </NuxtLink>
              <span v-if="currentPage" class="text-gray-400">/</span>
              <span v-if="currentPage" class="text-white font-medium">
                {{ currentPage }}
              </span>
            </nav>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center space-x-3">
            <!-- Search -->
            <div class="hidden md:flex items-center">
              <div class="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  class="w-64 pl-10 pr-4 py-2 rounded-xl border border-dark-600 bg-dark-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <!-- Notifications -->
            <div class="relative" ref="notificationRef">
              <button
                @click="showNotifications = !showNotifications"
                class="relative p-2 rounded-xl hover:bg-dark-800 transition-colors"
              >
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span
                  v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center"
                >
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
              </button>

              <!-- Notification Dropdown -->
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 bg-dark-800 rounded-2xl shadow-xl border border-dark-700 overflow-hidden"
                >
                  <div class="px-4 py-3 border-b border-dark-700 flex items-center justify-between">
                    <h3 class="font-semibold text-white">Notifications</h3>
                    <button
                      v-if="unreadCount > 0"
                      @click="markAllAsRead"
                      class="text-xs text-primary-500 hover:text-primary-600"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div class="max-h-80 overflow-y-auto">
                    <div
                      v-for="notification in notifications.slice(0, 5)"
                      :key="notification.id"
                      class="px-4 py-3 hover:bg-dark-700 cursor-pointer border-b border-dark-700 last:border-0"
                      :class="{ 'bg-primary-900/10': !notification.isRead }"
                    >
                      <div class="flex items-start space-x-3">
                        <div
                          class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          :class="getNotificationColor(notification.type)"
                        >
                          <component :is="getNotificationIcon(notification.type)" class="w-4 h-4" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-white">
                            {{ notification.title }}
                          </p>
                          <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {{ notification.message }}
                          </p>
                          <p class="text-xs text-gray-400 mt-1">
                            {{ formatTime(notification.createdAt) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div v-if="notifications.length === 0" class="px-4 py-8 text-center">
                      <svg class="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p class="mt-2 text-sm text-gray-500">No notifications</p>
                    </div>
                  </div>
                  <div class="px-4 py-3 border-t border-dark-700">
                    <NuxtLink
                      to="/admin/notifications"
                      class="block text-center text-sm text-primary-500 hover:text-primary-600 font-medium"
                      @click="showNotifications = false"
                    >
                      View all notifications
                    </NuxtLink>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Quick Actions -->
            <button
              @click="showQuickActions = true"
              class="hidden sm:flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-sm font-medium">Quick Action</span>
            </button>

            <!-- Back to Dashboard -->
            <NuxtLink
              to="/dashboard"
              class="p-2 rounded-xl hover:bg-dark-800 transition-colors"
              title="Back to User Dashboard"
            >
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- Quick Actions Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showQuickActions" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            class="w-full max-w-md bg-dark-800 rounded-2xl shadow-xl"
            @click.stop
          >
            <div class="px-6 py-4 border-b border-dark-700 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-white">Quick Actions</h3>
              <button
                @click="showQuickActions = false"
                class="p-1 rounded-lg hover:bg-dark-700"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-4 grid grid-cols-2 gap-3">
              <NuxtLink
                v-for="action in quickActions"
                :key="action.path"
                :to="action.path"
                class="flex flex-col items-center p-4 rounded-xl border border-dark-600 hover:border-primary-500 hover:bg-primary-900/10 transition-all"
                @click="showQuickActions = false"
              >
                <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-2', action.color]">
                  <component :is="action.icon" class="w-6 h-6 text-white" />
                </div>
                <span class="text-sm font-medium text-white">{{ action.name }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { formatDistanceToNow } from 'date-fns'

// Icons
import IconDashboard from '~/components/icons/IconChart.vue'
import IconUsers from '~/components/icons/IconActivity.vue'
import IconSubscription from '~/components/icons/IconWallet.vue'
import IconPayment from '~/components/icons/IconExchange.vue'
import IconAnalytics from '~/components/icons/IconAnalytics.vue'
import IconLogs from '~/components/icons/IconDocument.vue'
import IconSettings from '~/components/icons/IconLock.vue'
import IconSystem from '~/components/icons/IconShield.vue'
import IconWarning from '~/components/icons/IconWarning.vue'
import IconCheck from '~/components/icons/IconCheck.vue'

// Middleware is handled in individual page files that use this layout

const authStore = useAuthStore()
const adminStore = useAdminStore()
const route = useRoute()

const sidebarOpen = ref(false)
const showNotifications = ref(false)
const showQuickActions = ref(false)
const notificationRef = ref<HTMLElement | null>(null)

// Navigation item interface
interface NavItem {
  name: string
  path: string
  icon: any
  badge?: string | number | null
  badgeColor?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

// Navigation items
const navigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin', icon: IconDashboard },
      { name: 'Analytics', path: '/admin/analytics', icon: IconAnalytics },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Users', path: '/admin/users', icon: IconUsers, badge: null },
      { name: 'Chats', path: '/admin/chats', icon: IconLogs },
      { name: 'Blog', path: '/admin/blog', icon: IconLogs },
      { name: 'Subscriptions', path: '/admin/subscriptions', icon: IconSubscription },
      { name: 'Payments', path: '/admin/payments', icon: IconPayment },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Activity Logs', path: '/admin/logs', icon: IconLogs },
      { name: 'System Health', path: '/admin/system', icon: IconSystem },
      { name: 'Settings', path: '/admin/settings', icon: IconSettings },
    ]
  }
]

// Quick Actions
const quickActions = [
  { name: 'Add User', path: '/admin/users/create', icon: IconUsers, color: 'bg-blue-500' },
  { name: 'View Payments', path: '/admin/payments', icon: IconPayment, color: 'bg-green-500' },
  { name: 'Check System', path: '/admin/system', icon: IconSystem, color: 'bg-purple-500' },
  { name: 'View Logs', path: '/admin/logs', icon: IconLogs, color: 'bg-orange-500' },
]

// Computed
const currentPage = computed(() => {
  const path = route.path
  if (path === '/admin') return null
  const segments = path.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  if (!lastSegment) return null
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
})

const notifications = computed(() => adminStore.notifications || [])
const unreadCount = computed(() => adminStore.unreadNotifications?.length || 0)

// Methods
const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  authStore.logout()
}

const markAllAsRead = async () => {
  await adminStore.markAllNotificationsAsRead()
}

const formatTime = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

const getNotificationColor = (type: string) => {
  const colors: Record<string, string> = {
    'SUBSCRIPTION_EXPIRING': 'bg-yellow-100 text-yellow-600',
    'SUBSCRIPTION_EXPIRED': 'bg-red-100 text-red-600',
    'PAYMENT_REMINDER': 'bg-blue-100 text-blue-600',
    'SUCCESS': 'bg-green-100 text-green-600',
    'WARNING': 'bg-orange-100 text-orange-600',
    'ERROR': 'bg-red-100 text-red-600',
    'INFO': 'bg-blue-100 text-blue-600',
    'SYSTEM': 'bg-purple-100 text-purple-600',
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
}

const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    'SUBSCRIPTION_EXPIRING': IconWarning,
    'SUBSCRIPTION_EXPIRED': IconWarning,
    'PAYMENT_REMINDER': IconPayment,
    'SUCCESS': IconCheck,
    'WARNING': IconWarning,
    'ERROR': IconWarning,
    'INFO': IconLogs,
    'SYSTEM': IconSystem,
  }
  return icons[type] || IconLogs
}

// Load notifications on mount
onMounted(async () => {
  try {
    await adminStore.getNotifications()
  } catch (error) {
    console.error('Failed to load notifications:', error)
  }
})

// Close notification dropdown when clicking outside
onClickOutside(notificationRef, () => {
  showNotifications.value = false
})

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>