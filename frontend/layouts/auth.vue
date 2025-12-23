<template>
  <div class="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center p-4">
    <!-- Background Effects -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary-600/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s;"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <img src="/logo.png" alt="Logo" class="w-7 h-7 object-contain"/>
            </div>
          <span class="text-2xl font-bold text-white">MATIC TRADE</span>
        </NuxtLink>
      </div>

      <!-- Card -->
      <div class="glass rounded-3xl p-8 shadow-2xl">
        <slot />
      </div>

      <!-- Footer -->
      <p class="text-center mt-8 text-sm text-gray-400">
        © {{ new Date().getFullYear() }} Matic Trade. All rights reserved.
      </p>
    </div>
  </div>
</template>