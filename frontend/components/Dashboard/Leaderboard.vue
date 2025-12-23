<template>
  <div class="card p-6 h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900 text-white">🏆 Leaderboard</h2>
      <span class="text-xs text-gray-500">Live Rankings</span>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse flex items-center gap-4">
        <div class="w-8 h-8 bg-dark-600 rounded-full"></div>
        <div class="flex-1">
          <div class="h-4 bg-dark-600 rounded w-24"></div>
        </div>
        <div class="h-4 bg-dark-600 rounded w-16"></div>
      </div>
    </div>

    <!-- Leaderboard List -->
    <div v-else-if="leaderboard.length > 0" class="space-y-2 max-h-[400px] overflow-y-auto">
      <div 
        v-for="entry in leaderboard" 
        :key="entry.id"
        class="flex items-center justify-between p-3 rounded-xl transition-colors"
        :class="[
          entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : 'hover:bg-dark-700/50',
          isCurrentUser(entry.id) && 'ring-2 ring-primary-500/50 bg-primary-500/5'
        ]"
      >
        <div class="flex items-center gap-3">
          <!-- Rank Badge -->
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            :class="getRankClass(entry.rank)"
          >
            <span v-if="entry.rank === 1">🥇</span>
            <span v-else-if="entry.rank === 2">🥈</span>
            <span v-else-if="entry.rank === 3">🥉</span>
            <span v-else class="text-gray-500">{{ entry.rank }}</span>
          </div>

          <!-- User Info -->
          <div>
            <p class="font-medium text-white text-sm">
              {{ entry.username }}
              <span v-if="isCurrentUser(entry.id)" class="text-xs text-primary-500 ml-1">(You)</span>
            </p>
            <p class="text-xs text-gray-500">{{ entry.totalTrades }} trades</p>
          </div>
        </div>

        <!-- PNL -->
        <div class="text-right">
          <p 
            class="font-bold text-sm"
            :class="entry.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'"
          >
            {{ entry.totalPnl >= 0 ? '+' : '' }}${{ formatNumber(entry.totalPnl) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <svg class="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
      </svg>
      <p class="text-gray-500 text-sm">No trading data yet</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LeaderboardEntry {
  rank: number
  id: string
  username: string
  totalPnl: number
  totalTrades: number
  winRate: number
}

const props = defineProps<{
  leaderboard: LeaderboardEntry[]
  isLoading: boolean
  currentUserId?: string
}>()

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(value))
}

const getRankClass = (rank: number) => {
  if (rank === 1) return 'bg-yellow-500/20'
  if (rank === 2) return 'bg-gray-800'
  if (rank === 3) return 'bg-orange-500/20'
  return 'bg-dark-700'
}

const isCurrentUser = (id: string) => {
  return props.currentUserId === id
}
</script>
