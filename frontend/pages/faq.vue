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
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-green-400 text-sm font-medium">Help Center</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">Find answers to common questions about MATIC TRADE</p>
        </div>

        <!-- Search -->
        <div class="relative mb-10">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search for answers..."
            class="w-full px-5 py-4 pl-12 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Categories -->
        <div class="flex flex-wrap gap-2 mb-10 justify-center">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="activeCategory = category"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="activeCategory === category ? 'bg-green-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'"
          >
            {{ category }}
          </button>
        </div>

        <!-- FAQ Items -->
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            class="bg-dark-800/50 border border-dark-700 rounded-xl overflow-hidden hover:border-dark-600 transition-colors"
          >
            <button 
              @click="toggleFaq(index)"
              class="w-full px-6 py-5 flex items-center justify-between text-left"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-green-500 text-lg">{{ faq.icon }}</span>
                </div>
                <span class="text-white font-medium pr-4">{{ faq.question }}</span>
              </div>
              <svg 
                class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200"
                :class="openFaqs.includes(index) ? 'rotate-180' : ''"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="openFaqs.includes(index)" class="px-6 pb-5">
                <div class="pl-14 text-gray-400 leading-relaxed" v-html="faq.answer"></div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredFaqs.length === 0" class="text-center py-16">
          <div class="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-white font-medium mb-2">No results found</h3>
          <p class="text-gray-500">Try a different search term or category</p>
        </div>

        <!-- Still Have Questions -->
        <div class="mt-16 bg-gradient-to-br from-green-500/10 via-dark-800 to-dark-800 border border-green-500/20 rounded-2xl p-8 text-center">
          <div class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white mb-3">Still Have Questions?</h2>
          <p class="text-gray-400 mb-6 max-w-lg mx-auto">
            Can't find what you're looking for? Our support team is here to help you 24/7.
          </p>
          <a 
            :href="socialLinks.contactTelegram || '#'" 
            :target="socialLinks.contactTelegram ? '_blank' : '_self'"
            @click="!socialLinks.contactTelegram && $event.preventDefault()"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all no-underline"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            Contact on Telegram
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
  title: 'FAQ - MATIC TRADE',
  meta: [
    { name: 'description', content: 'Frequently asked questions about MATIC TRADE automated futures trading platform. Get answers to common questions.' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const searchQuery = ref('')
const activeCategory = ref('All')
const openFaqs = ref<number[]>([])

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

const categories = ['All', 'Getting Started', 'Trading', 'API & Security', 'Billing', 'Technical']

const faqs = [
  // Getting Started
  {
    category: 'Getting Started',
    icon: '🚀',
    question: 'What is MATIC TRADE?',
    answer: 'MATIC TRADE is an automated futures trading platform that connects to your exchange accounts (Binance, OKX, Bitget) and executes trades based on signals from TradingView. It allows you to automate your trading strategy without manual intervention.'
  },
  {
    category: 'Getting Started',
    icon: '📝',
    question: 'How do I get started?',
    answer: `Getting started is easy:<br><br>
    <strong>1.</strong> Create an account on MATIC TRADE<br>
    <strong>2.</strong> Connect your exchange API keys (trading permission only)<br>
    <strong>3.</strong> Configure your trading settings (leverage, position size)<br>
    <strong>4.</strong> Enable the bot and let it execute trades automatically`
  },
  {
    category: 'Getting Started',
    icon: '🏦',
    question: 'Which exchanges are supported?',
    answer: 'Currently, we support <strong>Binance Futures</strong>, <strong>OKX Futures</strong>, and <strong>Bitget Futures</strong>. More exchanges will be added in the future based on user demand.'
  },
  // Trading
  {
    category: 'Trading',
    icon: '📊',
    question: 'How does the automated trading work?',
    answer: 'Our system receives trading signals from TradingView via webhooks. When a signal is received, the bot automatically executes the trade on your connected exchange according to your configured settings (leverage, position size, etc.).'
  },
  {
    category: 'Trading',
    icon: '⚡',
    question: 'What is the execution speed?',
    answer: 'Our average execution speed is <strong>under 50 milliseconds</strong>. This ensures minimal slippage and quick order placement when signals are received.'
  },
  {
    category: 'Trading',
    icon: '📈',
    question: 'What leverage can I use?',
    answer: 'For safety, we limit maximum leverage to <strong>3x</strong>. This helps manage risk and prevents excessive losses from volatile market movements. You can choose 1x, 2x, or 3x leverage in your settings.'
  },
  {
    category: 'Trading',
    icon: '🎯',
    question: 'Can I set stop loss and take profit?',
    answer: 'Yes! Stop loss and take profit are automatically managed based on the TradingView signals. The system executes the exact parameters specified in the trading alerts.'
  },
  // API & Security
  {
    category: 'API & Security',
    icon: '🔐',
    question: 'Is my API key safe?',
    answer: 'Absolutely! Your API keys are encrypted using <strong>AES-256 encryption</strong> and stored securely. We only require trading permissions - never enable withdrawal permissions on your API keys.'
  },
  {
    category: 'API & Security',
    icon: '🛡️',
    question: 'What permissions should I enable on my API key?',
    answer: `Only enable the following permissions:<br><br>
    <strong>✓ Enable Trading</strong> - Required for executing trades<br>
    <strong>✓ Enable Futures</strong> - Required for futures trading<br>
    <strong>✗ Do NOT enable Withdrawal</strong> - Never needed<br><br>
    Also, add our IP address to your whitelist for additional security.`
  },
  {
    category: 'API & Security',
    icon: '🌐',
    question: 'What is IP Whitelisting?',
    answer: 'IP Whitelisting adds an extra layer of security by only allowing API access from our server\'s IP address. You can find our IP address in the API Keys section of your dashboard. Add it to your exchange\'s API whitelist settings.'
  },
  // Billing
  {
    category: 'Billing',
    icon: '💳',
    question: 'What payment methods do you accept?',
    answer: 'We accept cryptocurrency payments, specifically <strong>USDT (Tether)</strong>. Payment is processed manually - contact admin after making payment for account activation.'
  },
  {
    category: 'Billing',
    icon: '🔄',
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel anytime. Your access will continue until the end of your current billing period. After cancellation, your bot will stop executing trades but you can still access your account.'
  },
  {
    category: 'Billing',
    icon: '💰',
    question: 'Do you offer refunds?',
    answer: 'We do not offer refunds for partial subscription periods. Please try our free tier to evaluate the platform before upgrading to a paid plan.'
  },
  // Technical
  {
    category: 'Technical',
    icon: '🔗',
    question: 'How do I set up TradingView webhooks?',
    answer: `In TradingView, create an alert and use our webhook URL from your dashboard. The signal format should include:<br><br>
    <code class="bg-dark-700 px-2 py-1 rounded text-green-400">{"symbol": "BTCUSDT", "side": "buy", "leverage": 3}</code><br><br>
    Full documentation is available in your dashboard.`
  },
  {
    category: 'Technical',
    icon: '🔴',
    question: 'What happens if the bot stops working?',
    answer: 'If there\'s an issue, we\'ll notify you via email and platform notification. Your open positions remain on your exchange - they won\'t be automatically closed. You can always manage positions directly on your exchange.'
  },
  {
    category: 'Technical',
    icon: '📱',
    question: 'Is there a mobile app?',
    answer: 'Currently, MATIC TRADE is a web-based platform optimized for both desktop and mobile browsers. A dedicated mobile app is on our roadmap for future development.'
  }
]

const filteredFaqs = computed(() => {
  let result = faqs
  
  if (activeCategory.value !== 'All') {
    result = result.filter(faq => faq.category === activeCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    )
  }
  
  return result
})

const toggleFaq = (index: number) => {
  const faqIndex = openFaqs.value.indexOf(index)
  if (faqIndex > -1) {
    openFaqs.value.splice(faqIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}
</script>

<style scoped>
code {
  font-family: monospace;
  font-size: 0.875rem;
}
</style>
