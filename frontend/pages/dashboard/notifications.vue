<template>
  <div class="space-y-4 px-4 py-4 sm:px-6">
    <!-- Header with back button -->
    <div class="flex items-center gap-3 mb-2">
      <button
        @click="goBack"
        class="p-2 -ml-2 rounded-lg hover:bg-dark-800 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-lg sm:text-xl font-bold text-white">Notifications</h1>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center gap-2 flex-wrap">
      <button
        v-if="unreadCount > 0"
        @click="handleMarkAllAsRead"
        class="px-3 py-1.5 text-xs text-primary-500 hover:text-primary-400 border border-primary-500/30 rounded-lg hover:bg-primary-500/10 transition-colors"
      >
        Mark all as read
      </button>
      <button
        v-if="notifications.length > 0"
        @click="showDeleteAllModal = true"
        class="px-3 py-1.5 text-xs text-red-500 hover:text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
      >
        Delete all
      </button>
    </div>

    <!-- Notifications List -->
    <div class="card divide-y divide-dark-700">
      <div v-if="isLoading" class="p-8 sm:p-12 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p class="text-gray-400 mt-4 text-sm">Loading notifications...</p>
      </div>

      <div v-else-if="notifications.length === 0" class="p-8 sm:p-12 text-center">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <p class="text-gray-400 text-base sm:text-lg">No notifications yet</p>
        <p class="text-gray-500 text-xs sm:text-sm mt-1">You'll see notifications here when something happens</p>
      </div>

      <div
        v-else
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'p-3 sm:p-4 hover:bg-dark-800/50 transition-colors',
          !notification.isRead ? 'bg-primary-500/5' : ''
        ]"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div
            :class="getNotificationIconClass(notification.type)"
            class="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <component :is="getNotificationIcon(notification.type)" class="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div 
              class="cursor-pointer"
              @click="toggleExpand(notification.id)"
            >
              <p class="text-xs sm:text-sm font-medium text-white flex items-center gap-2 flex-wrap">
                <span>{{ notification.title }}</span>
                <span v-if="!notification.isRead" class="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
              </p>
              <p
                :class="[
                  'text-xs sm:text-sm text-gray-400 mt-1',
                  expandedId !== notification.id ? 'line-clamp-2' : ''
                ]"
              >
                {{ notification.message }}
              </p>
              <p class="text-xs text-gray-500 mt-2">
                {{ formatDateTime(notification.createdAt) }}
              </p>
            </div>

            <!-- Actions - inline on mobile -->
            <div class="flex items-center gap-3 mt-2">
              <button
                v-if="!notification.isRead"
                @click.stop="handleMarkAsRead(notification.id)"
                class="text-xs text-primary-400 hover:text-primary-300"
              >
                Mark as read
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

    <!-- Delete All Modal -->
    <Modal v-model="showDeleteAllModal" title="Delete All Notifications" size="sm">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Delete All Notifications?</h3>
        <p class="text-gray-400 mb-6">This action cannot be undone. All notifications will be permanently deleted.</p>
        <div class="flex justify-center space-x-3">
          <button
            @click="showDeleteAllModal = false"
            class="px-4 py-2 rounded-xl border border-dark-600 text-white hover:bg-dark-800 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteAll"
            :disabled="isDeleting"
            class="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete All' }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/vue/24/solid'
import { useUserNotificationStore } from '~/stores/userNotification'
import type { NotificationType } from '~/types'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const router = useRouter()
const notificationStore = useUserNotificationStore()
const toast = useCustomToast()

const goBack = () => {
  router.push('/dashboard')
}

const isLoading = ref(true)
const isDeleting = ref(false)
const showDeleteAllModal = ref(false)
const expandedId = ref<string | null>(null)

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

const formatDateTime = (date: string) => format(new Date(date), 'dd MMM yyyy, HH:mm')

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

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const handleMarkAsRead = async (id: string) => {
  try {
    await notificationStore.markAsRead(id)
  } catch (error) {
    toast.error('Failed to mark as read')
  }
}

const handleMarkAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead()
    toast.success('All notifications marked as read')
  } catch (error) {
    toast.error('Failed to mark all as read')
  }
}

const handleDelete = async (id: string) => {
  try {
    await notificationStore.deleteNotification(id)
    toast.success('Notification deleted')
  } catch (error) {
    toast.error('Failed to delete notification')
  }
}

const handleDeleteAll = async () => {
  isDeleting.value = true
  try {
    await notificationStore.deleteAllNotifications()
    toast.success('All notifications deleted')
    showDeleteAllModal.value = false
  } catch (error) {
    toast.error('Failed to delete notifications')
  } finally {
    isDeleting.value = false
  }
}

onMounted(async () => {
  try {
    await notificationStore.loadNotifications()
  } finally {
    isLoading.value = false
  }
})
</script>
