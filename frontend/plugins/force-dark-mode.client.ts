// frontend/plugins/force-dark-mode.client.ts
export default defineNuxtPlugin({
  name: 'force-dark-mode',
  enforce: 'pre', // Run before other plugins
  setup() {
    // Immediately add dark class to prevent flash
    if (import.meta.client) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-color-mode', 'dark')
    }
    
    // Also set via color mode composable
    const colorMode = useColorMode()
    colorMode.preference = 'dark'
  }
})
