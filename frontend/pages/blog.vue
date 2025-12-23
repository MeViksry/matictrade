<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Header/Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <img src="/logo.png" alt="MATIC TRADE Logo" class="w-6 h-6 object-contain"/>
            </div>
            <span class="text-xl font-bold text-white">MATIC TRADE</span>
          </NuxtLink>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors">Home</NuxtLink>
            <NuxtLink to="/blog" class="text-green-500 font-medium">Blog</NuxtLink>
            <NuxtLink to="/faq" class="text-gray-400 hover:text-white transition-colors">FAQ</NuxtLink>
          </div>

          <!-- CTA -->
          <button 
            @click="openChatPopup"
            class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all text-sm"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-24 pb-12 sm:pt-32 sm:pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <span class="inline-block px-4 py-1.5 bg-green-500/10 text-green-500 text-sm font-semibold rounded-full mb-4">
            MATIC TRADE BLOG
          </span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trading Insights & Updates
          </h1>
          <p class="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            Stay informed with the latest trading strategies, market analysis, platform updates, and educational content.
          </p>
        </div>

        <!-- Search & Filter -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search articles..."
              class="w-full sm:w-80 pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
          <div class="flex gap-2 justify-center flex-wrap">
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="selectedCategory = cat"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                selectedCategory === cat 
                  ? 'bg-green-500 text-white' 
                  : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Post -->
    <section class="pb-12 sm:pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div v-if="featuredPost" class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-dark-700">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="aspect-video md:aspect-auto md:h-full">
              <img 
                :src="featuredPost.image" 
                :alt="featuredPost.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-6 sm:p-8 flex flex-col justify-center">
              <span class="inline-block px-3 py-1 bg-green-500/20 text-green-500 text-xs font-semibold rounded-full mb-4 w-fit">
                FEATURED
              </span>
              <span class="text-gray-500 text-sm mb-2">{{ featuredPost.date }} • {{ featuredPost.readTime }}</span>
              <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
                {{ featuredPost.title }}
              </h2>
              <p class="text-gray-400 mb-6 line-clamp-3">
                {{ featuredPost.excerpt }}
              </p>
              <button @click="openPost(featuredPost)" class="inline-flex items-center gap-2 text-green-500 hover:text-green-400 font-medium transition-colors">
                Read More
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Posts Grid -->
    <section class="pb-16 sm:pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article 
            v-for="post in filteredPosts" 
            :key="post.id"
            @click="openPost(post)"
            class="bg-dark-800/50 border border-dark-700 rounded-2xl overflow-hidden group hover:border-green-500/50 transition-all cursor-pointer"
          >
            <!-- Image -->
            <div class="aspect-video overflow-hidden">
              <img 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <!-- Content -->
            <div class="p-5 sm:p-6">
              <div class="flex items-center gap-3 mb-3">
                <span class="px-2.5 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full">
                  {{ post.category }}
                </span>
                <span class="text-gray-500 text-xs">{{ post.readTime }}</span>
              </div>
              
              <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-green-500 transition-colors line-clamp-2">
                {{ post.title }}
              </h3>
              
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">
                {{ post.excerpt }}
              </p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {{ getInitials(post.author) }}
                  </div>
                  <span class="text-gray-400 text-sm">{{ post.author }}</span>
                </div>
                <span class="text-gray-500 text-xs">{{ post.date }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-if="filteredPosts.length === 0" class="text-center py-16">
          <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-white mb-2">No articles found</h3>
          <p class="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>

        <!-- Load More -->
        <div v-if="filteredPosts.length > 0" class="text-center mt-12">
          <button class="px-8 py-3 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-xl border border-dark-700 transition-all">
            Load More Articles
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter CTA -->
    <section class="pb-16 sm:pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-2xl p-8 sm:p-12 text-center">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p class="text-gray-400 mb-6 max-w-lg mx-auto">
            Subscribe to our newsletter for the latest trading tips, market insights, and platform updates.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              class="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
            />
            <button class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-dark-800 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-gray-500 text-sm">© 2025 MATIC TRADE. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <NuxtLink to="/privacy" class="text-gray-500 hover:text-white text-sm transition-colors">Privacy</NuxtLink>
            <NuxtLink to="/terms" class="text-gray-500 hover:text-white text-sm transition-colors">Terms</NuxtLink>
            <a 
              v-if="socialLinks.telegram"
              :href="socialLinks.telegram" 
              target="_blank" 
              class="text-gray-500 hover:text-white transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Blog Post Modal -->
    <Teleport to="body">
      <div 
        v-if="selectedPost" 
        class="fixed inset-0 z-50 overflow-y-auto bg-dark-900/95 backdrop-blur-sm"
      >
        <div class="min-h-screen px-4 py-8">
          <div class="max-w-4xl mx-auto">
            <!-- Close Button -->
            <button 
              @click="closePost"
              class="fixed top-4 right-4 z-50 w-12 h-12 bg-dark-800 hover:bg-dark-700 rounded-full flex items-center justify-center text-white transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Article Content -->
            <article class="bg-dark-800/50 border border-dark-700 rounded-2xl overflow-hidden">
              <img 
                :src="selectedPost.image" 
                :alt="selectedPost.title"
                class="w-full h-64 sm:h-80 object-cover"
              />
              
              <div class="p-6 sm:p-10">
                <div class="flex items-center gap-3 mb-4">
                  <span class="px-3 py-1 bg-green-500/10 text-green-500 text-sm font-medium rounded-full">
                    {{ selectedPost.category }}
                  </span>
                  <span class="text-gray-500 text-sm">{{ selectedPost.date }}</span>
                  <span class="text-gray-500 text-sm">• {{ selectedPost.readTime }}</span>
                </div>

                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
                  {{ selectedPost.title }}
                </h1>

                <div class="flex items-center gap-3 mb-8 pb-8 border-b border-dark-700">
                  <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {{ getInitials(selectedPost.author) }}
                  </div>
                  <div>
                    <p class="text-white font-medium">{{ selectedPost.author }}</p>
                    <p class="text-gray-500 text-sm">Author</p>
                  </div>
                </div>

                <div class="prose prose-invert max-w-none">
                  <p v-if="selectedPost.excerpt" class="text-gray-300 leading-relaxed mb-6 text-lg italic border-l-4 border-green-500 pl-4">
                    {{ selectedPost.excerpt }}
                  </p>
                  
                  <!-- Display actual content from database -->
                  <div 
                    v-if="selectedPost.content" 
                    class="text-gray-300 leading-relaxed blog-content"
                    v-html="formatContent(selectedPost.content)"
                  ></div>
                  
                  <!-- Fallback if no content -->
                  <p v-else class="text-gray-400 italic">No content available.</p>
                </div>

                <!-- Share Buttons -->
                <div class="mt-8 pt-8 border-t border-dark-700">
                  <p class="text-gray-400 text-sm mb-4">Share this article</p>
                  <div class="flex gap-3">
                    <button class="w-10 h-10 bg-dark-700 hover:bg-green-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </button>
                    <button class="w-10 h-10 bg-dark-700 hover:bg-green-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                      </svg>
                    </button>
                    <button class="w-10 h-10 bg-dark-700 hover:bg-green-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Chat Popup -->
    <ChatPopup v-model:is-open="showChatPopup" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import ChatPopup from '~/components/ChatPopup.vue'

// Page meta - public access
// @ts-ignore - Nuxt auto-imports this function
definePageMeta({
  layout: false
})

// Types
interface BlogPost {
  id: number | string
  title: string
  slug?: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
  featured: boolean
  content?: string
}

// SEO
onMounted(() => {
  document.title = 'Blog - MATIC TRADE | Trading Insights & Updates'
  fetchPosts()
  loadSocialLinks()
})

// Social Links from settings
const socialLinks = reactive({
  telegram: ''
})

const loadSocialLinks = async () => {
  try {
    const baseUrl = config.public?.apiBaseUrl || ''
    const response = await fetch(`${baseUrl}/api/settings/social`)
    const data = await response.json()
    if (data.success) {
      socialLinks.telegram = data.data.telegram || ''
    }
  } catch (error) {
    console.error('Failed to load social links:', error)
  }
}

// @ts-ignore - Nuxt auto-imports
const config = useRuntimeConfig()

// State
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedPost = ref<BlogPost | null>(null)
const posts = ref<BlogPost[]>([])
const loading = ref(true)
const showChatPopup = ref(false)

const openChatPopup = () => {
  showChatPopup.value = true
}

// Categories
const categories: string[] = ['All', 'Strategy', 'Analysis', 'Education', 'Updates', 'News']

// Fetch posts from API
const fetchPosts = async () => {
  try {
    loading.value = true
    const baseUrl = config.public?.apiBaseUrl || 'http://localhost:3001'
    
    const res = await fetch(`${baseUrl}/api/blog/public`)
    const data = await res.json()
    
    if (data.success) {
      posts.value = data.data.posts.map((p: any) => {
        // Handle image URL - prefix with dynamic backend URL if relative path
        let imageUrl = p.featuredImage || ''
        if (imageUrl && !imageUrl.startsWith('http')) {
          const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
          imageUrl = `http://${host}:3001${imageUrl}`
        }
        if (!imageUrl) {
          imageUrl = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60'
        }
        
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || '',
          category: p.category,
          author: p.author,
          date: formatDate(p.publishedAt),
          readTime: estimateReadTime(p.excerpt || ''),
          image: imageUrl,
          featured: p.featured,
          content: p.content
        }
      })
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const estimateReadTime = (content: string): string => {
  const words = content.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

// Helper function to get initials
const getInitials = (name: string): string => {
  return name.split(' ').map((n: string) => n[0]).join('')
}

// Format content for display - convert newlines to paragraphs
const formatContent = (content: string): string => {
  if (!content) return ''
  
  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/)
  
  return paragraphs.map(p => {
    // Convert single newlines to <br> within paragraphs
    const formatted = p.trim().replace(/\n/g, '<br>')
    return `<p class="mb-4">${formatted}</p>`
  }).join('')
}

// Computed
const featuredPost = computed((): BlogPost | undefined => {
  if (posts.value.length === 0) return undefined
  for (let i = 0; i < posts.value.length; i++) {
    const p = posts.value[i]
    if (p && p.featured) return p
  }
  return posts.value[0] || undefined // Return first post as featured if none marked
})

const filteredPosts = computed((): BlogPost[] => {
  const result: BlogPost[] = []
  const query = searchQuery.value.toLowerCase()
  
  for (let i = 0; i < posts.value.length; i++) {
    const post = posts.value[i]
    if (!post) continue
    if (post.featured && posts.value.length > 1) continue // Skip featured only if we have more posts
    
    const matchesCategory = selectedCategory.value === 'All' || post.category === selectedCategory.value
    const matchesSearch = !query || 
      post.title.toLowerCase().indexOf(query) !== -1 ||
      (post.excerpt && post.excerpt.toLowerCase().indexOf(query) !== -1)
    
    if (matchesCategory && matchesSearch) {
      result.push(post)
    }
  }
  
  return result
})

// Methods
const openPost = async (post: BlogPost): Promise<void> => {
  selectedPost.value = post
  document.body.style.overflow = 'hidden'
  
  // Increment view count via API
  if (post.slug) {
    try {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
      await fetch(`http://${host}:3001/api/blog/public/${post.slug}`)
    } catch (error) {
      // Silently fail - view increment is not critical
    }
  }
}

const closePost = (): void => {
  selectedPost.value = null
  document.body.style.overflow = ''
}

// Handle ESC key
onMounted(() => {
  const handleEsc = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && selectedPost.value) {
      closePost()
    }
  }
  window.addEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

