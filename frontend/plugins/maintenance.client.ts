// frontend/plugins/maintenance.client.ts
// Client-side plugin to check maintenance mode on every navigation

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  // Add hook to check maintenance mode before each navigation
  nuxtApp.hook('page:start', async () => {
    await checkMaintenanceMode()
  })
  
  // Also check on initial load
  nuxtApp.hook('app:mounted', async () => {
    await checkMaintenanceMode()
  })
  
  async function checkMaintenanceMode() {
    const router = useRouter()
    const route = useRoute()
    
    // Skip if already on maintenance page
    if (route.path === '/maintenance') {
      return
    }
    
    // Skip admin routes
    if (route.path.startsWith('/admin')) {
      return
    }
    
    // Skip auth routes
    if (route.path.startsWith('/auth')) {
      return
    }
    
    const apiBase = config.public.apiBaseUrl || 'http://localhost:3001'
    
    try {
      const response = await $fetch<{ success: boolean; data: { maintenanceMode: boolean } }>(
        `${apiBase}/auth/status`,
        { timeout: 3000 }
      ).catch(() => null)
      
      console.log('🔧 Maintenance check:', response?.data)
      
      if (response?.data?.maintenanceMode) {
        // Check if user is admin
        const { useAuthStore } = await import('~/stores/auth')
        const authStore = useAuthStore()
        authStore.loadFromStorage()
        
        console.log('🔧 User role:', authStore.user?.role)
        
        if (authStore.user?.role === 'ADMIN' || authStore.user?.role === 'SUPER_ADMIN') {
          console.log('🔧 Admin detected, allowing access')
          return
        }
        
        console.log('🔧 Redirecting to maintenance page')
        router.push('/maintenance')
      }
    } catch (error) {
      console.warn('Maintenance check failed:', error)
    }
  }
})
