<template>
  <div class="min-h-screen bg-dark-950">
    <!-- Fixed Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-xl border-b border-dark-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <img src="/logo.png" alt="MATIC TRADE Logo" class="w-6 h-6 object-contain"/>
            </div>
            <span class="text-lg font-bold text-white">MATIC TRADE</span>
          </NuxtLink>
          <NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <main class="pt-24 pb-16 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span class="text-red-400 text-sm font-medium">Important Notice</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Risk Disclosure</h1>
          <p class="text-gray-400 text-lg">Last updated: {{ lastUpdated }}</p>
        </div>

        <!-- Warning Banner -->
        <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 sm:p-8 mb-10">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-red-400 mb-2">High Risk Warning</h2>
              <p class="text-gray-300 leading-relaxed">
                Trading cryptocurrency futures involves substantial risk of loss and is not suitable for all investors. 
                You could lose more than your initial investment. Please read this entire disclosure carefully before using MATIC TRADE.
              </p>
            </div>
          </div>
        </div>

        <!-- Content Card -->
        <div class="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 sm:p-10">
          <div class="prose prose-invert prose-green max-w-none">
            
            <!-- Nature of Trading -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 text-sm font-bold">1</span>
                Nature of Futures Trading
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">
                Cryptocurrency futures trading is highly speculative and carries a high level of risk. Before trading, you should carefully consider:
              </p>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span>Futures trading involves leverage, which can amplify both gains and losses</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span>Market volatility can lead to rapid and substantial losses</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span>Cryptocurrency markets operate 24/7 and prices can change dramatically at any time</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span>Past performance is not indicative of future results</span>
                </li>
              </ul>
            </section>

            <!-- Leverage Risk -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 text-sm font-bold">2</span>
                Leverage Risk
              </h2>
              <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-4">
                <h3 class="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Leverage Amplifies Risk
                </h3>
                <p class="text-gray-300 text-sm leading-relaxed">
                  Using leverage means you can control a larger position with a smaller amount of capital. While this can increase potential profits, it also significantly increases potential losses. With 3x leverage, a 10% adverse move would result in a 30% loss of your position.
                </p>
              </div>
              <div class="grid sm:grid-cols-3 gap-4">
                <div class="bg-dark-700/50 rounded-xl p-4 text-center">
                  <p class="text-gray-400 text-sm mb-1">1x Leverage</p>
                  <p class="text-white font-bold text-lg">Standard Risk</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4 text-center">
                  <p class="text-gray-400 text-sm mb-1">2x Leverage</p>
                  <p class="text-yellow-400 font-bold text-lg">2x Risk</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4 text-center">
                  <p class="text-gray-400 text-sm mb-1">3x Leverage</p>
                  <p class="text-red-400 font-bold text-lg">3x Risk</p>
                </div>
              </div>
            </section>

            <!-- Liquidation Risk -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 text-sm font-bold">3</span>
                Liquidation Risk
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">
                When trading futures with leverage, your position may be liquidated if the market moves against you:
              </p>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span><strong class="text-white">Forced Liquidation:</strong> Your position may be automatically closed if your margin falls below maintenance requirements</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span><strong class="text-white">Total Loss:</strong> Liquidation can result in the complete loss of your margin</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span><strong class="text-white">Gap Risk:</strong> In volatile markets, prices may gap past your stop-loss, resulting in larger losses than expected</span>
                </li>
              </ul>
            </section>

            <!-- Automated Trading Risks -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 text-sm font-bold">4</span>
                Automated Trading Risks
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">
                Using automated trading systems like MATIC TRADE carries additional risks:
              </p>
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2 flex items-center gap-2">
                    <span class="text-red-500">⚙️</span>
                    System Failures
                  </h4>
                  <p class="text-gray-400 text-sm">Technical issues, server downtime, or connectivity problems may prevent trades from executing</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2 flex items-center gap-2">
                    <span class="text-red-500">🔌</span>
                    Exchange Issues
                  </h4>
                  <p class="text-gray-400 text-sm">Exchange API failures, maintenance, or outages can affect trade execution</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2 flex items-center gap-2">
                    <span class="text-red-500">📊</span>
                    Signal Errors
                  </h4>
                  <p class="text-gray-400 text-sm">Trading signals may be delayed, incorrect, or fail to generate in certain conditions</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2 flex items-center gap-2">
                    <span class="text-red-500">⏱️</span>
                    Execution Delays
                  </h4>
                  <p class="text-gray-400 text-sm">Network latency may cause trades to execute at different prices than expected</p>
                </div>
              </div>
            </section>

            <!-- Market Risks -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 text-sm font-bold">5</span>
                Market Risks
              </h2>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span><strong class="text-white">Extreme Volatility:</strong> Cryptocurrency prices can move 10-50% or more in a single day</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span><strong class="text-white">Liquidity Risk:</strong> In extreme market conditions, it may be difficult to close positions at desired prices</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span><strong class="text-white">Regulatory Risk:</strong> Changes in regulations may affect cryptocurrency trading in your jurisdiction</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span><strong class="text-white">Flash Crashes:</strong> Sudden, severe price drops can trigger cascading liquidations</span>
                </li>
              </ul>
            </section>

            <!-- No Guarantees -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 text-sm font-bold">6</span>
                No Guarantees
              </h2>
              <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <p class="text-gray-300 leading-relaxed">
                  MATIC TRADE does not guarantee profits or protection from losses. We do not provide financial advice. 
                  Any trading decisions are made at your own risk. Past performance of any trading strategy or signal 
                  is not a guarantee of future results.
                </p>
              </div>
            </section>

            <!-- Your Responsibilities -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">7</span>
                Your Responsibilities
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">Before using MATIC TRADE, you should:</p>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Only trade with money you can afford to lose completely</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Understand how futures trading and leverage work</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Conduct your own research before making trading decisions</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Consider seeking advice from a qualified financial advisor</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Monitor your positions regularly and be prepared to intervene manually</span>
                </li>
              </ul>
            </section>

            <!-- Acknowledgment -->
            <section class="mb-6">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">8</span>
                Acknowledgment
              </h2>
              <div class="bg-dark-700/50 rounded-xl p-6">
                <p class="text-gray-300 leading-relaxed">
                  By using MATIC TRADE, you acknowledge that you have read and understood this Risk Disclosure, 
                  that you understand the risks involved in futures trading, and that you accept full responsibility 
                  for any trading losses you may incur.
                </p>
              </div>
            </section>

          </div>
        </div>

        <!-- Contact -->
        <div class="mt-10 bg-dark-800/50 border border-dark-700 rounded-xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 class="text-white font-semibold">Have Questions?</h3>
            <p class="text-gray-400 text-sm">Contact our support team for clarification</p>
          </div>
          <a 
            :href="socialLinks.contactTelegram || '#'" 
            :target="socialLinks.contactTelegram ? '_blank' : '_self'"
            @click="!socialLinks.contactTelegram && $event.preventDefault()"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all no-underline"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            Contact Support
          </a>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-10">
          <NuxtLink to="/" class="inline-flex items-center gap-2 px-6 py-3 border border-dark-600 hover:border-dark-500 text-white font-medium rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-dark-900 border-t border-dark-800 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p class="text-gray-500 text-sm">
          © {{ new Date().getFullYear() }} MATIC TRADE. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

useHead({
  title: 'Risk Disclosure - MATIC TRADE',
  meta: [
    { name: 'description', content: 'Risk disclosure for MATIC TRADE automated futures trading platform. Understand the risks of cryptocurrency futures trading.' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const lastUpdated = 'December 22, 2025'

// Social Links from settings
const socialLinks = reactive({
  contactTelegram: ''
})

const config = useRuntimeConfig()

const loadSocialLinks = async () => {
  try {
    const baseUrl = config.public?.apiBaseUrl || ''
    const response = await fetch(`${baseUrl}/api/settings/social`)
    const data = await response.json()
    if (data.success) {
      socialLinks.contactTelegram = data.data.contactTelegram || ''
    }
  } catch (error) {
    console.error('Failed to load social links:', error)
  }
}

onMounted(() => {
  loadSocialLinks()
})
</script>
