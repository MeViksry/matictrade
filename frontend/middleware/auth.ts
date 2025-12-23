// frontend/middleware/auth.ts
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Load auth state from storage
  if (process.client) {
    authStore.loadFromStorage()
  }

  // Check if authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  const user = authStore.user

  // Debug: Log user role for troubleshooting
  if (process.client) {
    console.log('=== AUTH MIDDLEWARE DEBUG ===' )
    console.log('Current Path:', to.path)
    console.log('User Role:', user?.role)
    console.log('User Email:', user?.email)
    console.log('Is Admin:', user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN')
    console.log('===============================')
  }

  // Check for admin routes
  if (to.path.startsWith('/admin')) {
    // If user is not admin or super admin, redirect to user dashboard
    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      console.log('⛔ User is not admin, redirecting to /dashboard')
      return navigateTo('/dashboard')
    }
  }

  // Check for user dashboard routes - block admin from accessing
  if (to.path.startsWith('/dashboard')) {
    // If user is admin or super admin, redirect to admin dashboard
    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
      console.log('⛔ Admin detected on user dashboard, redirecting to /admin')
      return navigateTo('/admin')
    }
  }
})