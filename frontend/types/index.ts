// frontend/types/index.ts - FULL VERSION (FIXED)
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'
export type SubscriptionPlan = 'FREE' | 'MONTHLY' | 'YEARLY' | 'CUSTOM'
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING' | 'SUSPENDED'
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'PAYMENT_REMINDER' | 'SUBSCRIPTION_EXPIRING' | 'SUBSCRIPTION_EXPIRED' | 'SYSTEM' | 'BOT_NOTIFICATION'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED' | 'PROCESSING'
export type PaymentMethod = 'BANK_TRANSFER' | 'E_WALLET' | 'CREDIT_CARD' | 'CRYPTO' | 'MANUAL' | 'SUBSCRIPTION'
export type Exchange = 'BINANCE' | 'OKX' | 'BITGET'
export type OrderSide = 'BUY' | 'SELL'
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_MARKET' | 'TAKE_PROFIT' | 'TAKE_PROFIT_MARKET'
export type OrderStatus = 'PENDING' | 'OPEN' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED' | 'FAILED' | 'EXPIRED'
export type PositionSide = 'LONG' | 'SHORT'
export type WebhookStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'PROCESSING'

export interface User {
  id: string
  email: string
  username: string
  password: string
  fullName: string
  phone?: string
  address?: string
  avatar?: string
  role: UserRole
  isActive: boolean
  isEmailVerified: boolean
  emailVerifyCode?: string
  emailVerifyExpiry?: string
  resetPasswordToken?: string
  resetPasswordExpiry?: string
  lastLoginAt?: string
  lastLoginIp?: string
  subscriptionEndReminderSent: boolean
  lastPaymentReminderAt?: string
  totalSpent: number
  lastActiveAt?: string
  loginCount: number
  botActive: boolean
  createdAt: string
  updatedAt: string

  // Relations
  profile?: UserProfile
  subscription?: Subscription
  apiKeys: ApiKey[]
  portfolio?: Portfolio
  orders: Order[]
  positions: Position[]
  tradeHistory: TradeHistory[]
  webhookConfig?: WebhookConfig
  webhookLogs: WebhookLog[]
  botSettings?: BotSettings
  notifications: Notification[]
  adminLogs: AdminLog[]
  paymentHistory: PaymentHistory[]
}

export interface UserProfile {
  id: string
  userId: string
  avatar?: string
  phone?: string
  address?: string
  bio?: string
  website?: string
  social?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  settings?: {
    theme?: 'light' | 'dark' | 'auto'
    notifications?: boolean
    twoFactorEnabled?: boolean
    language?: string
  }
  createdAt: string
  updatedAt: string
  user?: User
}

export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  price: number
  startDate?: string
  endDate?: string
  autoRenew: boolean
  paymentMethod?: PaymentMethod
  paymentStatus: PaymentStatus
  paymentProof?: string
  paymentDate?: string
  customDuration?: number
  renewalCount: number
  lastRenewalDate?: string
  nextReminderDate?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string

  user?: User
  payments: PaymentHistory[]

  // Computed
  daysRemaining?: number
  isExpiringSoon?: boolean
}

export interface PaymentHistory {
  id: string
  userId: string
  subscriptionId?: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  providerRef?: string
  paymentProof?: string
  adminNotes?: string
  paidAt?: string
  createdAt: string
  updatedAt: string

  user?: User
  subscription?: Subscription
}

export interface RevenueDaily {
  id: string
  date: string
  totalRevenue: number
  userCount: number
  activeUsers: number
  newUsers: number
  totalTrades: number
  averageTransactionValue: number
  createdAt: string
  updatedAt: string
}

export interface ApiKey {
  id: string
  userId: string
  exchange: Exchange
  apiKey: string
  secretKey: string
  passphrase?: string
  isActive: boolean
  isValid: boolean
  lastValidated?: string
  createdAt: string
  updatedAt: string
  user?: User
}

export interface Portfolio {
  id: string
  userId: string
  totalBalance: number
  availableBalance: number
  unrealizedPnl: number
  realizedPnl: number
  equity: number
  marginUsed: number
  marginAvailable: number
  lastUpdated: string
  createdAt: string
  updatedAt: string
  user?: User
  positions?: Position[]
}

export interface Position {
  id: string
  userId: string
  exchange: Exchange
  symbol: string
  side: PositionSide
  size: number
  entryPrice: number
  markPrice: number
  leverage: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  liquidationPrice?: number
  margin: number
  stopLoss?: number
  takeProfit?: number
  isOpen: boolean
  openedAt: string
  closedAt?: string
  createdAt: string
  updatedAt: string
  user?: User
}

export interface Order {
  id: string
  userId: string
  exchange: Exchange
  exchangeOrderId?: string
  symbol: string
  side: OrderSide
  type: OrderType
  status: OrderStatus
  price?: number
  quantity: number
  filledQuantity: number
  leverage: number
  stopLoss?: number
  takeProfit?: number
  reduceOnly: boolean
  clientOrderId?: string
  errorMessage?: string
  executedAt?: string
  createdAt: string
  updatedAt: string
  user?: User
}

export interface TradeHistory {
  id: string
  userId: string
  exchange: Exchange
  symbol: string
  side: PositionSide
  entryPrice: number
  exitPrice: number
  quantity: number
  leverage: number
  pnl: number
  pnlPercent: number
  fee: number
  duration: number
  openedAt: string
  closedAt: string
  createdAt: string
  user?: User
}

export interface WebhookConfig {
  id: string
  userId: string
  token: string
  url?: string
  isActive: boolean
  lastTriggered?: string
  totalTriggers: number
  createdAt: string
  updatedAt: string
  user?: User
  logs: WebhookLog[]
}

export interface WebhookLog {
  id: string
  webhookId: string
  userId: string
  payload: any
  status: WebhookStatus
  response?: any
  errorMessage?: string
  processedAt?: string
  createdAt: string
  webhook?: WebhookConfig
  user?: User
}

export interface BotSettings {
  id: string
  userId: string
  isEnabled: boolean
  maxPositions: number
  defaultLeverage: number
  maxLeverage: number
  riskPerTrade: number
  stopLossPercent: number
  takeProfitPercent: number
  trailingStop: boolean
  trailingStopPercent?: number
  allowedSymbols: string[]
  blacklistedSymbols: string[]
  tradingHoursStart?: string
  tradingHoursEnd?: string
  tradingTimezone: string
  createdAt: string
  updatedAt: string
  user?: User
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  isArchived: boolean
  data?: any
  scheduledAt?: string
  expiresAt?: string
  createdAt: string
  user?: User
}

export interface AdminLog {
  id: string
  adminId: string
  targetUserId?: string
  action: string
  details?: any
  ipAddress?: string
  userAgent?: string
  createdAt: string
  admin?: User
  targetUser?: User
}

export interface PerformanceMetrics {
  id: string
  userId: string
  totalPnl: number
  totalPnlPercent: number
  totalTrades: number
  profitableTrades: number
  losingTrades: number
  winRate: number
  profitFactor: number
  maxDrawdown: number
  maxDrawdownPercent: number
  averageWin: number
  averageLoss: number
  largestWin: number
  largestLoss: number
  lastCalculated: string
  createdAt: string
  updatedAt: string
}

// ================= ADMIN DASHBOARD TYPES =================
export interface AdminDashboardStats {
  totalUsers: number
  activeUsers: number
  usersWithActiveBots: number
  usersWithoutBots: number
  totalRevenue: number
  revenue7Days: number
  revenue30Days: number
  revenue1Year: number
  averageTransactionValue: number
  averageTransactionPerUser: number
  newUsersToday: number
  subscriptionExpiringSoon: number
  activeSubscriptions: number
  pendingPayments: number
  totalTransactions: number
  totalVolume: number
}

export interface RevenueAnalytics {
  period: '7d' | '30d' | '1y' | 'custom'
  data: RevenueDataPoint[]
  total: number
  growth: number
  comparison: {
    previousPeriod: number
    growthPercentage: number
  }
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  users: number
  transactions: number
  averageValue: number
}

export interface UserAnalytics {
  period: '7d' | '30d' | '1y' | 'custom'
  data: UserDataPoint[]
  totalUsers: number
  activeUsers: number
  newUsers: number
  churnRate: number
}

export interface UserDataPoint {
  date: string
  total: number
  active: number
  new: number
  churned: number
}

export interface TransactionAnalytics {
  period: '7d' | '30d' | '1y' | 'custom'
  data: TransactionDataPoint[]
  totalTransactions: number
  totalVolume: number
  averageTransactionValue: number
}

export interface TransactionDataPoint {
  date: string
  count: number
  volume: number
  averageValue: number
}

export interface SubscriptionAnalytics {
  active: number
  expiringThisWeek: number
  expired: number
  pending: number
  revenueByPlan: {
    monthly: number
    yearly: number
    custom: number
  }
  growthRate: number
}

export interface AdminUserListParams {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  isActive?: boolean
  botActive?: boolean
  subscriptionStatus?: SubscriptionStatus
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AdminUserResponse {
  users: User[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CreateUserInput {
  email: string
  username: string
  password: string
  fullName: string
  phone?: string
  address?: string
  role: UserRole
  subscriptionPlan: SubscriptionPlan
  subscriptionPrice: number
  customDuration?: number
  autoRenew?: boolean
  paymentMethod: PaymentMethod
}

export interface UpdateUserInput {
  fullName?: string
  phone?: string
  address?: string
  role?: UserRole
  isActive?: boolean
  botActive?: boolean
}

export interface UpdateSubscriptionInput {
  plan?: SubscriptionPlan
  status?: SubscriptionStatus
  price?: number
  startDate?: string
  endDate?: string
  autoRenew?: boolean
  customDuration?: number
  adminNotes?: string
}

export interface UpdateProfileInput {
  avatar?: string
  phone?: string
  address?: string
  bio?: string
  website?: string
  social?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  settings?: {
    theme?: 'light' | 'dark' | 'auto'
    notifications?: boolean
    twoFactorEnabled?: boolean
    language?: string
  }
}

// ================= CHART TYPES =================
export interface ChartData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface LineChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    tension?: number
    fill?: boolean
  }>
}

export interface BarChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor: string
    borderColor?: string
    borderWidth?: number
  }>
}

export interface PieChartData {
  labels: string[]
  datasets: Array<{
    data: number[]
    backgroundColor: string[]
    borderColor?: string[]
    borderWidth?: number
  }>
}

// ================= API RESPONSE TYPES =================
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ================= AUTH TYPES =================
export interface LoginCredentials {
  identifier: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  fullName: string
  phone?: string
  address?: string
  plan: SubscriptionPlan
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordInput {
  token: string
  password: string
  confirmPassword: string
}

// ================= WEBSOCKET TYPES =================
export interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
}

export interface NotificationMessage {
  type: NotificationType
  title: string
  message: string
  data?: any
}

// ================= ADMIN INPUT TYPES =================
export interface GetAnalyticsInput {
  period: '7d' | '30d' | '1y' | 'custom'
  startDate?: Date
  endDate?: Date
}

export interface GetAdminLogsInput {
  page?: number
  limit?: number
  adminId?: string
  action?: string
  startDate?: Date | string
  endDate?: Date | string
}

export interface ExtendSubscriptionInput {
  days: number
}

export interface ProcessPaymentInput {
  amount: number
  paymentMethod: PaymentMethod
  transactionId?: string
  adminNotes?: string
}

export interface UpdateAdminProfileInput {
  fullName?: string
  phone?: string
  address?: string
}

export interface UserSubscription extends Subscription {
  userEmail: string
  userFullName: string
  botActive: boolean
}