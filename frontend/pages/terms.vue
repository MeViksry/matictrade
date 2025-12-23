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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-green-400 text-sm font-medium">Legal Agreement</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p class="text-gray-400 text-lg">Last updated: {{ lastUpdated }}</p>
        </div>

        <!-- Content Card -->
        <div class="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 sm:p-10">
          <div class="prose prose-invert prose-green max-w-none">
            
            <!-- Agreement -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">1</span>
                Agreement to Terms
              </h2>
              <p class="text-gray-300 leading-relaxed">
                By accessing or using MATIC TRADE ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
              </p>
              <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-4">
                <p class="text-yellow-400 text-sm flex items-start gap-2">
                  <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span><strong>Important:</strong> You must be at least 18 years old to use this Service.</span>
                </p>
              </div>
            </section>

            <!-- Description of Service -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">2</span>
                Description of Service
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">
                MATIC TRADE is an automated futures trading platform that:
              </p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Receives trading signals from TradingView via webhooks</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Executes trades on supported exchanges (Binance, OKX, Bitget)</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Provides portfolio tracking and analytics</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Manages trading bot settings and configurations</span>
                </li>
              </ul>
            </section>

            <!-- Account Responsibilities -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">3</span>
                Account Responsibilities
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">When you create an account, you agree to:</p>
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">🔐 Secure Your Account</h4>
                  <p class="text-gray-400 text-sm">Keep your login credentials and API keys confidential</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">✅ Accurate Information</h4>
                  <p class="text-gray-400 text-sm">Provide true and accurate information during registration</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">📢 Report Issues</h4>
                  <p class="text-gray-400 text-sm">Notify us immediately of any unauthorized access</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">⚖️ Legal Compliance</h4>
                  <p class="text-gray-400 text-sm">Ensure trading is legal in your jurisdiction</p>
                </div>
              </div>
            </section>

            <!-- API Keys -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">4</span>
                API Keys & Exchange Access
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">By connecting your exchange API:</p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>You authorize us to execute trades on your behalf</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>You confirm that only trading permissions are enabled (no withdrawal)</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>You understand that API keys are encrypted with AES-256</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>You can revoke access at any time by deleting your API keys</span>
                </li>
              </ul>
            </section>

            <!-- Risk Disclosure -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 text-sm font-bold">5</span>
                Risk Disclosure
              </h2>
              <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <h4 class="text-red-400 font-semibold mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  Important Risk Warning
                </h4>
                <ul class="space-y-3 text-gray-300 text-sm">
                  <li class="flex items-start gap-2">
                    <span class="text-red-400">•</span>
                    <span><strong class="text-white">Futures trading involves substantial risk</strong> and is not suitable for all investors</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-red-400">•</span>
                    <span><strong class="text-white">You may lose more than your initial investment</strong> due to leveraged positions</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-red-400">•</span>
                    <span><strong class="text-white">Past performance is not indicative</strong> of future results</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-red-400">•</span>
                    <span><strong class="text-white">Only trade with capital you can afford to lose</strong></span>
                  </li>
                </ul>
              </div>
            </section>

            <!-- Limitation of Liability -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">6</span>
                Limitation of Liability
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">
                MATIC TRADE shall not be liable for:
              </p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>Trading losses or missed opportunities</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>Exchange API failures or downtime</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>Incorrect signal execution due to market conditions</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>Any indirect, incidental, or consequential damages</span>
                </li>
              </ul>
            </section>

            <!-- Payment Terms -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">7</span>
                Payment & Subscription
              </h2>
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">💳 Payment Methods</h4>
                  <p class="text-gray-400 text-sm">We accept cryptocurrency payments (USDT)</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">🔄 Billing Cycle</h4>
                  <p class="text-gray-400 text-sm">Subscriptions are billed monthly or yearly</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">❌ Refund Policy</h4>
                  <p class="text-gray-400 text-sm">No refunds for partial subscription periods</p>
                </div>
                <div class="bg-dark-700/50 rounded-xl p-4">
                  <h4 class="text-white font-medium mb-2">⏸️ Cancellation</h4>
                  <p class="text-gray-400 text-sm">Cancel anytime, access until period ends</p>
                </div>
              </div>
            </section>

            <!-- Prohibited Activities -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">8</span>
                Prohibited Activities
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">You agree NOT to:</p>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                  </svg>
                  <span>Use the service for money laundering or illegal activities</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                  </svg>
                  <span>Attempt to hack, exploit, or disrupt the platform</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                  </svg>
                  <span>Share your account or resell access</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                  </svg>
                  <span>Manipulate markets or engage in wash trading</span>
                </li>
              </ul>
            </section>

            <!-- Termination -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">9</span>
                Termination
              </h2>
              <p class="text-gray-300 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
              </p>
              <p class="text-gray-300 leading-relaxed mt-4">
                Upon termination, your right to use the Service will cease immediately. All provisions of the Terms which by their nature should survive termination shall survive.
              </p>
            </section>

            <!-- Changes -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">10</span>
                Changes to Terms
              </h2>
              <p class="text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or platform notification. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <!-- Contact -->
            <section class="mb-6">
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm font-bold">11</span>
                Contact Us
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
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
  title: 'Terms of Service - MATIC TRADE',
  meta: [
    { name: 'description', content: 'Terms of Service for MATIC TRADE automated futures trading platform. Read our terms before using the service.' },
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
