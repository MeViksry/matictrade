<!-- frontend/pages/dashboard/bot.vue -->
<template>
  <div class="space-y-6 animate-in">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">Bot Settings</h1>
        <p class="text-gray-400 mt-1">Configure your automated trading bot</p>
      </div>
    </div>

    <!-- Warning if not active -->
    <div v-if="!authStore.isActive" class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-4">
      <svg class="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <div>
        <h4 class="font-medium text-yellow-500">Account Not Activated</h4>
        <p class="text-sm text-gray-400 mt-1">Your account must be activated by admin before you can enable the bot.</p>
      </div>
    </div>

    <!-- Bot Status Card -->
    <div class="card p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">Bot Status</h3>
            <p class="text-sm text-gray-400 mt-1">
              {{ botStore.isRunning ? 'Your bot is currently running and executing trades' : 'Your bot is stopped and not trading' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bot Toggle -->
      <div class="mt-6 p-4 bg-dark-800 rounded-xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div :class="[
              'w-3 h-3 rounded-full',
              botStore.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            ]"></div>
            <span class="text-xl font-bold" :class="botStore.isRunning ? 'text-green-500' : 'text-gray-500'">
              {{ botStore.isRunning ? 'Running' : 'Stopped' }}
            </span>
          </div>
          <button
            @click="toggleBot"
            :disabled="!authStore.isActive || isToggling"
            class="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="botStore.isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'"
          >
            <svg v-if="isToggling" class="animate-spin h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="botStore.isRunning" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M10 9v6m4-6v6"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ botStore.isRunning ? 'Stop Bot' : 'Start Bot' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Trading Settings Card -->
    <div class="card p-6">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">Trading Settings</h3>
            <p class="text-sm text-gray-400 mt-1">Configure your trading preferences</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="saveSettings">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Default Leverage -->
          <div class="p-4 bg-dark-800 rounded-xl">
            <label class="block text-sm font-medium text-gray-300 mb-3">
              Leverage
            </label>
            <select
              v-model.number="settings.defaultLeverage"
              class="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            >
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="3">3x</option>
            </select>
            <p class="text-xs text-gray-500 mt-2">Maximum 3x leverage for safety</p>
          </div>

          <!-- Order Size -->
          <div class="p-4 bg-dark-800 rounded-xl">
            <label class="block text-sm font-medium text-gray-300 mb-3">
              Order Size (% of Balance)
            </label>
            <input
              v-model.number="settings.riskPerTrade"
              type="number"
              min="1"
              max="100"
              step="1"
              class="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            <p class="text-xs text-gray-500 mt-2">Percentage of available balance per trade</p>
          </div>
        </div>

        <!-- Save Button -->
        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            :disabled="isSaving"
            class="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <svg v-if="isSaving" class="animate-spin h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ isSaving ? 'Saving...' : 'Save Settings' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Exchange Connection Card -->
    <div class="card p-6">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">Exchange Connection</h3>
            <p class="text-sm text-gray-400 mt-1">Your exchange API connection status</p>
          </div>
        </div>
      </div>
      
      <div v-if="hasValidApiKey" class="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <p class="font-medium text-green-400">Exchange API Connected</p>
            <p class="text-sm text-gray-400">Your bot is ready to execute trades</p>
          </div>
        </div>
      </div>

      <div v-else class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-yellow-400">No Exchange API Connected</p>
              <p class="text-sm text-gray-400">Connect your exchange API to start trading</p>
            </div>
          </div>
          <NuxtLink 
            to="/dashboard/api-keys" 
            class="w-full sm:w-auto px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
            <span>Connect API</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- How It Works Info Card -->
    <div class="card p-6 bg-gradient-to-r from-primary-500/5 to-purple-500/5 border-primary-500/10">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-white">How it works</h3>
          <p class="text-sm text-gray-400 mt-1">
            Trading signals from TradingView are automatically processed by the system. 
            You only need to connect your Exchange API and configure your trading preferences above.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const botStore = useBotStore()
const toast = useCustomToast()

const isToggling = ref(false)
const isSaving = ref(false)
const hasValidApiKey = ref(false)

const settings = reactive({
  defaultLeverage: 1,
  riskPerTrade: 10
})

const toggleBot = async () => {
  if (!authStore.isActive) return
  
  isToggling.value = true
  try {
    await botStore.toggleBot(!botStore.isRunning)
    toast.success(
      botStore.isRunning ? 'Bot Started' : 'Bot Stopped',
      botStore.isRunning ? 'Your bot is now running' : 'Your bot has been stopped'
    )
  } catch (error: any) {
    toast.error('Error', error.message)
  } finally {
    isToggling.value = false
  }
}

const saveSettings = async () => {
  // Validate leverage max 3
  if (settings.defaultLeverage > 3) {
    settings.defaultLeverage = 3
  }

  isSaving.value = true
  try {
    await botStore.updateSettings({
      maxPositions: 1, // Always 1 - not configurable by user
      defaultLeverage: settings.defaultLeverage,
      maxLeverage: settings.defaultLeverage, // Same as default for simplified UI
      riskPerTrade: settings.riskPerTrade
    })

    toast.success('Saved', 'Bot settings updated successfully')
  } catch (error: any) {
    toast.error('Error', error.message)
  } finally {
    isSaving.value = false
  }
}

// Check API key status
const checkApiKeyStatus = async () => {
  try {
    const status = await botStore.getStatus()
    hasValidApiKey.value = status?.hasValidApiKey || false
  } catch {
    hasValidApiKey.value = false
  }
}

// Load settings
onMounted(async () => {
  await Promise.all([
    botStore.fetchSettings(),
    checkApiKeyStatus()
  ])

  if (botStore.settings) {
    Object.assign(settings, {
      defaultLeverage: Math.min(botStore.settings.defaultLeverage || 1, 3),
      riskPerTrade: botStore.settings.riskPerTrade || 10
    })
  }
})
</script>