<!-- frontend/components/DashboardStatCard.vue -->
<template>
  <div class="card p-4 md:p-6 card-hover">
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0 flex-1">
        <p class="text-xs sm:text-sm text-gray-400 mb-1 truncate">{{ title }}</p>
        <p class="text-lg sm:text-2xl font-bold truncate" :class="valueClass || 'text-white'">
          {{ value }}
        </p>
        <div v-if="trend" class="flex items-center mt-2">
          <svg
            class="w-3 h-3 sm:w-4 sm:h-4 mr-1"
            :class="trend.isPositive ? 'text-green-500' : 'text-red-500'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="trend.isPositive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'"
            />
          </svg>
          <span
            class="text-xs sm:text-sm font-medium"
            :class="trend.isPositive ? 'text-green-500' : 'text-red-500'"
          >
            {{ trend.value }}%
          </span>
          <span class="text-xs text-gray-500 ml-1 hidden sm:inline">vs last period</span>
        </div>
      </div>
      <div
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        :class="iconBgClass"
      >
        <!-- Wallet Icon -->
        <svg v-if="icon === 'wallet'" class="w-5 h-5 sm:w-6 sm:h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>
        <!-- Chart Icon -->
        <svg v-else-if="icon === 'chart'" class="w-5 h-5 sm:w-6 sm:h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
        </svg>
        <!-- Trophy Icon -->
        <svg v-else-if="icon === 'trophy'" class="w-5 h-5 sm:w-6 sm:h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3h14a2 2 0 012 2v2a5 5 0 01-5 5h-1v4h2a2 2 0 012 2v1H5v-1a2 2 0 012-2h2v-4H8a5 5 0 01-5-5V5a2 2 0 012-2z"/>
        </svg>
        <!-- Activity Icon -->
        <svg v-else-if="icon === 'activity'" class="w-5 h-5 sm:w-6 sm:h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <!-- Default/Fallback Icon -->
        <svg v-else class="w-5 h-5 sm:w-6 sm:h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string
  icon: 'wallet' | 'chart' | 'trophy' | 'activity'
  valueClass?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

const props = defineProps<Props>()

const iconBgClass = computed(() => {
  const classes: Record<string, string> = {
    wallet: 'bg-blue-900/30',
    chart: 'bg-green-900/30',
    trophy: 'bg-yellow-900/30',
    activity: 'bg-purple-900/30'
  }
  return classes[props.icon] || classes.chart
})

const iconColorClass = computed(() => {
  const classes: Record<string, string> = {
    wallet: 'text-blue-400',
    chart: 'text-green-400',
    trophy: 'text-yellow-400',
    activity: 'text-purple-400'
  }
  return classes[props.icon] || classes.chart
})
</script>