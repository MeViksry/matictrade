// frontend/stores/notification.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import type { Notification } from '~/types'

export const useNotificationStore = defineStore('notification', () => {
  const api = useApi()

  // State
  const notifications = ref<Notification[]>([])

  // Getters
  const unreadNotifications = computed(() =>
    notifications.value.filter((n: Notification) => !n.isRead)
  )

  const recentNotifications = computed(() =>
    notifications.value.slice(0, 5)
  )

  // Actions
  const loadNotifications = async () => {
    try {
      const response = await api.get<Notification[]>('/api/admin/notifications')
      if (response.data) {
        notifications.value = response.data
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch<void>(`/api/admin/notifications/${notificationId}/read`)
      const notification = notifications.value.find((n: Notification) => n.id === notificationId)
      if (notification) {
        notification.isRead = true
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        unreadNotifications.value.map((n: Notification) => markAsRead(n.id))
      )
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const archive = async (notificationId: string) => {
    try {
      await api.patch<void>(`/api/admin/notifications/${notificationId}/archive`)
      notifications.value = notifications.value.filter((n: Notification) => n.id !== notificationId)
    } catch (error) {
      console.error('Failed to archive notification:', error)
    }
  }

  return {
    // State
    notifications,

    // Getters
    unreadNotifications,
    recentNotifications,

    // Actions
    loadNotifications,
    markAsRead,
    markAllAsRead,
    archive
  }
})