import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterData } from '~/types'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    isActive: (state) => state.user?.isActive ?? false,
    isPremium: (state) => {
      return state.user?.subscription?.plan !== 'FREE' &&
        state.user?.subscription?.status === 'ACTIVE'
    }
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true

      // --- DEBUGGING BLOCK START ---
      const config = useRuntimeConfig()
      const baseUrl = config.public.apiBaseUrl
      // Pastikan tidak ada double slash
      const cleanUrl = baseUrl?.replace(/\/$/, '') || ''
      const targetUrl = `${cleanUrl}/api/auth/login`

      console.log('====================================')
      console.log('🚀 [AUTH START] Login Process')
      console.log('🔗 Config Base URL:', baseUrl)
      console.log('🎯 Final Target URL:', targetUrl)
      console.log('====================================')
      // --- DEBUGGING BLOCK END ---

      try {
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        })

        const data = await response.json()

        if (!response.ok) {
          console.error('❌ [AUTH ERROR] Login Response:', data)
          throw new Error(data.message || 'Login failed')
        }

        console.log('✅ [AUTH SUCCESS] Login successful')
        this.setAuth(data.data)
        return data
      } catch (error) {
        console.error('❌ [AUTH EXCEPTION]', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },


    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout()
        return
      }

      const config = useRuntimeConfig()
      const baseUrl = config.public.apiBaseUrl?.replace(/\/$/, '') || ''

      try {
        const response = await fetch(`${baseUrl}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: this.refreshToken })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message)
        }

        this.token = data.data.accessToken
        this.refreshToken = data.data.refreshToken

        if (process.client) {
          localStorage.setItem('token', data.data.accessToken)
          localStorage.setItem('refreshToken', data.data.refreshToken)
        }
      } catch {
        this.logout()
      }
    },

    async getProfile() {
      if (!this.token) return

      const config = useRuntimeConfig()
      const baseUrl = config.public.apiBaseUrl?.replace(/\/$/, '') || ''

      try {
        const response = await fetch(`${baseUrl}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        const data = await response.json()

        if (response.ok) {
          this.user = data.data
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    },

    setAuth(authData: { user: User; accessToken: string; refreshToken: string }) {
      // Debug: Log data being saved
      console.log('=== SET AUTH DEBUG ===')
      console.log('User data received:', authData.user)
      console.log('User role:', authData.user?.role)
      console.log('======================')
      
      this.user = authData.user
      this.token = authData.accessToken
      this.refreshToken = authData.refreshToken
      this.isAuthenticated = true

      if (process.client) {
        // Clear old data first
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        
        // Save new data
        localStorage.setItem('token', authData.accessToken)
        localStorage.setItem('refreshToken', authData.refreshToken)
        localStorage.setItem('user', JSON.stringify(authData.user))
        
        console.log('✅ User data saved to localStorage with role:', authData.user?.role)
      }
    },

    loadFromStorage() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refreshToken')
        const userStr = localStorage.getItem('user')

        console.log('=== LOAD FROM STORAGE DEBUG ===')
        console.log('Token exists:', !!token)
        console.log('RefreshToken exists:', !!refreshToken)
        console.log('User string:', userStr)
        
        if (token && refreshToken && userStr) {
          const user = JSON.parse(userStr)
          console.log('Parsed user:', user)
          console.log('User role from storage:', user?.role)
          console.log('================================')
          
          this.token = token
          this.refreshToken = refreshToken
          this.user = user
          this.isAuthenticated = true
        } else {
          console.log('No valid auth data in storage')
          console.log('================================')
        }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }

      navigateTo('/auth/login')
    }
  }
})