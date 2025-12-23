<template>
  <span class="inline-flex flex-col">
    <svg
      class="w-3 h-3 -mb-1"
      :class="active && direction === 'asc' ? 'text-primary-500' : 'text-gray-300'"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 3l-7 7h14l-7-7z" />
    </svg>
    <svg
      class="w-3 h-3"
      :class="active && direction === 'desc' ? 'text-primary-500' : 'text-gray-300'"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 17l7-7H3l7 7z" />
    </svg>
  </span>
</template>

<script setup lang="ts">
interface Props {
  active: boolean
  direction: 'asc' | 'desc'
}

defineProps<Props>()
</script>