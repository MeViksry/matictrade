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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span class="text-green-400 text-sm font-medium">Your Privacy Matters</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p class="text-gray-400 text-lg">Last updated: {{ lastUpdated }}</p>
        </div>

        <!-- Content Card -->
        <div class="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 sm:p-10">
          <div class="prose prose-invert prose-green max-w-none">
            
            <!-- Introduction -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">1</span>
                Introduction
              </h2>
              <p class="text-gray-300 leading-relaxed">
                Welcome to MATIC TRADE ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our automated futures trading platform.
              </p>
              <p class="text-gray-300 leading-relaxed mt-4">
                By accessing or using MATIC TRADE, you agree to the terms of this Privacy Policy. If you do not agree with the terms, please do not access the platform.
              </p>
            </section>

            <!-- Information We Collect -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">2</span>
                Information We Collect
              </h2>
              
              <h3 class="text-lg font-semibold text-white mt-6 mb-3">Personal Information</h3>
              <p class="text-gray-300 leading-relaxed mb-4">We may collect the following personal information:</p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Account Information:</strong> Name, email address, phone number</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Payment Information:</strong> Transaction records, payment method details</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Exchange API Keys:</strong> Encrypted and stored securely for trading execution</span>
                </li>
              </ul>

              <h3 class="text-lg font-semibold text-white mt-6 mb-3">Automatically Collected Information</h3>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Device Information:</strong> IP address, browser type, operating system</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Usage Data:</strong> Pages visited, features used, trading activity logs</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Cookies:</strong> Session data for authentication and preferences</span>
                </li>
              </ul>
            </section>

            <!-- How We Use Your Information -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">3</span>
                How We Use Your Information
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">We use your information for the following purposes:</p>
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">🔐 Service Provision</h4>
                  <p class="text-gray-400 text-sm">Execute trades, manage your account, and provide platform features</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">📊 Analytics</h4>
                  <p class="text-gray-400 text-sm">Improve our services and develop new features</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">📧 Communication</h4>
                  <p class="text-gray-400 text-sm">Send important updates, notifications, and support responses</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">🛡️ Security</h4>
                  <p class="text-gray-400 text-sm">Detect and prevent fraud, unauthorized access, and abuse</p>
                </div>
              </div>
            </section>

            <!-- Data Security -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">4</span>
                Data Security
              </h2>
              <div class="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 mb-4">
                <p class="text-gray-300 leading-relaxed">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul class="mt-4 space-y-3">
                  <li class="flex items-center gap-3 text-gray-300">
                    <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <span><strong class="text-white">AES-256 Encryption</strong> for API keys and sensitive data</span>
                  </li>
                  <li class="flex items-center gap-3 text-gray-300">
                    <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    </div>
                    <span><strong class="text-white">SSL/TLS</strong> for all data transmission</span>
                  </li>
                  <li class="flex items-center gap-3 text-gray-300">
                    <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>
                      </svg>
                    </div>
                    <span><strong class="text-white">Secure Servers</strong> with regular security audits</span>
                  </li>
                </ul>
              </div>
            </section>

            <!-- Third-Party Sharing -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">5</span>
                Third-Party Sharing
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">
                We do <strong class="text-white">not sell</strong> your personal information. We may share data with:
              </p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Exchange Partners:</strong> Binance, OKX, Bitget (for trade execution only)</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Service Providers:</strong> Hosting, analytics, and payment processors</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Legal Requirements:</strong> When required by law or to protect rights</span>
                </li>
              </ul>
            </section>

            <!-- Your Rights -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">6</span>
                Your Rights
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">You have the right to:</p>
              <div class="grid sm:grid-cols-2 gap-3">
                <div class="flex items-center gap-3 bg-dark-700/50 rounded-lg p-3">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <span class="text-gray-300 text-sm">Access your data</span>
                </div>
                <div class="flex items-center gap-3 bg-dark-700/50 rounded-lg p-3">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  <span class="text-gray-300 text-sm">Update your information</span>
                </div>
                <div class="flex items-center gap-3 bg-dark-700/50 rounded-lg p-3">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  <span class="text-gray-300 text-sm">Delete your account</span>
                </div>
                <div class="flex items-center gap-3 bg-dark-700/50 rounded-lg p-3">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  <span class="text-gray-300 text-sm">Export your data</span>
                </div>
              </div>
            </section>

            <!-- Contact -->
            <section class="mb-6">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">7</span>
                Contact Us
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div class="bg-dark-700/50 rounded-xl p-6">
                <div class="flex flex-col sm:flex-row items-center gap-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                  <div class="text-center sm:text-left flex-1">
                    <p class="text-white font-semibold text-lg mb-1">Telegram Support</p>
                    <p class="text-gray-400 text-sm">Get help from our support team</p>
                  </div>
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
              </div>
            </section>

          </div>
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
  title: 'Privacy Policy - MATIC TRADE',
  meta: [
    { name: 'description', content: 'Privacy Policy for MATIC TRADE automated futures trading platform. Learn how we collect, use, and protect your data.' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const lastUpdated = 'December 21, 2025'

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
