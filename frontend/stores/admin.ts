// frontend/stores/admin.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import type {
  AdminDashboardStats,
  RevenueAnalytics,
  UserAnalytics,
  TransactionAnalytics,
  SubscriptionAnalytics,
  UserSubscription,
  AdminLog,
  AdminUserListParams,
  AdminUserResponse,
  CreateUserInput,
  UpdateUserInput,
  UpdateSubscriptionInput,
  ProcessPaymentInput,
  UpdateAdminProfileInput,
  ChangePasswordInput,
  GetAdminLogsInput,
  Notification,
  User
} from '~/types'

export const useAdminStore = defineStore('admin', () => {
  const api = useApi()

  // State
  const dashboardStats = ref<AdminDashboardStats | null>(null)
  const users = ref<User[]>([])
  const userDetails = ref<User | null>(null)
  const adminLogs = ref<AdminLog[]>([])
  const notifications = ref<Notification[]>([])

  // Getters
  const unreadNotifications = computed(() =>
    notifications.value.filter((n: Notification) => !n.isRead)
  )

  const recentNotifications = computed(() =>
    notifications.value.slice(0, 5)
  )

  // Actions

  // Dashboard
  const getDashboardStats = async (): Promise<AdminDashboardStats> => {
    const response = await api.get<AdminDashboardStats>('/api/admin/stats') as any
    const data = response.data as AdminDashboardStats
    if (data) {
      dashboardStats.value = data
    }
    return data
  }

  const getRevenueAnalytics = async (period: '7d' | '30d' | '1y' | 'custom', startDate?: Date, endDate?: Date): Promise<RevenueAnalytics> => {
    const params: Record<string, string> = { period }
    if (startDate) params.startDate = startDate.toISOString()
    if (endDate) params.endDate = endDate.toISOString()

    const response = await api.get<RevenueAnalytics>('/api/admin/analytics/revenue', params) as any
    return response.data as RevenueAnalytics
  }

  const getUserAnalytics = async (period: '7d' | '30d' | '1y' | 'custom', startDate?: Date, endDate?: Date): Promise<UserAnalytics> => {
    const params: Record<string, string> = { period }
    if (startDate) params.startDate = startDate.toISOString()
    if (endDate) params.endDate = endDate.toISOString()

    const response = await api.get<UserAnalytics>('/api/admin/analytics/users', params) as any
    return response.data as UserAnalytics
  }

  const getTransactionAnalytics = async (period: '7d' | '30d' | '1y' | 'custom', startDate?: Date, endDate?: Date): Promise<TransactionAnalytics> => {
    const params: Record<string, string> = { period }
    if (startDate) params.startDate = startDate.toISOString()
    if (endDate) params.endDate = endDate.toISOString()

    const response = await api.get<TransactionAnalytics>('/api/admin/analytics/transactions', params) as any
    return response.data as TransactionAnalytics
  }

  const getSubscriptionAnalytics = async (): Promise<SubscriptionAnalytics> => {
    const response = await api.get<SubscriptionAnalytics>('/api/admin/analytics/subscriptions') as any
    return response.data as SubscriptionAnalytics
  }

  const getUserVolumeStats = async (): Promise<any> => {
    const response = await api.get<any>('/api/admin/analytics/volume-stats') as any
    return response.data
  }

  const getAdminNotifications = async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/api/admin/notifications/system') as any
    return response.data as Notification[]
  }

  // User Management
  const getUsers = async (params: AdminUserListParams): Promise<AdminUserResponse> => {
    const queryParams: Record<string, string> = {}
    if (params.page) queryParams.page = String(params.page)
    if (params.limit) queryParams.limit = String(params.limit)
    if (params.search) queryParams.search = params.search
    if (params.role) queryParams.role = params.role
    if (params.isActive !== undefined) queryParams.isActive = String(params.isActive)
    if (params.botActive !== undefined) queryParams.botActive = String(params.botActive)
    if (params.subscriptionStatus) queryParams.subscriptionStatus = params.subscriptionStatus
    if (params.sortBy) queryParams.sortBy = params.sortBy
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder

    const response = await api.get<User[]>('/api/admin/users', queryParams) as any

    // API returns { success, data: [users], meta: { page, limit, total, totalPages } }
    const usersData = response.data || []
    const meta = response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 }

    if (Array.isArray(usersData)) {
      users.value = usersData
    }

    return {
      users: usersData,
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages: meta.totalPages
    }
  }

  const getUserById = async (userId: string): Promise<User> => {
    const response = await api.get<User>(`/api/admin/users/${userId}`)
    if (response.data) {
      userDetails.value = response.data
    }
    return response.data as User
  }

  const createUser = async (data: CreateUserInput): Promise<User> => {
    const response = await api.post<User>('/api/admin/users', data)
    return response.data as User
  }

  const updateUser = async (userId: string, data: UpdateUserInput): Promise<User> => {
    const response = await api.patch<User>(`/api/admin/users/${userId}`, data)
    return response.data as User
  }

  const deleteUser = async (userId: string): Promise<void> => {
    await api.del<void>(`/api/admin/users/${userId}`)
  }

  const activateUser = async (userId: string): Promise<void> => {
    await api.patch<void>(`/api/admin/users/${userId}/activate`)
  }

  const deactivateUser = async (userId: string): Promise<void> => {
    await api.patch<void>(`/api/admin/users/${userId}/deactivate`)
  }

  const toggleUserBot = async (userId: string, enabled: boolean): Promise<void> => {
    await api.patch<void>(`/api/admin/users/${userId}/toggle-bot`, { enabled })
  }

  const resetUserApiKeys = async (userId: string): Promise<void> => {
    await api.del<void>(`/api/admin/users/${userId}/reset-api-keys`)
  }

  const updateUserRole = async (userId: string, role: string): Promise<void> => {
    await api.patch<void>(`/api/admin/users/${userId}/role`, { role })
  }

  const resetUserPassword = async (userId: string, newPassword: string): Promise<void> => {
    await api.patch<void>(`/api/admin/users/${userId}/password`, { newPassword })
  }

  // Subscription Management
  const updateSubscription = async (userId: string, data: UpdateSubscriptionInput): Promise<any> => {
    const response = await api.patch<any>(`/api/admin/users/${userId}/subscription`, data)
    return response.data
  }

  const extendSubscription = async (userId: string, days: number): Promise<any> => {
    const response = await api.post<any>(`/api/admin/users/${userId}/subscription/extend`, { days })
    return response.data
  }

  const getExpiringSubscriptions = async (): Promise<UserSubscription[]> => {
    try {
      const response = await api.get<User[]>('/api/admin/users', {
        subscriptionStatus: 'ACTIVE',
        sortBy: 'endDate',
        sortOrder: 'asc',
        limit: '50' // Get more users to filter later
      }) as any

      // API returns { success, data: [users], meta: {...} }
      const usersData = response.data || []

      // Safety check for undefined data
      if (!Array.isArray(usersData)) {
        return []
      }

      // Calculate 7 days from now
      const now = new Date()
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      return usersData
        .filter((user: User) => {
          // Only include users with subscription
          if (!user.subscription) return false
          
          // Only include subscriptions expiring within 7 days
          const endDate = user.subscription.endDate ? new Date(user.subscription.endDate) : null
          if (!endDate) return false
          
          // Subscription must end between now and 7 days from now
          return endDate >= now && endDate <= sevenDaysFromNow
        })
        .map((user: User) => ({
          ...user.subscription,
          userId: user.id,
          userEmail: user.email,
          userFullName: user.fullName,
          botActive: user.botActive,
          daysRemaining: user.subscription?.daysRemaining || 0
        })) as UserSubscription[]
    } catch (error) {
      console.error('Failed to get expiring subscriptions:', error)
      return []
    }
  }

  // Payment Management
  const processPayment = async (userId: string, data: ProcessPaymentInput): Promise<any> => {
    const response = await api.post<any>(`/api/admin/users/${userId}/payments`, data)
    return response.data
  }

  const sendPaymentReminder = async (userId: string): Promise<void> => {
    await api.post<void>(`/api/admin/users/${userId}/payments/reminder`)
  }

  // Payment List & Management
  interface PaymentListParams {
    page?: number
    limit?: number
    search?: string
    status?: string
    paymentMethod?: string
    period?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }

  interface PaymentListResponse {
    payments: any[]
    page: number
    limit: number
    total: number
    totalPages: number
  }

  interface PaymentStats {
    totalRevenue: number
    thisMonthRevenue: number
    pendingCount: number
    pendingAmount: number
    avgTransaction: number
    revenueGrowth: number
    totalTransactions: number
  }

  const getPayments = async (params: PaymentListParams): Promise<PaymentListResponse> => {
    const queryParams: Record<string, string> = {}
    if (params.page) queryParams.page = String(params.page)
    if (params.limit) queryParams.limit = String(params.limit)
    if (params.search) queryParams.search = params.search
    if (params.status) queryParams.status = params.status
    if (params.paymentMethod) queryParams.paymentMethod = params.paymentMethod
    if (params.period) queryParams.period = params.period
    if (params.sortBy) queryParams.sortBy = params.sortBy
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder

    const response = await api.get<any[]>('/api/admin/payments', queryParams) as any
    
    const paymentsData = response.data || []
    const meta = response.meta || { page: 1, limit: 20, total: 0, totalPages: 0 }

    return {
      payments: paymentsData,
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages: meta.totalPages
    }
  }

  const getPaymentStats = async (): Promise<PaymentStats> => {
    const response = await api.get<PaymentStats>('/api/admin/payments/stats')
    return response.data as PaymentStats
  }

  const updatePaymentStatus = async (paymentId: string, status: string, adminNotes?: string): Promise<any> => {
    const response = await api.patch<any>(`/api/admin/payments/${paymentId}/status`, {
      status,
      adminNotes
    })
    return response.data
  }

  // Admin Profile
  const getAdminProfile = async (): Promise<User> => {
    const response = await api.get<User>('/api/admin/profile')
    return response.data as User
  }

  const updateAdminProfile = async (data: UpdateAdminProfileInput): Promise<User> => {
    const response = await api.patch<User>('/api/admin/profile', data)
    return response.data as User
  }

  const changePassword = async (data: ChangePasswordInput): Promise<void> => {
    await api.patch<void>('/api/admin/profile/password', data)
  }

  // Admin Logs
  interface AdminLogsResponse {
    logs: AdminLog[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }

  const getAdminLogs = async (params: GetAdminLogsInput): Promise<AdminLogsResponse> => {
    const queryParams: Record<string, string> = {}
    if (params.page) queryParams.page = String(params.page)
    if (params.limit) queryParams.limit = String(params.limit)
    if (params.adminId) queryParams.adminId = params.adminId
    if (params.action) queryParams.action = params.action
    if (params.startDate) {
      // Handle both Date object and string
      queryParams.startDate = params.startDate instanceof Date
        ? params.startDate.toISOString()
        : params.startDate
    }
    if (params.endDate) {
      queryParams.endDate = params.endDate instanceof Date
        ? params.endDate.toISOString()
        : params.endDate
    }

    const response = await api.get<any>('/api/admin/logs', queryParams) as any

    // API returns { success, data: [...logs], meta: { page, limit, total, totalPages } }
    const logsData = response.data || []
    const meta = response.meta || { page: 1, limit: 20, total: 0, totalPages: 0 }

    if (Array.isArray(logsData)) {
      adminLogs.value = logsData
    }

    return {
      logs: logsData,
      meta
    }
  }

  // Notifications
  const getNotifications = async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/api/admin/notifications')
    if (response.data) {
      notifications.value = response.data
    }
    return response.data as Notification[]
  }

  const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    await api.patch<void>(`/api/admin/notifications/${notificationId}/read`)
    const notification = notifications.value.find((n: Notification) => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  }

  const archiveNotification = async (notificationId: string): Promise<void> => {
    await api.patch<void>(`/api/admin/notifications/${notificationId}/archive`)
    notifications.value = notifications.value.filter((n: Notification) => n.id !== notificationId)
  }

  const markAllNotificationsAsRead = async (): Promise<void> => {
    await Promise.all(
      notifications.value
        .filter((n: Notification) => !n.isRead)
        .map((n: Notification) => markNotificationAsRead(n.id))
    )
  }

  // System
  interface SystemHealth {
    status: string
    database: boolean
    redis: boolean
    uptime: number
  }

  const getSystemHealth = async (): Promise<SystemHealth> => {
    const response = await api.get<SystemHealth>('/api/admin/system/health')
    return response.data as SystemHealth
  }

  const clearCache = async (): Promise<void> => {
    await api.post<void>('/api/admin/system/cache/clear')
  }

  // System Settings
  interface SystemSettings {
    id?: string
    platformName: string
    supportEmail: string
    maintenanceMode: boolean
    webhookToken: string
    emailNotifications: boolean
    telegramNotifications: boolean
  }

  const getSystemSettings = async (): Promise<SystemSettings> => {
    const response = await api.get<SystemSettings>('/api/admin/system/settings')
    return response.data as SystemSettings
  }

  const updateSystemSettings = async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
    const response = await api.put<SystemSettings>('/api/admin/system/settings', data)
    return response.data as SystemSettings
  }

  const regenerateWebhookToken = async (): Promise<{ webhookToken: string }> => {
    const response = await api.post<{ webhookToken: string }>('/api/admin/system/webhook/regenerate')
    return response.data as { webhookToken: string }
  }

  return {
    // State
    dashboardStats,
    users,
    userDetails,
    adminLogs,
    notifications,

    // Getters
    unreadNotifications,
    recentNotifications,

    // Actions
    getDashboardStats,
    getRevenueAnalytics,
    getUserAnalytics,
    getTransactionAnalytics,
    getSubscriptionAnalytics,
    getUserVolumeStats,
    getAdminNotifications,

    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    toggleUserBot,
    resetUserApiKeys,
    updateUserRole,
    resetUserPassword,

    updateSubscription,
    extendSubscription,
    getExpiringSubscriptions,

    processPayment,
    sendPaymentReminder,
    getPayments,
    getPaymentStats,
    updatePaymentStatus,

    getAdminProfile,
    updateAdminProfile,
    changePassword,

    getAdminLogs,

    getNotifications,
    markNotificationAsRead,
    archiveNotification,
    markAllNotificationsAsRead,

    getSystemHealth,
    clearCache,
    getSystemSettings,
    updateSystemSettings,
    regenerateWebhookToken
  }
})