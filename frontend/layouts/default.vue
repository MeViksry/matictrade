<template>
  <div class="min-h-screen bg-dark-950 transition-colors duration-300">
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/dashboard" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
             <img src="/logo.png" alt="Logo" class="w-6 h-6 object-contain"/>
             </div>
            <span class="text-xm font-bold text-white">MATIC TRADE</span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              :class="[
                isActive(item.path)
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'text-gray-400 hover:text-white hover:bg-dark-800'
              ]"
            >
              {{ item.name }}
            </NuxtLink>
          </div>

          <!-- Right Side -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <UserNotificationBell />

            <!-- User Menu -->
            <div class="relative" ref="userMenuRef">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 p-2 rounded-xl hover:bg-dark-800 transition-colors"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="authStore.user?.avatar" 
                    :src="authStore.user.avatar" 
                    alt="Profile" 
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-white text-sm font-medium">
                    {{ authStore.user?.fullName?.charAt(0) || 'U' }}
                  </span>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Dropdown -->
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-56 card p-2 shadow-xl"
                >
                  <div class="px-4 py-3 border-b border-dark-700">
                    <p class="text-sm font-medium text-white">
                      {{ authStore.user?.fullName }}
                    </p>
                    <p class="text-xs text-gray-400">{{ authStore.user?.email }}</p>
                  </div>
                  <div class="py-1">
                    <NuxtLink
                      to="/dashboard/settings"
                      class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 rounded-lg"
                      @click="showUserMenu = false"
                    >
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      Settings
                    </NuxtLink>
                    <button
                      @click="handleLogout"
                      class="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-900/20 rounded-lg"
                    >
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Mobile Menu Button -->
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="md:hidden p-2 rounded-xl text-gray-400 hover:bg-dark-800"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="showMobileMenu" class="md:hidden border-t border-dark-700">
          <div class="px-4 py-3 space-y-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              class="block px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              :class="[
                isActive(item.path)
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'text-gray-400'
              ]"
              @click="showMobileMenu = false"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Main Content -->
    <main class="pt-20 pb-8 px-3 sm:px-6 lg:px-8 sm:max-w-7xl sm:mx-auto">
      <slot />
    </main>

    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const authStore = useAuthStore()
const route = useRoute()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const navigation = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Portfolio', path: '/dashboard/portfolio' },
  { name: 'Trading', path: '/dashboard/trading' },
  { name: 'Bot Settings', path: '/dashboard/bot' },
  { name: 'API Keys', path: '/dashboard/api-keys' }
]

const isActive = (path: string) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  showUserMenu.value = false
  authStore.logout()
}

onClickOutside(userMenuRef, () => {
  showUserMenu.value = false
})
</script>