<template>
  <div class="min-h-screen bg-dark-900 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/blog" class="p-2 text-gray-400 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-white">{{ isEdit ? 'Edit Post' : 'Create New Post' }}</h1>
        <p class="text-gray-400 text-sm">{{ isEdit ? 'Update your blog post' : 'Write a new blog post' }}</p>
      </div>
    </div>

    <form @submit.prevent="savePost" class="grid lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title -->
        <div class="bg-dark-800 border border-dark-700 rounded-xl p-4">
          <label class="block text-sm font-medium text-gray-400 mb-2">Title *</label>
          <input 
            v-model="form.title"
            type="text"
            placeholder="Enter post title..."
            class="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white text-lg placeholder-gray-500 focus:border-green-500 focus:outline-none"
            required
          />
          <p class="text-gray-500 text-xs mt-2">Slug: {{ generatedSlug }}</p>
        </div>

        <!-- Excerpt -->
        <div class="bg-dark-800 border border-dark-700 rounded-xl p-4">
          <label class="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
          <textarea 
            v-model="form.excerpt"
            rows="2"
            placeholder="Short description for the post..."
            class="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <!-- Content -->
        <div class="bg-dark-800 border border-dark-700 rounded-xl p-4">
          <label class="block text-sm font-medium text-gray-400 mb-2">Content *</label>
          <textarea 
            v-model="form.content"
            rows="15"
            placeholder="Write your post content here... (Supports HTML)"
            class="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none resize-none font-mono text-sm"
            required
          ></textarea>
          <p class="text-gray-500 text-xs mt-2">Tip: You can use HTML tags for formatting</p>
        </div>

        <!-- SEO Section -->
        <div class="bg-dark-800 border border-dark-700 rounded-xl p-4">
          <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            SEO Settings
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Meta Title</label>
              <input 
                v-model="form.metaTitle"
                type="text"
                placeholder="SEO title (max 60 characters)"
                maxlength="60"
                class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
              />
              <p class="text-gray-500 text-xs mt-1">{{ form.metaTitle?.length || 0 }}/60 characters</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Meta Description</label>
              <textarea 
                v-model="form.metaDescription"
                rows="2"
                placeholder="SEO description (max 160 characters)"
                maxlength="160"
                class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none resize-none"
              ></textarea>
              <p class="text-gray-500 text-xs mt-1">{{ form.metaDescription?.length || 0 }}/160 characters</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Meta Keywords</label>
              <input 
                v-model="form.metaKeywords"
                type="text"
                placeholder="keyword1, keyword2, keyword3"
                class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Publish Box -->
        <div class="bg-dark-800 border border-dark-700 rounded-xl p-4">
          <h3 class="text-lg font-semibold text-white mb-4">Publish</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select 
                v-model="form.status"
                class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            
            <div class="flex items-center gap-3">
              <input 
                v-model="form.featured"
                type="checkbox"
                id="featured"
                class="w-4 h-4 bg-dark-700 border-dark-600 rounded text-green-500 focus:ring-green-500"
              />
              <label for="featured" class="text-sm text-gray-400">Featured Post</label>
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t border-dark-700 flex gap-3">
            <button 
              type="submit" 
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span v-if="saving">Saving...</span>
              <span v-else>{{ isEdit ? 'Update' : 'Publish' }}</span>
            </button>
          </div>
        </div>

        <!-- Featured Image -->
        <div class="bg-dark-800 border border-dark-700 rounded-xl p-4">
          <h3 class="text-lg font-semibold text-white mb-4">Featured Image</h3>
          
          <div v-if="form.featuredImage" class="mb-4">
            <img :src="getImageUrl(form.featuredImage)" alt="Featured" class="w-full h-40 object-cover rounded-lg" />
            <button @click="form.featuredImage = ''" type="button" class="mt-2 text-sm text-red-500 hover:text-red-400">
              Remove Image
            </button>
          </div>
          
          <div v-else class="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center">
            <input 
              type="file" 
              accept="image/*"
              @change="uploadImage"
              class="hidden"
              id="imageUpload"
            />
            <label for="imageUpload" class="cursor-pointer">
              <svg class="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-gray-500 text-sm">Click to upload image</p>
              <p class="text-gray-600 text-xs mt-1">Max 5MB</p>
            </label>
          </div>
          
          <div class="mt-3">
            <label class="block text-sm font-medium text-gray-400 mb-2">Or paste image URL</label>
            <input 
              v-model="form.featuredImage"
              type="text"
              placeholder="https://..."
              class="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        <!-- Category & Author -->
        <div class="bg-dark-800 border border-dark-700 rounded-xl p-4">
          <h3 class="text-lg font-semibold text-white mb-4">Details</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Category *</label>
              <select 
                v-model="form.category"
                class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                required
              >
                <option value="">Select Category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Author *</label>
              <input 
                v-model="form.author"
                type="text"
                placeholder="Author name"
                class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Tags</label>
              <input 
                v-model="tagsInput"
                type="text"
                placeholder="tag1, tag2, tag3"
                class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
              />
              <p class="text-gray-500 text-xs mt-1">Separate tags with commas</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// @ts-ignore
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
// @ts-ignore - Nuxt auto-imports
const config = useRuntimeConfig()

const isEdit = computed(() => route.params.id && route.params.id !== 'create')
const saving = ref(false)
const tagsInput = ref('')

const categories = ['Strategy', 'Analysis', 'Education', 'Updates', 'News']

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  author: '',
  status: 'DRAFT',
  featured: false,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: ''
})

const generatedSlug = computed(() => {
  return form.value.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
})

// Helper to get full image URL
const getImageUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  // Use dynamic backend URL based on current host
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const backendPort = '3001'
  return `http://${host}:${backendPort}${url}`
}

const uploadImage = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  
  const file = input.files[0]
  if (file.size > 5 * 1024 * 1024) {
    alert('Image must be less than 5MB')
    return
  }
  
  const formData = new FormData()
  formData.append('image', file)
  
  try {
    const token = localStorage.getItem('token')
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const baseUrl = `http://${host}:3001`
    
    const res = await fetch(`${baseUrl}/api/blog/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    
    const data = await res.json()
    if (data.success) {
      // Store relative URL - will be prefixed with backend URL when displaying
      form.value.featuredImage = data.data.url
    }
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

const fetchPost = async () => {
  if (!isEdit.value) return
  
  try {
    const token = localStorage.getItem('token')
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const baseUrl = `http://${host}:3001`
    
    const res = await fetch(`${baseUrl}/api/blog/admin/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    const data = await res.json()
    if (data.success) {
      const post = data.data
      form.value = {
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        featuredImage: post.featuredImage || '',
        category: post.category,
        author: post.author,
        status: post.status,
        featured: post.featured,
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        metaKeywords: post.metaKeywords || ''
      }
      tagsInput.value = (post.tags || []).join(', ')
    }
  } catch (error) {
    console.error('Error fetching post:', error)
  }
}

const savePost = async () => {
  saving.value = true
  
  try {
    const token = localStorage.getItem('token')
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const baseUrl = `http://${host}:3001`
    
    const tags = tagsInput.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
    
    const payload = {
      ...form.value,
      tags
    }
    
    const url = isEdit.value 
      ? `${baseUrl}/api/blog/admin/${route.params.id}`
      : `${baseUrl}/api/blog/admin`
    
    const res = await fetch(url, {
      method: isEdit.value ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    
    const data = await res.json()
    if (data.success) {
      router.push('/admin/blog')
    } else {
      alert(data.message || 'Error saving post')
    }
  } catch (error) {
    console.error('Error saving post:', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchPost()
})
</script>
