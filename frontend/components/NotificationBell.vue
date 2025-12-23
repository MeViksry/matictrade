<!-- frontend/components/NotificationBell.vue -->
<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-400 hover:text-white transition-colors duration-200"
    >
      <BellIcon class="h-6 w-6" />
      
      <span 
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>
    
    <!-- Dropdown -->
    <div 
      v-if="dropdownOpen"
      v-click-outside="closeDropdown"
      class="absolute right-0 mt-2 w-80 bg-dark-800 rounded-xl shadow-2xl border border-dark-700 z-50"
    >
      <div class="p-4 border-b border-dark-700">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-white">Notifications</h3>
          <button 
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-sm text-primary-400 hover:text-primary-300"
          >
            Mark all as read
          </button>
        </div>
      </div>
      
      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
        </div>
        
        <div v-else-if="notifications.length === 0" class="p-8 text-center">
          <BellIcon class="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p class="text-gray-400">No notifications</p>
        </div>
        
        <div v-else>
          <div 
            v-for="notification in notifications.slice(0, 5)"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            :class="[
              'p-4 border-b border-gray-100 border-dark-700 cursor-pointer hover:bg-dark-700/50 transition-colors duration-150',
              !notification.isRead ? 'bg-blue-900/10' : ''
            ]"
          >
            <div class="flex items-start space-x-3">
              <div 
                :class="getNotificationIconClass(notification.type)"
                class="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              >
                <component :is="getNotificationIcon(notification.type)" class="h-4 w-4" />
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">
                  {{ notification.title }}
                </p>
                <p class="text-sm text-gray-400 mt-1 line-clamp-2">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-500 mt-2">
                  {{ formatTime(notification.createdAt) }}
                </p>
              </div>
              
              <button
                v-if="!notification.isRead"
                @click.stop="markAsRead(notification.id)"
                class="text-gray-400 hover:text-gray-300"
                title="Mark as read"
              >
                <CheckIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-3 border-t border-dark-700">
        <button
          @click="viewAllNotifications"
          class="w-full text-center text-sm text-primary-400 hover:text-primary-300 font-medium"
        >
          View all notifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BellIcon, CheckIcon } from '@heroicons/vue/24/outline'
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/vue/24/solid'
import { useNotificationStore } from '~/stores/notification'
import type { Notification, NotificationType } from '~/types'

const router = useRouter()
const notificationStore = useNotificationStore()

const dropdownOpen = ref(false)
const loading = ref(false)

// Get notifications from store
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadNotifications.length)

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
    loading.value = true
    try {
      await notificationStore.loadNotifications()
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      loading.value = false
    }
  }
  dropdownOpen.value = !dropdownOpen.value
}

// Close dropdown
const closeDropdown = () => {
  dropdownOpen.value = false
}

// Handle notification click
const handleNotificationClick = async (notification: Notification) => {
  if (!notification.isRead) {
    await notificationStore.markAsRead(notification.id)
  }
  
  // Navigate based on notification type
  if (notification.type === 'PAYMENT_REMINDER' || notification.type === 'SUBSCRIPTION_EXPIRING') {
    router.push('/admin/subscriptions')
  } else if (notification.type === 'BOT_NOTIFICATION') {
    router.push('/admin/users')
  }
  
  closeDropdown()
}

// Mark as read
const markAsRead = async (notificationId: string) => {
  await notificationStore.markAsRead(notificationId)
}

// Mark all as read
const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

// View all notifications
const viewAllNotifications = () => {
  router.push('/admin/notifications')
  closeDropdown()
}

// Load notifications on mount
onMounted(async () => {
  await notificationStore.loadNotifications()
})

// Auto refresh notifications every 30 seconds
setInterval(async () => {
  if (dropdownOpen.value) {
    await notificationStore.loadNotifications()
  }
}, 30000)
</script>