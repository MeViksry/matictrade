<template>
  <div class="min-h-screen bg-dark-900 flex items-center justify-center px-4">
    <!-- Background Effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 text-center max-w-lg">
      <!-- Error Code -->
      <div class="mb-8">
        <h1 class="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          {{ error?.statusCode || 500 }}
        </h1>
      </div>

      <!-- Error Icon -->
      <div class="mb-6 flex justify-center">
        <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
          <svg v-if="error?.statusCode === 404" class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      <!-- Error Title -->
      <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">
        {{ errorTitle }}
      </h2>

      <!-- Error Message -->
      <p class="text-gray-400 mb-8 leading-relaxed">
        {{ errorMessage }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          @click="handleError" 
          class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </span>
        </button>
        
        <button 
          @click="goBack" 
          class="w-full sm:w-auto px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-semibold rounded-xl border border-dark-700 transition-all"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </span>
        </button>
      </div>

      <!-- Support Link -->
      <p class="mt-8 text-sm text-gray-500">
        Need help? 
        <a href="https://t.me/matictradecom" target="_blank" class="text-green-500 hover:text-green-400 transition-colors">
          Contact Support
        </a>
      </p>

      <!-- Error Details (Debug Mode) -->
      <div v-if="isDev && error?.message" class="mt-8 p-4 bg-dark-800/50 rounded-xl text-left">
        <p class="text-xs text-gray-500 mb-2">Debug Info:</p>
        <code class="text-xs text-red-400 break-all">{{ error?.message }}</code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

interface NuxtError {
  statusCode?: number
  message?: string
}

const props = defineProps<{
  error: NuxtError
}>()

const isDev = ref(false)

onMounted(() => {
  // Set document title
  document.title = `${props.error?.statusCode || 'Error'} - MATIC TRADE`
})

const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return 'Page Not Found'
    case 403:
      return 'Access Denied'
    case 401:
      return 'Unauthorized'
    case 500:
      return 'Server Error'
    default:
      return 'Something Went Wrong'
  }
})

const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return "The page you're looking for doesn't exist or has been moved. Please check the URL or navigate back to safety."
    case 403:
      return "You don't have permission to access this resource. Please contact support if you believe this is a mistake."
    case 401:
      return 'Please log in to access this page. Your session may have expired.'
    case 500:
      return 'Our servers are having trouble right now. Please try again in a few moments.'
    default:
      return props.error?.message || 'An unexpected error occurred. Please try again or contact support.'
  }
})

const handleError = () => {
  window.location.href = '/'
}

const goBack = () => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = '/'
  }
}
</script>

<style scoped>
/* Additional background pattern */
.bg-dark-900 {
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
  background-size: 40px 40px;
}
</style>
