<!-- frontend/components/UserNotificationBell.vue -->
<template>
  <div class="relative" ref="bellRef">
    <button
      @click="toggleDropdown"
      class="p-2 rounded-xl text-gray-400 hover:bg-dark-800 transition-colors relative"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      <span 
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>
    
    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-if="dropdownOpen"
        class="fixed left-4 right-4 top-20 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-80 bg-dark-800 rounded-xl shadow-2xl border border-dark-700 z-50 max-h-[80vh] sm:max-h-[500px] overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div class="p-3 sm:p-4 border-b border-dark-700">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-semibold text-white text-sm sm:text-base">Notifications</h3>
            <button 
              v-if="unreadCount > 0"
              @click="handleMarkAllAsRead"
              class="text-xs sm:text-sm text-primary-400 hover:text-primary-300 whitespace-nowrap"
            >
              Mark all read
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="max-h-[60vh] sm:max-h-80 overflow-y-auto">
          <div v-if="notificationStore.loading" class="p-6 text-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
          </div>
          
          <div v-else-if="notifications.length === 0" class="p-6 text-center">
            <svg class="w-10 h-10 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <p class="text-gray-400 text-sm">No notifications</p>
          </div>
          
          <div v-else>
            <div 
              v-for="notification in notifications.slice(0, 5)"
              :key="notification.id"
              :class="[
                'p-3 border-b border-dark-700 hover:bg-dark-700/50 transition-colors',
                !notification.isRead ? 'bg-blue-900/10' : ''
              ]"
            >
              <div class="flex items-start gap-2 sm:gap-3">
                <div 
                  :class="getNotificationIconClass(notification.type)"
                  class="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <component :is="getNotificationIcon(notification.type)" class="h-4 w-4" />
                </div>
                
                <div class="flex-1 min-w-0">
                  <div 
                    class="cursor-pointer"
                    @click="toggleExpand(notification.id)"
                  >
                    <p class="text-xs sm:text-sm font-medium text-white flex items-center gap-1.5 flex-wrap">
                      <span class="truncate">{{ notification.title }}</span>
                      <span v-if="!notification.isRead" class="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0"></span>
                    </p>
                    <p 
                      :class="[
                        'text-xs sm:text-sm text-gray-400 mt-0.5',
                        expandedId !== notification.id ? 'line-clamp-2' : ''
                      ]"
                    >
                      {{ notification.message }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatTime(notification.createdAt) }}
                    </p>
                  </div>
                  
                  <!-- Actions inline -->
                  <div class="flex items-center gap-2 mt-2">
                    <button
                      v-if="!notification.isRead"
                      @click.stop="handleMarkAsRead(notification.id)"
                      class="text-xs text-primary-400 hover:text-primary-300"
                    >
                      Mark read
                    </button>
                    <button
                      @click.stop="handleDelete(notification.id)"
                      class="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div v-if="notifications.length > 0" class="p-3 border-t border-dark-700">
          <NuxtLink
            to="/dashboard/notifications"
            @click="closeDropdown"
            class="block w-full text-center py-2 text-xs sm:text-sm text-primary-400 hover:text-primary-300 font-medium rounded-lg hover:bg-dark-700 transition-colors"
          >
            View all notifications
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/vue/24/solid'
import { useUserNotificationStore } from '~/stores/userNotification'
import type { Notification, NotificationType } from '~/types'

const notificationStore = useUserNotificationStore()

const bellRef = ref<HTMLElement | null>(null)
const dropdownOpen = ref(false)
const expandedId = ref<string | null>(null)

// Get notifications from store
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

// Close dropdown when clicking outside
onClickOutside(bellRef, () => {
  dropdownOpen.value = false
  expandedId.value = null
})

// Format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return date.toLocaleDateString()
}

// Get notification icon
const getNotificationIcon = (type: NotificationType) => {
  const icons: Record<string, any> = {
    INFO: InformationCircleIcon,
    SUCCESS: CheckCircleIcon,
    WARNING: ExclamationTriangleIcon,
    ERROR: ExclamationCircleIcon,
    PAYMENT_REMINDER: CurrencyDollarIcon,
    SUBSCRIPTION_EXPIRING: ClockIcon,
    SUBSCRIPTION_EXPIRED: ExclamationCircleIcon,
    SYSTEM: InformationCircleIcon,
    BOT_NOTIFICATION: CheckCircleIcon
  }
  return icons[type] || InformationCircleIcon
}

// Get notification icon class
const getNotificationIconClass = (type: NotificationType) => {
  const classes: Record<string, string> = {
    INFO: 'bg-blue-500/20 text-blue-400',
    SUCCESS: 'bg-green-500/20 text-green-400',
    WARNING: 'bg-yellow-500/20 text-yellow-400',
    ERROR: 'bg-red-500/20 text-red-400',
    PAYMENT_REMINDER: 'bg-purple-500/20 text-purple-400',
    SUBSCRIPTION_EXPIRING: 'bg-orange-500/20 text-orange-400',
    SUBSCRIPTION_EXPIRED: 'bg-red-500/20 text-red-400',
    SYSTEM: 'bg-gray-500/20 text-gray-400',
    BOT_NOTIFICATION: 'bg-indigo-500/20 text-indigo-400'
  }
  return classes[type] || classes.INFO
}

// Toggle dropdown
const toggleDropdown = async () => {
  if (!dropdownOpen.value) {
    await notificationStore.loadNotifications()
  }
  dropdownOpen.value = !dropdownOpen.value
}

// Close dropdown
const closeDropdown = () => {
  dropdownOpen.value = false
  expandedId.value = null
}

// Mark as read
const handleMarkAsRead = async (notificationId: string) => {
  await notificationStore.markAsRead(notificationId)
}

// Mark all as read
const handleMarkAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

// Toggle expand notification message
const toggleExpand = (notificationId: string) => {
  expandedId.value = expandedId.value === notificationId ? null : notificationId
}

// Delete notification
const handleDelete = async (notificationId: string) => {
  await notificationStore.deleteNotification(notificationId)
}

// Load notifications on mount
onMounted(async () => {
  await notificationStore.loadNotifications()
})

// Auto refresh notifications every 30 seconds
let refreshInterval: NodeJS.Timeout | null = null

onMounted(() => {
  refreshInterval = setInterval(async () => {
    await notificationStore.loadNotifications()
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
