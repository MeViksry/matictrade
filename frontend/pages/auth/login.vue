<!-- frontend/pages/auth/login.vue -->
<template>
  <div>
    <h2 class="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
    <p class="text-gray-400 text-center mb-8">Sign in to your account</p>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- Email / Username / Phone -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Email / Username / Phone</label>
        <input
          v-model="form.identifier"
          type="text"
          required
          class="input-field"
          placeholder="Enter email, username, or phone"
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="input-field pr-12"
            placeholder="Enter your password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Remember Me -->
      <div class="flex items-center">
        <label class="flex items-center">
          <input type="checkbox" v-model="form.remember" class="w-4 h-4 rounded border-gray-600 bg-dark-700 text-primary-500 focus:ring-primary-500">
          <span class="ml-2 text-sm text-gray-400">Remember me</span>
        </label>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full btn-primary flex items-center justify-center"
      >
        <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isLoading ? 'Signing in...' : 'Sign In' }}
      </button>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-700"></div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const authStore = useAuthStore()
const toast = useCustomToast()

const form = reactive({
  identifier: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await authStore.login({
      identifier: form.identifier,
      password: form.password
    })
    
    toast.success('Welcome back!', 'Login successful')
    
    // Redirect based on user role
    const user = authStore.user
    
    // Debug: Log role untuk troubleshooting
    console.log('=== LOGIN SUCCESS DEBUG ===')
    console.log('User Data:', user)
    console.log('User Role:', user?.role)
    console.log('Is Admin:', user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN')
    console.log('===========================')
    
    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
      console.log('🔄 Redirecting to /admin...')
      navigateTo('/admin')
    } else {
      console.log('🔄 Redirecting to /dashboard...')
      navigateTo('/dashboard')
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>