<template>
  <div class="min-h-screen bg-dark-950">
    <!-- Fixed Navbar -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-xl border-b border-dark-800"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
            >
              <img
                src="/logo.png"
                alt="MATIC TRADE Logo"
                class="w-6 h-6 object-contain"
              />
            </div>
            <span class="text-lg font-bold text-white">MATIC TRADE</span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-8">
            <a
              href="#home"
              class="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >Home</a
            >
            <a
              href="#features"
              class="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >Features</a
            >
            <a
              href="#trading-portfolio"
              class="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >Portfolio</a
            >
            <a
              href="#how-it-works"
              class="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >How It Works</a
            >

            <a
              href="#testimonials"
              class="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >Reviews</a
            >
            <a
              href="#contact"
              class="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >Contact</a
            >
            <NuxtLink
              to="/blog"
              class="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >Blog</NuxtLink
            >
          </div>

          <!-- Desktop CTA -->
          <div class="hidden lg:flex items-center space-x-4">
            <NuxtLink
              to="/auth/login"
              class="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25"
            >
              Login
            </NuxtLink>
            <button
              @click="openChatPopup"
              class="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25"
            >
              Get Started
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-dark-800"
          >
            <svg
              v-if="!mobileMenuOpen"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="mobileMenuOpen"
            class="lg:hidden py-4 border-t border-dark-800"
          >
            <div class="flex flex-col space-y-3">
              <a
                href="#home"
                @click="mobileMenuOpen = false"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                >Home</a
              >
              <a
                href="#features"
                @click="mobileMenuOpen = false"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                >Features</a
              >
              <a
                href="#trading-portfolio"
                @click="mobileMenuOpen = false"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                >Portfolio</a
              >
              <a
                href="#how-it-works"
                @click="mobileMenuOpen = false"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                >How It Works</a
              >

              <a
                href="#testimonials"
                @click="mobileMenuOpen = false"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                >Reviews</a
              >
              <a
                href="#contact"
                @click="mobileMenuOpen = false"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                >Contact</a
              >
              <NuxtLink
                to="/blog"
                @click="mobileMenuOpen = false"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                >Blog</NuxtLink
              >
              <div class="pt-4 px-4 border-t border-dark-800 space-y-3">
                <NuxtLink
                  to="/auth/login"
                  @click="mobileMenuOpen = false"
                  class="block w-full py-3 text-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all"
                  >Login</NuxtLink
                >
                <button
                  @click="openChatPopup(); mobileMenuOpen = false"
                  class="block w-full py-3 text-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all"
                  >Get Started</button
                >
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="relative pt-24 pb-20 overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 pointer-events-none">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-20 right-10 w-96 h-96 bg-green-600/10 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 2s"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-green-500/5 to-transparent rounded-full"
        ></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 lg:pt-20">
        <div class="text-center">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-8"
          >
            <span
              class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            ></span>
            <span class="text-green-400 text-sm font-medium"
              >Live Trading · Real-time Signals</span
            >
          </div>

          <h1
            class="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Automate Your
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-500 to-emerald-400"
            >
              Futures Trading</span
            >
          </h1>
          <p
            class="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Copy trading signals from TradingView directly to your exchange.
            Support <span class="text-white font-medium">Binance</span>,
            <span class="text-white font-medium">OKX</span>, and
            <span class="text-white font-medium">Bitget</span> Futures with
            lightning-fast execution.
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <NuxtLink
              to="/auth/login"
              class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-green-500/30 flex items-center justify-center gap-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Start Trading Now
            </NuxtLink>
            <a
              :href="watchDemoHref"
              :target="watchDemoTarget"
              class="w-full sm:w-auto px-8 py-4 border border-dark-600 hover:border-dark-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Watch Demo
            </a>
          </div>

          <!-- Live Stats -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div
              v-for="stat in liveStats"
              :key="stat.label"
              class="bg-dark-800/50 backdrop-blur-xl border border-dark-700 rounded-2xl p-4 sm:p-6 text-center hover:border-green-500/30 transition-colors"
            >
              <div
                class="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400"
              >
                {{ stat.value }}
              </div>
              <div class="text-gray-400 text-sm mt-1">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Supported Exchanges -->
    <section class="py-12 border-y border-dark-800 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <p class="text-center text-gray-500 text-sm mb-8">
          TRUSTED BY TRADERS ON TOP EXCHANGES
        </p>
        <div class="relative">
          <div class="flex animate-marquee gap-16">
            <!-- First set -->
            <div
              class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <img src="/images/binance.svg" alt="Binance" class="w-8 h-8" />
              <span class="text-lg font-semibold">Binance</span>
            </div>
            <div
              class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <img src="/images/okx.svg" alt="OKX" class="w-8 h-8" />
              <span class="text-lg font-semibold">OKX</span>
            </div>
            <div
              class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <img src="/images/bitget.svg" alt="Bitget" class="w-8 h-8" />
              <span class="text-lg font-semibold">Bitget</span>
            </div>
            <!-- Duplicate for seamless loop -->
            <div
              class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <img src="/images/binance.svg" alt="Binance" class="w-8 h-8" />
              <span class="text-lg font-semibold">Binance</span>
            </div>
            <div
              class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <img src="/images/okx.svg" alt="OKX" class="w-8 h-8" />
              <span class="text-lg font-semibold">OKX</span>
            </div>
            <div
              class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <img src="/images/bitget.svg" alt="Bitget" class="w-8 h-8" />
              <span class="text-lg font-semibold">Bitget</span>
            </div>
            <!-- Third set for smoother loop -->
            <div
              class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <img src="/images/binance.svg" alt="Binance" class="w-8 h-8" />
              <span class="text-lg font-semibold">Binance</span>
            </div>
            <div
              class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <img src="/images/okx.svg" alt="OKX" class="w-8 h-8" />
              <span class="text-lg font-semibold">OKX</span>
            </div>
            <div
              class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <img src="/images/bitget.svg" alt="Bitget" class="w-8 h-8" />
              <span class="text-lg font-semibold">Bitget</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 sm:py-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <span
            class="text-green-500 text-sm font-semibold uppercase tracking-wider"
            >Features</span
          >
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-6"
          >
            Powerful Trading Automation
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to automate your futures trading with
            institutional-grade tools.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group bg-dark-800/50 backdrop-blur-xl border border-dark-700 rounded-2xl p-6 sm:p-8 hover:border-green-500/50 transition-all hover:-translate-y-1"
          >
            <div
              class="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
            >
              <component :is="feature.icon" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-gray-400 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Live Trading Data Section -->
    <section id="trading-data" class="py-16 sm:py-24 bg-dark-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-8 sm:mb-12">
          <span
            class="text-green-500 text-sm font-semibold uppercase tracking-wider"
            >Trading Data</span
          >
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 mb-4"
          >
            Real-Time Performance
          </h2>
          <p class="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Live trading signals and robot performance metrics from our
            platform.
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="statsLoading" class="flex items-center justify-center py-16">
          <div
            class="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"
          ></div>
        </div>

        <div
          v-else
          class="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6"
        >
          <!-- Left Column: Charts -->
          <div class="lg:col-span-2 space-y-4 sm:space-y-6">
            <!-- Net PnL Chart -->
            <div
              class="bg-dark-800/50 border border-dark-700 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div class="flex items-center justify-between mb-4 sm:mb-6">
                <h3
                  class="text-sm sm:text-lg font-semibold text-white flex items-center gap-2"
                >
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  Net PnL (Monthly)
                </h3>
                <span
                  class="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full flex items-center gap-1"
                >
                  <span
                    class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
                  ></span>
                  LIVE
                </span>
              </div>
              <div class="h-40 sm:h-56 relative">
                <!-- Simple SVG Line Chart -->
                <svg
                  class="w-full h-full"
                  viewBox="0 0 400 160"
                  preserveAspectRatio="none"
                >
                  <!-- Grid Lines -->
                  <line
                    x1="0"
                    y1="40"
                    x2="400"
                    y2="40"
                    stroke="#374151"
                    stroke-width="1"
                    stroke-dasharray="4"
                  />
                  <line
                    x1="0"
                    y1="80"
                    x2="400"
                    y2="80"
                    stroke="#374151"
                    stroke-width="1"
                    stroke-dasharray="4"
                  />
                  <line
                    x1="0"
                    y1="120"
                    x2="400"
                    y2="120"
                    stroke="#374151"
                    stroke-width="1"
                    stroke-dasharray="4"
                  />
                  <!-- Line Path -->
                  <path
                    :d="pnlChartPath"
                    fill="none"
                    stroke="url(#greenGradient)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- Area Fill -->
                  <path
                    :d="pnlAreaPath"
                    fill="url(#areaGradient)"
                    opacity="0.3"
                  />
                  <!-- Data Points -->
                  <circle
                    v-for="(point, i) in pnlChartPoints"
                    :key="i"
                    :cx="point.x"
                    :cy="point.y"
                    r="4"
                    fill="#22c55e"
                    stroke="#0a0a0a"
                    stroke-width="2"
                  />
                  <!-- Gradients -->
                  <defs>
                    <linearGradient
                      id="greenGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" style="stop-color: #22c55e" />
                      <stop offset="100%" style="stop-color: #16a34a" />
                    </linearGradient>
                    <linearGradient
                      id="areaGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="stop-color: #22c55e; stop-opacity: 0.5"
                      />
                      <stop
                        offset="100%"
                        style="stop-color: #22c55e; stop-opacity: 0"
                      />
                    </linearGradient>
                  </defs>
                </svg>
                <!-- X-axis Labels -->
                <div
                  class="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] sm:text-xs text-gray-500 pt-2 overflow-x-auto"
                >
                  <span
                    v-for="(month, i) in chartMonths"
                    :key="i"
                    class="flex-shrink-0 text-center px-0.5"
                    >{{ month }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Win/Loss Ratio Chart -->
            <div
              class="bg-dark-800/50 border border-dark-700 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div class="flex items-center justify-between mb-4 sm:mb-6">
                <h3
                  class="text-sm sm:text-lg font-semibold text-white flex items-center gap-2"
                >
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  Win/Loss Ratio (Monthly)
                </h3>
                <span
                  class="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full flex items-center gap-1"
                >
                  <span
                    class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
                  ></span>
                  LIVE
                </span>
              </div>
              <div class="h-32 sm:h-44">
                <!-- Bar Chart -->
                <div
                  class="flex items-end justify-between h-full gap-0.5 sm:gap-2 overflow-x-auto"
                >
                  <div
                    v-for="(month, i) in platformStats?.monthlyPnl || []"
                    :key="i"
                    class="flex-1 min-w-[20px] flex flex-col items-center gap-0.5"
                  >
                    <div
                      class="w-full flex flex-col gap-0.5"
                      style="height: 100px"
                    >
                      <!-- Win Bar -->
                      <div
                        class="w-full bg-green-500 rounded-t transition-all"
                        :style="{ height: getBarHeight(month.wins) + 'px' }"
                      ></div>
                      <!-- Loss Bar -->
                      <div
                        class="w-full bg-red-500 rounded-b transition-all"
                        :style="{ height: getBarHeight(month.losses) + 'px' }"
                      ></div>
                    </div>
                    <span
                      class="text-[8px] sm:text-xs text-gray-500 whitespace-nowrap"
                      >{{ month.month }}</span
                    >
                  </div>
                </div>
              </div>
              <!-- Legend -->
              <div
                class="flex items-center justify-center gap-4 sm:gap-6 mt-3 sm:mt-4"
              >
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <div
                    class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded"
                  ></div>
                  <span class="text-xs sm:text-sm text-gray-400">Wins</span>
                </div>
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <div
                    class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded"
                  ></div>
                  <span class="text-xs sm:text-sm text-gray-400">Losses</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Performance Metrics -->
          <div class="space-y-4 sm:space-y-6">
            <!-- Performance Header -->
            <div
              class="bg-dark-800/50 border border-dark-700 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div class="flex items-center justify-between mb-3 sm:mb-4">
                <h3
                  class="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider"
                >
                  Performance Metrics
                </h3>
                <span
                  class="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] sm:text-xs font-medium rounded"
                  >RUNNING</span
                >
              </div>

              <!-- Total Net PnL -->
              <div
                class="bg-dark-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4"
              >
                <div class="flex items-center justify-between mb-1 sm:mb-2">
                  <span class="text-xs sm:text-sm text-gray-400"
                    >TOTAL NET PNL</span
                  >
                  <span class="text-[10px] sm:text-xs text-gray-500"
                    >ALL TIME</span
                  >
                </div>
                <p
                  class="text-2xl sm:text-3xl font-bold"
                  :class="
                    (platformStats?.totalNetPnl || 0) >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  "
                >
                  {{ (platformStats?.totalNetPnl || 0) >= 0 ? "+" : ""
                  }}{{ formatCurrency(platformStats?.totalNetPnl || 0) }}
                </p>
              </div>

              <!-- Win/Loss Stats -->
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <div
                  class="bg-dark-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center"
                >
                  <p
                    class="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1"
                  >
                    TOTAL WIN
                  </p>
                  <p class="text-lg sm:text-xl font-bold text-green-500">
                    {{ formatNumber(platformStats?.totalWins || 0) }}
                  </p>
                </div>
                <div
                  class="bg-dark-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center"
                >
                  <p
                    class="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1"
                  >
                    TOTAL LOSS
                  </p>
                  <p class="text-lg sm:text-xl font-bold text-red-500">
                    {{ formatNumber(platformStats?.totalLosses || 0) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Trading Stats -->
            <div
              class="bg-dark-800/50 border border-dark-700 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <h3
                class="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2"
              >
                <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                Trading Stats
              </h3>
              <div class="space-y-2 sm:space-y-3">
                <div
                  class="flex items-center justify-between py-1.5 sm:py-2 border-b border-dark-700"
                >
                  <span class="text-xs sm:text-sm text-gray-400"
                    >TRADING SIGNALS</span
                  >
                  <span class="text-sm sm:text-base text-white font-semibold">{{
                    formatNumber(platformStats?.totalSignals || 0)
                  }}</span>
                </div>
                <div
                  class="flex items-center justify-between py-1.5 sm:py-2 bg-green-500/10 rounded-lg px-2 sm:px-3 -mx-2 sm:-mx-3"
                >
                  <span class="text-xs sm:text-sm text-green-400"
                    >TRADING BOTS</span
                  >
                  <span class="text-sm sm:text-base text-green-500 font-bold">{{
                    platformStats?.activeBots || 0
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Risk Analysis -->
            <div
              class="bg-dark-800/50 border border-dark-700 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <h3
                class="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2"
              >
                <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Risk Analysis
              </h3>
              <div class="space-y-2 sm:space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs sm:text-sm text-gray-400"
                    >Avg. TOTAL PNL</span
                  >
                  <span
                    class="text-sm sm:text-base text-green-500 font-semibold"
                    >{{ formatCurrency(platformStats?.avgPnl || 0) }}</span
                  >
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs sm:text-sm text-gray-400"
                    >Avg. WIN RATE</span
                  >
                  <span
                    class="text-sm sm:text-base text-green-500 font-semibold"
                    >{{ platformStats?.avgWinRate || 0 }}%</span
                  >
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs sm:text-sm text-gray-400"
                    >Active Users</span
                  >
                  <span class="text-sm sm:text-base text-white font-semibold">{{
                    platformStats?.totalUsers || 0
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TRADING PORTFOLIO Section -->
    <section id="trading-portfolio" class="py-16 sm:py-24 bg-dark-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-8 sm:mb-12">
          <span
            class="text-green-500 text-sm font-semibold uppercase tracking-wider"
            >Trading Portfolio</span
          >
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 mb-4"
          >
            TRADING PORTFOLIO
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Real-time trading portfolio performance with professional analysis
            and accurate data monitoring.
          </p>
        </div>

        <!-- Loading State -->
        <div
          v-if="portfolioLoading"
          class="flex items-center justify-center py-16"
        >
          <div
            class="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"
          ></div>
        </div>

        <div v-else class="flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:gap-6">
          <!-- Left Sidebar: Pro Signals (appears after table on mobile) -->
          <div class="order-2 lg:order-1 lg:col-span-1">
            <div
              class="bg-gradient-to-br from-green-500/10 to-dark-800 border border-green-500/30 rounded-2xl p-4 sm:p-6 lg:sticky lg:top-4"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-green-400 font-bold text-base sm:text-lg">Pro Signals</h3>
                <span
                  class="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded"
                  >All Time</span
                >
              </div>

              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-1 lg:space-y-3 lg:gap-0">
                <!-- PnL USDT -->
                <div
                  class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2 lg:border-b lg:border-dark-700"
                >
                  <span class="text-gray-400 text-xs sm:text-sm">PnL USDT</span>
                  <span
                    :class="[
                      'font-bold text-sm sm:text-base',
                      (signalsPortfolio?.proSignals?.pnlUsdt || 0) >= 0
                        ? 'text-green-400'
                        : 'text-red-400',
                    ]"
                  >
                    {{
                      (signalsPortfolio?.proSignals?.pnlUsdt || 0) >= 0
                        ? "+"
                        : ""
                    }}{{
                      formatCurrency(signalsPortfolio?.proSignals?.pnlUsdt || 0)
                    }}
                  </span>
                </div>
                <!-- PnL % -->
                <div
                  class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2 lg:border-b lg:border-dark-700"
                >
                  <span class="text-gray-400 text-xs sm:text-sm">PnL %</span>
                  <span
                    :class="[
                      'font-bold text-sm sm:text-base',
                      (signalsPortfolio?.proSignals?.pnlPercent || 0) >= 0
                        ? 'text-green-400'
                        : 'text-red-400',
                    ]"
                  >
                    {{
                      (signalsPortfolio?.proSignals?.pnlPercent || 0) >= 0
                        ? "+"
                        : ""
                    }}{{ signalsPortfolio?.proSignals?.pnlPercent || 0 }}%
                  </span>
                </div>

                <!-- Drawdown -->
                <div
                  class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2 lg:border-b lg:border-dark-700"
                >
                  <span class="text-gray-400 text-xs sm:text-sm">Drawdown</span>
                  <span class="text-red-400 font-bold text-sm sm:text-base"
                    >{{ signalsPortfolio?.proSignals?.drawdown || 0 }}%</span
                  >
                </div>

                <!-- Total Trade -->
                <div
                  class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2 lg:border-b lg:border-dark-700"
                >
                  <span class="text-gray-400 text-xs sm:text-sm">Total Trade</span>
                  <span class="text-white font-bold text-sm sm:text-base">{{
                    formatNumber(signalsPortfolio?.proSignals?.totalTrade || 0)
                  }}</span>
                </div>

                <!-- Win Trade -->
                <div
                  class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2 lg:border-b lg:border-dark-700"
                >
                  <span class="text-gray-400 text-xs sm:text-sm">Win Trade</span>
                  <span class="text-green-400 font-bold text-sm sm:text-base">{{
                    formatNumber(signalsPortfolio?.proSignals?.winTrade || 0)
                  }}</span>
                </div>

                <!-- Loss Trade -->
                <div
                  class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2 lg:border-b lg:border-dark-700"
                >
                  <span class="text-gray-400 text-xs sm:text-sm">Loss Trade</span>
                  <span class="text-red-400 font-bold text-sm sm:text-base">{{
                    formatNumber(signalsPortfolio?.proSignals?.lossTrade || 0)
                  }}</span>
                </div>

                <!-- BEP Trade -->
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2">
                  <span class="text-gray-400 text-xs sm:text-sm">BEP Trade</span>
                  <span class="text-gray-300 font-bold text-sm sm:text-base">{{
                    formatNumber(signalsPortfolio?.proSignals?.bepTrade || 0)
                  }}</span>
                </div>
              </div>
            </div>
          </div>


          <!-- Main Content: Trading Table (appears first on mobile) -->
          <div class="order-1 lg:order-2 lg:col-span-3">
            <div
              class="bg-dark-800/50 border border-dark-700 rounded-2xl overflow-hidden"
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between p-4 sm:p-6 border-b border-dark-700"
              >
                <div class="flex items-center gap-3">
                  <h3 class="text-lg sm:text-xl font-bold text-white">
                    REGULAR SIGNALS PORTFOLIO
                  </h3>
                  <span
                    class="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full flex items-center gap-1"
                  >
                    <span
                      class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
                    ></span>
                    LIVE
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div
                class="px-4 sm:px-6 py-3 border-b border-dark-700 bg-dark-900/30"
              >
                <p class="text-gray-500 text-xs mt-2">
                  Last updated:
                  {{
                    formatDateTime(
                      signalsPortfolio?.regularSignals?.lastUpdated
                    )
                  }}
                </p>
              </div>

              <!-- Trading Table -->
              <div class="overflow-x-auto">
                <table class="w-full min-w-[500px]">
                  <thead class="bg-dark-900/50">
                    <tr class="text-gray-400 text-xs uppercase tracking-wider">
                      <th class="px-4 py-3 text-left font-semibold">Pair</th>
                      <th class="px-4 py-3 text-left font-semibold">
                        Position
                      </th>
                      <th class="px-4 py-3 text-right font-semibold">Price</th>
                      <th class="px-4 py-3 text-right font-semibold">Profit</th>
                      <th class="px-4 py-3 text-center font-semibold">State</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-dark-700">
                    <tr
                      v-for="(pos, idx) in signalsPortfolio?.regularSignals
                        ?.positions || []"
                      :key="idx"
                      class="hover:bg-dark-800/50 transition-colors"
                    >
                      <td class="px-4 py-3">
                        <span class="text-white font-medium text-sm">{{
                          pos.pair
                        }}</span>
                      </td>
                      <td class="px-4 py-3">
                        <span
                          :class="[
                            'px-2 py-1 rounded text-xs font-semibold',
                            pos.position === 'LONG' || pos.position === 'Long'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400',
                          ]"
                        >
                          {{ pos.position === "LONG" ? "Long" : "Short" }}
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 text-right text-sm font-mono"
                      >
                        <span v-if="pos.price > 0" class="text-green-400">
                          {{ formatPrice(pos.price) }}
                        </span>
                        <span v-else class="text-gray-500">
                          -
                        </span>
                      </td>
                      <td class="px-4 py-3 text-right">
                        <span
                          :class="[
                            'text-sm font-semibold',
                            pos.profit >= 0 ? 'text-green-400' : 'text-red-400',
                          ]"
                        >
                          {{ pos.profit >= 0 ? "+" : ""
                          }}{{ Math.round(pos.profit) }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <span
                          :class="[
                            'px-2 py-1 rounded text-xs font-medium',
                            pos.state === 'Filled'
                              ? 'bg-green-500/20 text-green-400'
                              : pos.state === 'Open'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-gray-500/20 text-gray-400',
                          ]"
                        >
                          {{ pos.state }}
                        </span>
                      </td>
                    </tr>
                    <tr
                      v-if="
                        !signalsPortfolio?.regularSignals?.positions?.length
                      "
                    >
                      <td
                        colspan="5"
                        class="px-4 py-8 text-center text-gray-500"
                      >
                        No active positions at the moment
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Sidebar: Stats (appears last on mobile) -->
          <div class="order-3 lg:order-3 space-y-4 lg:col-span-1">
            <!-- Regular Signals Card -->
            <div
              class="bg-dark-800/50 border border-dark-700 rounded-2xl p-4 sm:p-6"
            >
              <div class="flex items-center gap-2 mb-4">
                <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                <h3 class="text-white font-bold">Regular Signals</h3>
              </div>
              <p class="text-gray-400 text-sm mb-4">Desember 2025</p>

              <!-- Win/Loss/Cancel Stats -->
              <div class="grid grid-cols-3 gap-2 mb-4">
                <div class="text-center">
                  <p class="text-white font-bold text-lg">
                    {{
                      formatNumber(
                        signalsPortfolio?.regularSignals?.stats?.win || 0
                      )
                    }}
                  </p>
                  <p class="text-gray-500 text-xs">WIN</p>
                </div>
                <div class="text-center">
                  <p class="text-white font-bold text-lg">
                    {{
                      formatNumber(
                        signalsPortfolio?.regularSignals?.stats?.loss || 0
                      )
                    }}
                  </p>
                  <p class="text-gray-500 text-xs">LOSS</p>
                </div>
                <div class="text-center">
                  <p class="text-white font-bold text-lg">
                    {{
                      formatNumber(
                        signalsPortfolio?.regularSignals?.stats?.cancel || 0
                      )
                    }}
                  </p>
                  <p class="text-gray-500 text-xs">CANCEL</p>
                </div>
              </div>

              <!-- Profit/Loss -->
              <div class="grid grid-cols-2 gap-2 mb-4">
                <div class="text-center">
                  <p class="text-gray-500 text-xs mb-1">PROFIT</p>
                  <p class="text-green-400 font-bold text-sm">
                    +{{
                      formatCurrency(
                        signalsPortfolio?.regularSignals?.stats?.profit || 0
                      )
                    }}
                  </p>
                </div>
                <div class="text-center">
                  <p class="text-gray-500 text-xs mb-1">LOSS</p>
                  <p class="text-red-400 font-bold text-sm">
                    {{
                      formatCurrency(
                        signalsPortfolio?.regularSignals?.stats?.lossAmount || 0
                      )
                    }}
                  </p>
                </div>
              </div>

              <!-- Total Trades -->
              <div class="text-center py-4 border-t border-dark-700">
                <p class="text-gray-500 text-xs mb-1">Total Trades</p>
                <p class="text-white font-bold text-3xl">
                  {{
                    formatNumber(
                      signalsPortfolio?.regularSignals?.stats?.totalTrades || 0
                    )
                  }}
                </p>
              </div>

              <!-- Net P&L -->
              <div class="text-center py-4 border-t border-dark-700">
                <p class="text-gray-500 text-xs mb-1">Net P&L</p>
                <p
                  :class="[
                    'font-bold text-2xl',
                    (signalsPortfolio?.regularSignals?.stats?.netPnl || 0) >= 0
                      ? 'text-green-400'
                      : 'text-red-400',
                  ]"
                >
                  {{
                    (signalsPortfolio?.regularSignals?.stats?.netPnl || 0) >= 0
                      ? "+"
                      : ""
                  }}{{
                    formatCurrency(
                      signalsPortfolio?.regularSignals?.stats?.netPnl || 0
                    )
                  }}
                </p>
              </div>

              <!-- Win Rate -->
              <div class="text-center py-4 border-t border-dark-700">
                <p class="text-gray-500 text-xs mb-2">Win Rate</p>
                <div class="relative w-24 h-24 mx-auto">
                  <svg
                    class="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#374151"
                      stroke-width="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22c55e"
                      stroke-width="8"
                      :stroke-dasharray="`${
                        (signalsPortfolio?.regularSignals?.stats?.winRate ||
                          0) * 2.51
                      } 251`"
                      stroke-linecap="round"
                    />
                  </svg>
                  <div
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <span class="text-white font-bold text-lg"
                      >{{
                        signalsPortfolio?.regularSignals?.stats?.winRate || 0
                      }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-20 sm:py-28 bg-dark-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <span
            class="text-green-500 text-sm font-semibold uppercase tracking-wider"
            >How It Works</span
          >
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-6"
          >
            Start Trading in 3 Steps
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto text-lg">
            Get started with automated trading in minutes, not hours.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(step, index) in steps"
            :key="step.title"
            class="relative"
          >
            <div
              class="bg-dark-800/50 border border-dark-700 rounded-2xl p-8 h-full"
            >
              <div
                class="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center text-xl font-bold mb-6"
              >
                {{ index + 1 }}
              </div>
              <h3 class="text-xl font-semibold text-white mb-3">
                {{ step.title }}
              </h3>
              <p class="text-gray-400">{{ step.description }}</p>
            </div>
            <div
              v-if="index < 2"
              class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2"
            >
              <svg
                class="w-8 h-8 text-green-500/30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Backtesting Strategy Section -->
    <section
      id="backtesting"
      class="py-16 sm:py-24 bg-dark-900 overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10 sm:mb-14">
          <span
            class="text-green-500 text-sm font-semibold uppercase tracking-wider"
            >Backtesting Strategy</span
          >
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 mb-4"
          >
            Real Results of Testing Over Months to Years
          </h2>
          <p class="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Explore our comprehensive backtesting reports that demonstrate
            consistent strategy performance across different market conditions.
          </p>
        </div>
      </div>

      <!-- Marquee Container - First Row (Left to Right) -->
      <div class="relative mb-6">
        <div class="flex animate-marquee-backtest hover:pause-animation">
          <!-- First set of cards -->
          <div
            v-for="item in backtestImages.slice(0, 6)"
            :key="item.id"
            class="flex-shrink-0 w-80 sm:w-96 mx-3"
          >
            <div
              @click="openLightbox(item.image, item.title)"
              class="block bg-dark-800/70 border border-dark-700 rounded-xl overflow-hidden group hover:border-green-500/50 transition-all cursor-pointer"
            >
              <div class="relative overflow-hidden">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-auto min-h-48 max-h-72 object-contain bg-dark-900 rounded-lg group-hover:scale-105 transition-transform duration-500"
                />
                <!-- View Overlay -->
                <div
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <div class="bg-white/20 rounded-full p-3">
                    <svg
                      class="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
                <div class="absolute top-3 right-3">
                  <span
                    class="px-2 py-1 bg-green-500/90 text-white text-xs font-medium rounded-full"
                  >
                    {{ item.month }}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-sm sm:text-base font-semibold text-white mb-1">
                  {{ item.title }}
                </h3>
                <p class="text-xs sm:text-sm text-gray-400">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
          <!-- Duplicate for seamless loop -->
          <div
            v-for="item in backtestImages.slice(0, 6)"
            :key="'dup1-' + item.id"
            class="flex-shrink-0 w-80 sm:w-96 mx-3"
          >
            <div
              @click="openLightbox(item.image, item.title)"
              class="block bg-dark-800/70 border border-dark-700 rounded-xl overflow-hidden group hover:border-green-500/50 transition-all cursor-pointer"
            >
              <div class="relative overflow-hidden">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-auto min-h-48 max-h-72 object-contain bg-dark-900 rounded-lg group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <div class="bg-white/20 rounded-full p-3">
                    <svg
                      class="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
                <div class="absolute top-3 right-3">
                  <span
                    class="px-2 py-1 bg-green-500/90 text-white text-xs font-medium rounded-full"
                  >
                    {{ item.month }}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-sm sm:text-base font-semibold text-white mb-1">
                  {{ item.title }}
                </h3>
                <p class="text-xs sm:text-sm text-gray-400">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Marquee Container - Second Row (Right to Left) -->
      <div class="relative">
        <div
          class="flex animate-marquee-backtest-reverse hover:pause-animation"
        >
          <!-- First set of cards -->
          <div
            v-for="item in backtestImages.slice(6, 12)"
            :key="'row2-' + item.id"
            class="flex-shrink-0 w-80 sm:w-96 mx-3"
          >
            <div
              @click="openLightbox(item.image, item.title)"
              class="block bg-dark-800/70 border border-dark-700 rounded-xl overflow-hidden group hover:border-green-500/50 transition-all cursor-pointer"
            >
              <div class="relative overflow-hidden">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-auto min-h-48 max-h-72 object-contain bg-dark-900 rounded-lg group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <div class="bg-white/20 rounded-full p-3">
                    <svg
                      class="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
                <div class="absolute top-3 right-3">
                  <span
                    class="px-2 py-1 bg-green-500/90 text-white text-xs font-medium rounded-full"
                  >
                    {{ item.month }}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-sm sm:text-base font-semibold text-white mb-1">
                  {{ item.title }}
                </h3>
                <p class="text-xs sm:text-sm text-gray-400">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
          <!-- Duplicate for seamless loop -->
          <div
            v-for="item in backtestImages.slice(6, 12)"
            :key="'dup2-' + item.id"
            class="flex-shrink-0 w-80 sm:w-96 mx-3"
          >
            <div
              @click="openLightbox(item.image, item.title)"
              class="block bg-dark-800/70 border border-dark-700 rounded-xl overflow-hidden group hover:border-green-500/50 transition-all cursor-pointer"
            >
              <div class="relative overflow-hidden">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-auto min-h-48 max-h-72 object-contain bg-dark-900 rounded-lg group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <div class="bg-white/20 rounded-full p-3">
                    <svg
                      class="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
                <div class="absolute top-3 right-3">
                  <span
                    class="px-2 py-1 bg-green-500/90 text-white text-xs font-medium rounded-full"
                  >
                    {{ item.month }}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-sm sm:text-base font-semibold text-white mb-1">
                  {{ item.title }}
                </h3>
                <p class="text-xs sm:text-sm text-gray-400">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Full Period Card -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div
          class="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-2xl p-6 sm:p-8 text-center"
        >
          <h3 class="text-xl sm:text-2xl font-bold text-white mb-2">
            January - November 2025 Full Report
          </h3>
          <p class="text-gray-400 mb-4">
            Complete 11-month backtesting analysis with comprehensive
            performance metrics
          </p>
          <button
            @click="
              openLightbox(
                '/images/Backtesting/Laporan-Backtest-Januari-November-2025.jpg',
                'January - November 2025 Full Report'
              )
            "
            class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View Full Report
          </button>
        </div>
      </div>
    </section>

    <!-- Image Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        @click.self="closeLightbox"
      >
        <!-- Close Button -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all group"
        >
          <svg
            class="w-6 h-6 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Image Container -->
        <div class="relative max-w-6xl max-h-[90vh] overflow-auto">
          <img
            :src="lightboxImage"
            :alt="lightboxTitle"
            class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <!-- Image Title -->
          <div
            v-if="lightboxTitle"
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg"
          >
            <p class="text-white text-center font-medium">
              {{ lightboxTitle }}
            </p>
          </div>
        </div>

        <!-- Navigation hint -->
        <p
          class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm"
        >
          Press ESC or click outside to close
        </p>
      </div>
    </Teleport>

    <!-- Testimonials Swiper -->
    <section id="testimonials" class="py-20 sm:py-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <span
            class="text-green-500 text-sm font-semibold uppercase tracking-wider"
            >Testimonials</span
          >
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-6"
          >
            Trusted by Traders
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto text-lg">
            See what our users say about their trading experience.
          </p>
        </div>

        <!-- Testimonial Cards (Swiper-like manual) -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            class="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 sm:p-8 hover:border-green-500/30 transition-colors"
          >
            <div class="flex items-center gap-4 mb-6">
              <img
                :src="testimonial.avatar"
                :alt="testimonial.name"
                class="w-14 h-14 rounded-full object-cover border-2 border-green-500/30"
              />
              <div>
                <h4 class="text-white font-semibold">{{ testimonial.name }}</h4>
                <p class="text-gray-400 text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <div class="flex gap-1 mb-4">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <p class="text-gray-300 leading-relaxed">
              "{{ testimonial.content }}"
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 sm:py-28">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          class="bg-gradient-to-br from-green-500/10 via-dark-800 to-dark-800 border border-green-500/20 rounded-3xl p-8 sm:p-12 text-center"
        >
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p class="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of traders who automate their trading with MATIC
            TRADE. Get started in minutes.
          </p>
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              @click="openChatPopup"
              class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-green-500/30"
            >
              Create Account
            </button>
            <a
              :href="socialLinks.contactTelegram || '#'"
              :target="socialLinks.contactTelegram ? '_blank' : '_self'"
              @click="!socialLinks.contactTelegram && $event.preventDefault()"
              class="w-full sm:w-auto px-8 py-4 border border-dark-600 hover:border-dark-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
                />
              </svg>
              Contact on Telegram
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark-900 border-t border-dark-800 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <!-- Brand -->
          <div class="col-span-2 md:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
              >
                <img
                  src="/logo.png"
                  alt="Logo"
                  class="w-6 h-6 object-contain"
                />
              </div>
              <span class="text-xl font-bold text-white">MATIC TRADE</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-4">
              Automate your futures trading with real-time signal execution on
              top exchanges.
            </p>
            <!-- Social Links -->
            <div class="flex gap-4">
              <a
                v-if="socialLinks.telegram"
                :href="socialLinks.telegram"
                target="_blank"
                class="w-10 h-10 bg-dark-800 hover:bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
                  />
                </svg>
              </a>
              <a
                v-if="socialLinks.twitter"
                :href="socialLinks.twitter"
                target="_blank"
                class="w-10 h-10 bg-dark-800 hover:bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
              </a>
              <a
                v-if="socialLinks.instagram"
                :href="socialLinks.instagram"
                target="_blank"
                class="w-10 h-10 bg-dark-800 hover:bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
              </a>
              <a
                v-if="socialLinks.facebook"
                :href="socialLinks.facebook"
                target="_blank"
                class="w-10 h-10 bg-dark-800 hover:bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </a>
              <a
                v-if="socialLinks.youtube"
                :href="socialLinks.youtube"
                target="_blank"
                class="w-10 h-10 bg-dark-800 hover:bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                v-if="socialLinks.discord"
                :href="socialLinks.discord"
                target="_blank"
                class="w-10 h-10 bg-dark-800 hover:bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Platform -->
          <div>
            <h3 class="text-white font-semibold mb-4">Platform</h3>
            <ul class="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#features" class="hover:text-green-400 transition"
                  >Features</a
                >
              </li>

              <li>
                <NuxtLink to="/faq" class="hover:text-green-400 transition"
                  >FAQ</NuxtLink
                >
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-white font-semibold mb-4">Support</h3>
            <ul class="space-y-3 text-sm text-gray-400">
              <li>
                <NuxtLink to="/faq" class="hover:text-green-400 transition"
                  >Help Center</NuxtLink
                >
              </li>
              <li>
                <a href="#contact" class="hover:text-green-400 transition"
                  >Contact Us</a
                >
              </li>
              <li>
                <NuxtLink to="/faq" class="hover:text-green-400 transition"
                  >FAQ</NuxtLink
                >
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="text-white font-semibold mb-4">Legal</h3>
            <ul class="space-y-3 text-sm text-gray-400">
              <li>
                <NuxtLink to="/privacy" class="hover:text-green-400 transition"
                  >Privacy Policy</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/terms" class="hover:text-green-400 transition"
                  >Terms of Service</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/risk-disclosure"
                  class="hover:text-green-400 transition"
                  >Risk Disclosure</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div
          class="pt-8 border-t border-dark-800 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p class="text-gray-500 text-sm">
            © {{ new Date().getFullYear() }} MATIC TRADE. All rights reserved.
          </p>
          <p class="text-gray-500 text-sm">
            Trading involves risk. Past performance is not indicative of future
            results.
          </p>
        </div>
      </div>
    </footer>

    <!-- Chat Popup -->
    <ChatPopup v-model:is-open="chatPopupOpen" />
  </div>
</template>

<script setup lang="ts">
import IconChart from "~/components/icons/IconChart.vue";
import IconExchange from "~/components/icons/IconExchange.vue";
import IconBolt from "~/components/icons/IconBolt.vue";
import IconShield from "~/components/icons/IconShield.vue";
import IconAnalytics from "~/components/icons/IconAnalytics.vue";
import IconLock from "~/components/icons/IconLock.vue";

definePageMeta({
  layout: false,
});

// SEO Meta
useHead({
  title: "MATIC TRADE - Automate Your Futures Trading",
  meta: [
    {
      name: "description",
      content:
        "Copy trading signals from TradingView directly to Binance, OKX, and Bitget Futures with lightning-fast execution. Start automated trading today.",
    },
    {
      name: "keywords",
      content:
        "futures trading, automated trading, copy trading, TradingView, Binance, OKX, Bitget, trading bot, crypto trading",
    },
    {
      property: "og:title",
      content: "MATIC TRADE - Automate Your Futures Trading",
    },
    {
      property: "og:description",
      content:
        "Copy trading signals from TradingView directly to your exchange with real-time execution.",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "MATIC TRADE - Automate Your Futures Trading",
    },
    {
      name: "twitter:description",
      content:
        "Copy trading signals from TradingView directly to your exchange with real-time execution.",
    },
  ],
  link: [{ rel: "canonical", href: "https://matictrade.com" }],
});

const mobileMenuOpen = ref(false);

const liveStats = [
  { value: "$10M+", label: "Trading Volume" },
  { value: "5,000+", label: "Active Traders" },
  { value: "99.9%", label: "Uptime" },
  { value: "<50ms", label: "Execution Speed" },
];

const features = [
  {
    title: "TradingView Integration",
    description:
      "Receive signals directly from TradingView alerts via webhook and execute trades automatically on your exchange.",
    icon: IconChart,
  },
  {
    title: "Multi-Exchange Support",
    description:
      "Trade on Binance, OKX, and Bitget Futures seamlessly with a single unified platform.",
    icon: IconExchange,
  },
  {
    title: "Lightning Fast Execution",
    description:
      "Sub-50ms order execution ensures you never miss a trading opportunity.",
    icon: IconBolt,
  },
  {
    title: "Advanced Risk Management",
    description:
      "Built-in stop loss, take profit, trailing stops, and position sizing controls.",
    icon: IconShield,
  },
  {
    title: "Real-time Analytics",
    description:
      "Track your P&L, win rate, drawdown, and other key metrics in real-time.",
    icon: IconAnalytics,
  },
  {
    title: "Bank-grade Security",
    description:
      "Your API keys are encrypted with AES-256 and stored securely. Never exposed.",
    icon: IconLock,
  },
];

const steps = [
  {
    title: "Connect Your Exchange",
    description:
      "Add your Binance, OKX, or Bitget API keys securely. We only need trading permissions.",
  },
  {
    title: "Configure Settings",
    description:
      "Set your preferred leverage, position size, and risk parameters. No coding required.",
  },
  {
    title: "Start Automated Trading",
    description:
      "Enable the bot and let it execute trades from TradingView signals automatically.",
  },
];

const testimonials = [
  {
    name: "Ahmad Rizki",
    role: "Professional Trader",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content:
      "MATIC TRADE has transformed my trading. The execution speed is incredible and I never miss a signal anymore.",
  },
  {
    name: "Sarah Chen",
    role: "Crypto Investor",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "Finally a platform that actually works! Setup was easy and the support team is super responsive.",
  },
  {
    name: "Michael Tan",
    role: "Day Trader",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    content:
      "The multi-exchange support is a game changer. I can manage all my accounts from one place.",
  },
];

const plans = [
  {
    name: "Starter",
    price: 0,
    period: "month",
    popular: false,
    features: [
      "1 Exchange Connection",
      "10 Trades/Day",
      "Basic Analytics",
      "Email Support",
    ],
  },
  {
    name: "Pro",
    price: 29,
    period: "month",
    popular: true,
    features: [
      "3 Exchange Connections",
      "Unlimited Trades",
      "Advanced Analytics",
      "Priority Support",
      "Custom Webhooks",
    ],
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month",
    popular: false,
    features: [
      "Unlimited Exchanges",
      "Unlimited Trades",
      "White-label Solution",
      "Dedicated Support",
      "Custom Integrations",
    ],
  },
];

// Backtesting Images Data
const backtestImages = [
  {
    id: 1,
    month: "Jan 2025",
    title: "January 2025 Backtest Report",
    description:
      "Market analysis and strategy performance during early year volatility.",
    image: "/images/Backtesting/Laporan-Backtest-Januari-2025.jpg",
  },
  {
    id: 2,
    month: "Feb 2025",
    title: "February 2025 Backtest Report",
    description: "Strategy optimization results with improved risk management.",
    image: "/images/Backtesting/Laporan-Backtest-Februari-2025.jpg",
  },
  {
    id: 3,
    month: "Mar 2025",
    title: "March 2025 Backtest Report",
    description: "Performance metrics during Q1 end market movements.",
    image: "/images/Backtesting/Laporan-Backtest-Maret-2025.jpg",
  },
  {
    id: 4,
    month: "Apr 2025",
    title: "April 2025 Backtest Report",
    description: "Spring season trading analysis with new indicators.",
    image: "/images/Backtesting/Laporan-Backtest-April-2025.jpg",
  },
  {
    id: 5,
    month: "May 2025",
    title: "May 2025 Backtest Report",
    description: "Mid-year strategy performance and algorithm improvements.",
    image: "/images/Backtesting/Laporan-Backtest-Mei-2025.jpg",
  },
  {
    id: 6,
    month: "Jun 2025",
    title: "June 2025 Backtest Report",
    description: "Q2 closing results with enhanced signal accuracy.",
    image: "/images/Backtesting/Laporan-Backtest-Juni-2025.jpg",
  },
  {
    id: 7,
    month: "Jul 2025",
    title: "July 2025 Backtest Report",
    description: "Summer market behavior analysis and profit metrics.",
    image: "/images/Backtesting/Laporan-Backtest-Juli-2025.jpg",
  },
  {
    id: 8,
    month: "Aug 2025",
    title: "August 2025 Backtest Report",
    description: "High volatility period performance breakdown.",
    image: "/images/Backtesting/Laporan-Backtest-Agustus-2025.jpg",
  },
  {
    id: 9,
    month: "Sep 2025",
    title: "September 2025 Backtest Report",
    description: "Q3 results with market correction handling.",
    image: "/images/Backtesting/Laporan-Backtest-September-2025.jpg",
  },
  {
    id: 10,
    month: "Oct 2025",
    title: "October 2025 Backtest Report",
    description: "Pre-Q4 analysis and strategy refinements.",
    image: "/images/Backtesting/Laporan-Backtest-Oktober-2025.jpg",
  },
  {
    id: 11,
    month: "Nov 2025",
    title: "November 2025 Backtest Report",
    description: "Year-end preparation and peak performance metrics.",
    image: "/images/Backtesting/Laporan-Backtest-November-2025.jpg",
  },
  {
    id: 12,
    month: "Dec 2025",
    title: "December 2025 Backtest Report",
    description: "Full year summary and annual strategy review.",
    image: "/images/Backtesting/Laporan-Backtest-Oktober-2025.jpg",
  },
];

// Lightbox state
const lightboxOpen = ref(false);
const lightboxImage = ref("");
const lightboxTitle = ref("");

const openLightbox = (image: string, title: string) => {
  lightboxImage.value = image;
  lightboxTitle.value = title;
  lightboxOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  lightboxImage.value = "";
  lightboxTitle.value = "";
  document.body.style.overflow = "";
};

// Chat Popup
const chatPopupOpen = ref(false);
const openChatPopup = () => {
  chatPopupOpen.value = true;
};

// Social Links from settings
const socialLinks = reactive({
  telegram: '',
  contactTelegram: '',
  twitter: '',
  instagram: '',
  facebook: '',
  youtube: '',
  discord: ''
});

const loadSocialLinks = async () => {
  try {
    const baseUrl = config.public?.apiBaseUrl || '';
    const response = await fetch(`${baseUrl}/api/settings/social`);
    const data = await response.json();
    if (data.success) {
      Object.assign(socialLinks, data.data);
    }
  } catch (error) {
    console.error('Failed to load social links:', error);
  }
};

// Homepage Settings from admin
const homepageSettings = reactive({
  watchDemoLink: ''
});

// Computed for Watch Demo button
const watchDemoHref = computed(() => homepageSettings.watchDemoLink || '#how-it-works');
const watchDemoTarget = computed(() => homepageSettings.watchDemoLink ? '_blank' : '_self');

const loadHomepageSettings = async () => {
  try {
    const baseUrl = config.public?.apiBaseUrl || '';
    const response = await fetch(`${baseUrl}/api/settings/homepage`);
    const data = await response.json();
    if (data.success) {
      Object.assign(homepageSettings, data.data);
    }
  } catch (error) {
    console.error('Failed to load homepage settings:', error);
  }
};

// Handle ESC key to close lightbox
onMounted(() => {
  // Load social links
  loadSocialLinks();
  
  // Load homepage settings
  loadHomepageSettings();
  
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape" && lightboxOpen.value) {
      closeLightbox();
    }
  };
  window.addEventListener("keydown", handleEsc);
});

// Platform Stats
const config = useRuntimeConfig();
const platformStats = ref<any>(null);
const statsLoading = ref(true);

// Get API base URL with fallback
const getApiUrl = () => {
  const baseUrl = config.public?.apiBaseUrl || "http://localhost:3001";
  return `${baseUrl}/api/public/stats`;
};

// Fetch platform stats on mount (client-side only)
onMounted(async () => {
  try {
    const response = await fetch(getApiUrl());
    const data = await response.json();
    if (data.success) {
      platformStats.value = data.data;
    }
  } catch (error) {
    console.error("Failed to fetch platform stats:", error);
  } finally {
    statsLoading.value = false;
  }

  // Refresh stats every 30 seconds
  setInterval(async () => {
    try {
      const response = await fetch(getApiUrl());
      const data = await response.json();
      if (data.success) {
        platformStats.value = data.data;
      }
    } catch (error) {
      console.error("Failed to refresh stats:", error);
    }
  }, 30000);
});

// Chart computed properties
const chartMonths = computed(() => {
  if (!platformStats.value?.monthlyPnl) return [];
  return platformStats.value.monthlyPnl.map((m: any) => m.month);
});

const pnlChartPoints = computed(() => {
  if (!platformStats.value?.monthlyPnl) return [];
  const data = platformStats.value.monthlyPnl;
  const maxPnl = Math.max(...data.map((m: any) => Math.abs(m.pnl)), 1);

  return data.map((m: any, i: number) => ({
    x: (i / (data.length - 1 || 1)) * 380 + 10,
    y: 80 - (m.pnl / maxPnl) * 60,
  }));
});

const pnlChartPath = computed(() => {
  if (pnlChartPoints.value.length === 0) return "";
  const points = pnlChartPoints.value;
  return points
    .map((p: any, i: number) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
});

const pnlAreaPath = computed(() => {
  if (pnlChartPoints.value.length === 0) return "";
  const points = pnlChartPoints.value;
  const linePath = points
    .map((p: any, i: number) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  return `${linePath} L ${points[points.length - 1].x} 160 L ${
    points[0].x
  } 160 Z`;
});

// Helper functions
const getBarHeight = (value: number) => {
  const maxValue = Math.max(
    ...(platformStats.value?.monthlyPnl || []).flatMap((m: any) => [
      m.wins,
      m.losses,
    ]),
    1
  );
  return Math.max((value / maxValue) * 70, 2);
};

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M";
  } else if (Math.abs(value) >= 1000) {
    return "$" + (value / 1000).toFixed(2) + "K";
  }
  return "$" + value.toFixed(2);
};

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toString();
};

// Signals Portfolio State
const signalsPortfolio = ref<any>(null);
const portfolioLoading = ref(true);
const livePrices = ref<Record<string, number>>({});
let binanceWs: WebSocket | null = null;

// Get API URL for signals portfolio
const getSignalsPortfolioUrl = () => {
  const baseUrl = config.public?.apiBaseUrl || "http://localhost:3001";
  return `${baseUrl}/api/public/signals-portfolio`;
};

// Connect to Binance WebSocket for real-time prices
const connectBinanceWebSocket = (symbols: string[]) => {
  if (binanceWs) {
    binanceWs.close();
  }

  if (symbols.length === 0) return;

  // Create stream names for all symbols (e.g., btcusdt@ticker)
  const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
  const wsUrl = `wss://fstream.binance.com/stream?streams=${streams}`;

  try {
    binanceWs = new WebSocket(wsUrl);

    binanceWs.onopen = () => {
      console.log('Binance WebSocket connected');
    };

    binanceWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.data && data.data.s && data.data.c) {
          // Update live price for this symbol
          livePrices.value[data.data.s] = parseFloat(data.data.c);
        }
      } catch (e) {
        // Ignore parse errors
      }
    };

    binanceWs.onerror = (error) => {
      console.error('Binance WebSocket error:', error);
    };

    binanceWs.onclose = () => {
      console.log('Binance WebSocket closed');
      // Reconnect after 5 seconds
      setTimeout(() => {
        const positions = signalsPortfolio.value?.regularSignals?.positions || [];
        const uniqueSymbols = [...new Set(positions.map((p: any) => p.pair))];
        if (uniqueSymbols.length > 0) {
          connectBinanceWebSocket(uniqueSymbols as string[]);
        }
      }, 5000);
    };
  } catch (error) {
    console.error('Failed to connect Binance WebSocket:', error);
  }
};

// Fetch signals portfolio on mount
const fetchSignalsPortfolio = async () => {
  try {
    const response = await fetch(getSignalsPortfolioUrl());
    const data = await response.json();
    if (data.success) {
      signalsPortfolio.value = data.data;
      
      // Connect WebSocket for unique symbols in portfolio
      const positions = data.data?.regularSignals?.positions || [];
      const uniqueSymbols = [...new Set(positions.map((p: any) => p.pair))];
      if (uniqueSymbols.length > 0 && !binanceWs) {
        connectBinanceWebSocket(uniqueSymbols as string[]);
      }
    }
  } catch (error) {
    console.error("Failed to fetch signals portfolio:", error);
  } finally {
    portfolioLoading.value = false;
  }
};

// Initial fetch
onMounted(async () => {
  await fetchSignalsPortfolio();

  // Refresh signals portfolio every 10 seconds
  setInterval(async () => {
    await fetchSignalsPortfolio();
  }, 10000);
});

// Cleanup WebSocket on unmount
onUnmounted(() => {
  if (binanceWs) {
    binanceWs.close();
    binanceWs = null;
  }
});

// Format price with appropriate decimals
const formatPrice = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  if (value < 0.001) return value.toFixed(6);
  if (value < 1) return value.toFixed(4);
  if (value < 100) return value.toFixed(2);
  return value.toFixed(2);
};

// Format datetime
const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return (
    date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }) + " UTC+7"
  );
};
</script>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(
    circle,
    var(--tw-gradient-from) 0%,
    var(--tw-gradient-to) 70%
  );
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.33%);
  }
}

.animate-marquee {
  animation: marquee 15s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}

/* Backtesting Carousel Animations */
@keyframes marquee-backtest {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes marquee-backtest-reverse {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

.animate-marquee-backtest {
  animation: marquee-backtest 40s linear infinite;
}

.animate-marquee-backtest-reverse {
  animation: marquee-backtest-reverse 40s linear infinite;
}

.animate-marquee-backtest:hover,
.animate-marquee-backtest-reverse:hover {
  animation-play-state: paused;
}

.pause-animation {
  animation-play-state: paused;
}
</style>
