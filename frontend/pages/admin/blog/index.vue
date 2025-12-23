<template>
  <div class="min-h-screen bg-dark-900 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Blog Management</h1>
        <p class="text-gray-400 text-sm">Create and manage blog posts</p>
      </div>
      <NuxtLink to="/admin/blog/create" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Post
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-dark-800 border border-dark-700 rounded-xl p-4 mb-6">
      <div class="flex flex-col lg:flex-row gap-3">
        <div class="flex-1">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search posts..."
            class="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
          />
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <select 
            v-model="filterStatus"
            class="w-full sm:w-auto min-w-[140px] px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select 
            v-model="filterCategory"
            class="w-full sm:w-auto min-w-[160px] px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Posts Table -->
    <div v-else-if="posts.length > 0" class="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-dark-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden sm:table-cell">Category</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Author</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden lg:table-cell">Views</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden lg:table-cell">Date</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-700">
            <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-dark-700/50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img 
                    v-if="post.featuredImage" 
                    :src="getImageUrl(post.featuredImage)" 
                    class="w-12 h-8 object-cover rounded"
                    :alt="post.title"
                  />
                  <div v-else class="w-12 h-8 bg-dark-600 rounded flex items-center justify-center">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-white font-medium truncate max-w-[200px]">{{ post.title }}</p>
                    <p class="text-gray-500 text-xs truncate max-w-[200px]">{{ post.slug }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 hidden sm:table-cell">
                <span class="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full">
                  {{ post.category }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">{{ post.author }}</td>
              <td class="px-4 py-3">
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-500/10 text-green-500': post.status === 'PUBLISHED',
                    'bg-yellow-500/10 text-yellow-500': post.status === 'DRAFT',
                    'bg-gray-500/10 text-gray-500': post.status === 'ARCHIVED'
                  }"
                >
                  {{ post.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-400 text-sm hidden lg:table-cell">{{ post.views }}</td>
              <td class="px-4 py-3 text-gray-400 text-sm hidden lg:table-cell">{{ formatDate(post.createdAt) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink :to="`/admin/blog/${post.id}`" class="p-1.5 text-gray-400 hover:text-white transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </NuxtLink>
                  <button @click="togglePublish(post)" class="p-1.5 transition-colors" :class="post.status === 'PUBLISHED' ? 'text-green-500 hover:text-green-400' : 'text-gray-400 hover:text-green-500'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="deletePost(post)" class="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-dark-800 border border-dark-700 rounded-xl p-12 text-center">
      <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
      <h3 class="text-xl font-semibold text-white mb-2">No blog posts yet</h3>
      <p class="text-gray-400 mb-6">Get started by creating your first blog post</p>
      <NuxtLink to="/admin/blog/create" class="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Post
      </NuxtLink>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-dark-800 border border-dark-700 rounded-xl p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-white mb-2">Delete Post</h3>
          <p class="text-gray-400 mb-6">Are you sure you want to delete "{{ postToDelete?.title }}"? This action cannot be undone.</p>
          <div class="flex gap-3 justify-end">
            <button @click="showDeleteModal = false" class="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors">
              Cancel
            </button>
            <button @click="confirmDelete" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// @ts-ignore
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  category: string
  author: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  views: number
  createdAt: string
}

const config = useRuntimeConfig()
const loading = ref(true)
const posts = ref<BlogPost[]>([])
const searchQuery = ref('')
const filterStatus = ref('')
const filterCategory = ref('')
const showDeleteModal = ref(false)
const postToDelete = ref<BlogPost | null>(null)

const categories = ['Strategy', 'Analysis', 'Education', 'Updates', 'News']

// Helper to get full image URL
const getImageUrl = (url: string | null): string => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  // Use dynamic backend URL based on current host
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const backendPort = '3001'
  return `http://${host}:${backendPort}${url}`
}

const filteredPosts = computed(() => {
  let result = posts.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.title.toLowerCase().indexOf(query) !== -1 ||
      p.author.toLowerCase().indexOf(query) !== -1
    )
  }
  
  if (filterStatus.value) {
    result = result.filter(p => p.status === filterStatus.value)
  }
  
  if (filterCategory.value) {
    result = result.filter(p => p.category === filterCategory.value)
  }
  
  return result
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const fetchPosts = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    const baseUrl = config.public?.apiBaseUrl || 'http://localhost:3001'
    
    const res = await fetch(`${baseUrl}/api/blog/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    const data = await res.json()
    if (data.success) {
      posts.value = data.data.posts
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

const togglePublish = async (post: BlogPost) => {
  try {
    const token = localStorage.getItem('token')
    const baseUrl = config.public?.apiBaseUrl || 'http://localhost:3001'
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    
    const res = await fetch(`${baseUrl}/api/blog/admin/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    })
    
    if (res.ok) {
      post.status = newStatus
    }
  } catch (error) {
    console.error('Error toggling publish:', error)
  }
}

const deletePost = (post: BlogPost) => {
  postToDelete.value = post
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!postToDelete.value) return
  
  try {
    const token = localStorage.getItem('token')
    const baseUrl = config.public?.apiBaseUrl || 'http://localhost:3001'
    
    const res = await fetch(`${baseUrl}/api/blog/admin/${postToDelete.value.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (res.ok) {
      posts.value = posts.value.filter(p => p.id !== postToDelete.value?.id)
    }
  } catch (error) {
    console.error('Error deleting post:', error)
  } finally {
    showDeleteModal.value = false
    postToDelete.value = null
  }
}

onMounted(() => {
  fetchPosts()
})
</script>
