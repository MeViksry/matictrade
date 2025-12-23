<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
    <!-- Background Effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 text-center px-6 py-12 max-w-lg mx-auto">
      <!-- Maintenance Icon -->
      <div class="mb-8">
        <div class="w-32 h-32 mx-auto bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
          <svg class="w-16 h-16 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
        Under Maintenance
      </h1>

      <!-- Subtitle -->
      <p class="text-lg text-gray-400 mb-8">
        We're currently performing scheduled maintenance to improve your experience. 
        We'll be back shortly!
      </p>

      <!-- Info Box -->
      <div class="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6 mb-8">
        <div class="flex items-center justify-center gap-3 text-amber-400 mb-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Estimated Downtime</span>
        </div>
        <p class="text-gray-300">
          Our team is working hard to get things back up and running. 
          Please check back soon.
        </p>
      </div>

      <!-- Refresh Button -->
      <button
        @click="checkStatus"
        :disabled="checking"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg 
          class="w-5 h-5" 
          :class="{ 'animate-spin': checking }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ checking ? 'Checking...' : 'Check Status' }}
      </button>

      <!-- Footer -->
      <div class="mt-12 text-gray-500 text-sm">
        <p>{{ platformName }} &copy; {{ new Date().getFullYear() }}</p>
        <p class="mt-1">For urgent matters, contact support</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const checking = ref(false)
const platformName = ref('MaticTrade')
const config = useRuntimeConfig()

const checkStatus = async () => {
  checking.value = true
  const apiBase = config.public.apiBaseUrl || 'http://localhost:3001'
  
  try {
    const response = await $fetch<{ success: boolean; data: { maintenanceMode: boolean; platformName: string } }>(
      `${apiBase}/auth/status`
    )
    
    if (response.success && !response.data.maintenanceMode) {
      // Maintenance is over, redirect to home
      navigateTo('/')
    }
    
    platformName.value = response.data?.platformName || 'MaticTrade'
  } catch (error) {
    console.error('Failed to check status:', error)
  } finally {
    checking.value = false
  }
}

// Check status on mount
onMounted(async () => {
  const apiBase = config.public.apiBaseUrl || 'http://localhost:3001'
  try {
    const response = await $fetch<{ success: boolean; data: { maintenanceMode: boolean; platformName: string } }>(
      `${apiBase}/auth/status`
    )
    platformName.value = response.data?.platformName || 'MaticTrade'
  } catch (error) {
    // Ignore
  }
})
</script>
