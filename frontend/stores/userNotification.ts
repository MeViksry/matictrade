// frontend/stores/userNotification.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import type { Notification } from '~/types'

export const useUserNotificationStore = defineStore('userNotification', () => {
  const api = useApi()

  // State
  const notifications = ref<Notification[]>([])
  const loading = ref(false)

  // Getters
  const unreadNotifications = computed(() =>
    notifications.value.filter((n: Notification) => !n.isRead)
  )

  const unreadCount = computed(() => unreadNotifications.value.length)

  const recentNotifications = computed(() =>
    notifications.value.slice(0, 5)
  )

  // Actions
  const loadNotifications = async () => {
    loading.value = true
    try {
      const response = await api.get<Notification[]>('/api/users/notifications')
      if (response.data) {
        notifications.value = response.data
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch<void>(`/api/users/notifications/${notificationId}/read`)
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
      await api.patch<void>('/api/users/notifications/read-all')
      notifications.value.forEach((n: Notification) => {
        n.isRead = true
      })
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await api.del<void>(`/api/users/notifications/${notificationId}`)
      notifications.value = notifications.value.filter((n: Notification) => n.id !== notificationId)
    } catch (error) {
      console.error('Failed to delete notification:', error)
      throw error
    }
  }

  const deleteAllNotifications = async () => {
    try {
      await api.del<void>('/api/users/notifications')
      notifications.value = []
    } catch (error) {
      console.error('Failed to delete all notifications:', error)
      throw error
    }
  }

  return {
    // State
    notifications,
    loading,

    // Getters
    unreadNotifications,
    unreadCount,
    recentNotifications,

    // Actions
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
  }
})
