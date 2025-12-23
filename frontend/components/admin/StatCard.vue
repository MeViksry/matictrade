<template>
  <div class="card p-6 hover:shadow-lg transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-400">{{ title }}</p>
        <p class="text-2xl font-bold text-white mt-2">
          {{ isFormatted ? value : formatNumber(value as number) }}
        </p>
        <div v-if="change !== undefined" class="flex items-center mt-2 space-x-1">
          <span
            class="flex items-center text-sm font-medium"
            :class="change >= 0 ? 'text-green-500' : 'text-red-500'"
          >
            <svg
              v-if="change >= 0"
              class="w-4 h-4 mr-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <svg
              v-else
              class="w-4 h-4 mr-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            {{ Math.abs(change) }}%
          </span>
          <span class="text-xs text-gray-400">{{ changeLabel }}</span>
        </div>
      </div>
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center"
        :class="iconBgClass"
      >
        <component :is="iconComponent" class="w-6 h-6" :class="iconColorClass" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconUsers from '~/components/icons/IconActivity.vue'
import IconSubscription from '~/components/icons/IconWallet.vue'
import IconRevenue from '~/components/icons/IconChart.vue'
import IconBot from '~/components/icons/IconBolt.vue'

interface Props {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
  icon: 'users' | 'subscription' | 'revenue' | 'bot'
  color: 'blue' | 'green' | 'purple' | 'orange'
  isFormatted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  changeLabel: 'vs last period',
  isFormatted: false
})

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num)
}

const iconComponent = computed(() => {
  const icons = {
    users: IconUsers,
    subscription: IconSubscription,
    revenue: IconRevenue,
    bot: IconBot
  }
  return icons[props.icon]
})

const iconBgClass = computed(() => {
  const classes = {
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    purple: 'bg-purple-500/20',
    orange: 'bg-orange-500/20'
  }
  return classes[props.color]
})

const iconColorClass = computed(() => {
  const classes = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500'
  }
  return classes[props.color]
})
</script>