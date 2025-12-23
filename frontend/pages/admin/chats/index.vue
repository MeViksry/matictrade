<template>
  <div class="min-h-screen bg-dark-950 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white">Chat Management</h1>
        <p class="text-gray-400 text-sm">Manage visitor chat sessions</p>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Stats -->
        <div class="flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-lg">
          <span class="text-gray-400 text-sm">Active:</span>
          <span class="text-green-400 font-semibold">{{ stats.active }}</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-lg">
          <span class="text-gray-400 text-sm">Unread:</span>
          <span class="text-red-400 font-semibold">{{ stats.unread }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chat List -->
      <div class="lg:col-span-1 bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div class="p-4 border-b border-dark-700">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search chats..."
            class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
        </div>
        
        <div class="divide-y divide-dark-700 max-h-[600px] overflow-y-auto">
          <div
            v-for="session in filteredSessions"
            :key="session.id"
            @click="selectSession(session)"
            :class="[
              'p-4 cursor-pointer transition-colors',
              selectedSession?.id === session.id ? 'bg-dark-700' : 'hover:bg-dark-700/50'
            ]"
          >
            <div class="flex items-start gap-3">
              <!-- Avatar -->
              <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-green-400 font-semibold">{{ session.fullName?.charAt(0) || '?' }}</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-white font-medium truncate">{{ session.fullName }}</span>
                  <span :class="[
                    'w-2 h-2 rounded-full',
                    session.isOnline ? 'bg-green-500' : 'bg-gray-500'
                  ]"></span>
                </div>
                <p class="text-gray-400 text-sm truncate">{{ session.email }}</p>
                <p class="text-gray-500 text-xs mt-1 truncate">
                  {{ session.lastMessage?.message || 'No messages yet' }}
                </p>
              </div>
              
              <!-- Unread Badge -->
              <span v-if="session.unreadCount > 0" class="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {{ session.unreadCount }}
              </span>
            </div>
          </div>
          
          <div v-if="filteredSessions.length === 0" class="p-8 text-center text-gray-500">
            No chat sessions found
          </div>
        </div>
      </div>

      <!-- Chat Detail -->
      <div class="lg:col-span-2 bg-dark-800 rounded-xl border border-dark-700 overflow-hidden flex flex-col h-[700px]">
        <template v-if="selectedSession">
          <!-- Chat Header -->
          <div class="p-4 border-b border-dark-700 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <span class="text-green-400 font-semibold">{{ selectedSession.fullName?.charAt(0) }}</span>
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ selectedSession.fullName }}</h3>
                <div class="flex items-center gap-2 text-sm">
                  <span :class="selectedSession.isOnline ? 'text-green-400' : 'text-gray-400'">
                    {{ selectedSession.isOnline ? 'Online' : 'Offline' }}
                  </span>
                  <span class="text-gray-500">•</span>
                  <span class="text-gray-400">{{ selectedSession.email }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                @click="closeChat"
                class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition"
              >
                Close Chat
              </button>
              <button
                @click="deleteChat"
                class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
              >
                Delete Chat
              </button>
            </div>
          </div>

          <!-- Visitor Info -->
          <div class="p-3 bg-dark-900/50 border-b border-dark-700 text-sm">
            <div class="flex flex-wrap gap-4">
              <span class="text-gray-400">📱 <span class="text-white">{{ selectedSession.whatsapp }}</span></span>
              <span class="text-gray-400">👤 <span class="text-white">{{ selectedSession.username }}</span></span>
              <span v-if="selectedSession.address" class="text-gray-400">📍 <span class="text-white">{{ selectedSession.address }}</span></span>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto space-y-3">
            <div
              v-for="msg in messages"
              :key="msg.id"
              :class="[
                'max-w-[70%] p-3 rounded-2xl',
                msg.senderType === 'ADMIN' 
                  ? 'ml-auto bg-green-500 text-white rounded-br-sm' 
                  : 'mr-auto bg-dark-700 text-white rounded-bl-sm'
              ]"
            >
              <!-- Image -->
              <a v-if="msg.imageUrl" :href="`${apiBase}${msg.imageUrl}`" target="_blank" class="block mb-2">
                <img 
                  :src="`${apiBase}${msg.imageUrl}`" 
                  alt="Uploaded image" 
                  class="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition"
                  style="max-height: 250px;"
                />
              </a>
              <p v-if="msg.message">{{ msg.message }}</p>
              <p class="text-xs opacity-70 mt-1">{{ formatTime(msg.createdAt) }}</p>
            </div>
            
            <div v-if="messages.length === 0" class="text-center py-8 text-gray-500">
              No messages yet
            </div>
          </div>

          <!-- Reply Input -->
          <div class="p-4 border-t border-dark-700">
            <form @submit.prevent="sendReply" class="flex gap-2">
              <input
                v-model="replyMessage"
                type="text"
                placeholder="Type your reply..."
                class="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
              <button
                type="submit"
                :disabled="!replyMessage.trim() || isSending"
                class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {{ isSending ? 'Sending...' : 'Send' }}
              </button>
            </form>
          </div>
        </template>
        
        <template v-else>
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p class="text-gray-400">Select a chat to view messages</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

interface ChatSession {
  id: string
  email: string
  fullName: string
  whatsapp: string
  username: string
  address?: string
  status: string
  isOnline: boolean
  unreadCount: number
  lastMessage?: { message: string }
}

interface ChatMessage {
  id: string
  senderType: 'VISITOR' | 'ADMIN'
  message: string
  imageUrl?: string
  createdAt: string
}

const config = useRuntimeConfig()
const apiBase = config.public?.apiBaseUrl || ''

// State
const sessions = ref<ChatSession[]>([])
const selectedSession = ref<ChatSession | null>(null)
const messages = ref<ChatMessage[]>([])
const replyMessage = ref('')
const searchQuery = ref('')
const isSending = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const stats = ref({ total: 0, active: 0, closed: 0, unread: 0 })

// Get auth token
const getToken = () => {
  if (process.client) {
    return localStorage.getItem('token')
  }
  return null
}

// Filtered sessions
const filteredSessions = computed(() => {
  if (!searchQuery.value) return sessions.value
  const query = searchQuery.value.toLowerCase()
  return sessions.value.filter(s => 
    s.fullName.toLowerCase().includes(query) ||
    s.email.toLowerCase().includes(query) ||
    s.username.toLowerCase().includes(query)
  )
})

// Load sessions
const loadSessions = async () => {
  try {
    const response = await fetch(`${apiBase}/api/admin/chats`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    const data = await response.json()
    if (data.success) {
      sessions.value = data.data.sessions
    }
  } catch (error) {
    console.error('Load sessions error:', error)
  }
}

// Load stats
const loadStats = async () => {
  try {
    const response = await fetch(`${apiBase}/api/admin/chats/stats/summary`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    const data = await response.json()
    if (data.success) {
      stats.value = data.data
    }
  } catch (error) {
    console.error('Load stats error:', error)
  }
}

// Select session
const selectSession = async (session: ChatSession) => {
  selectedSession.value = session
  try {
    const response = await fetch(`${apiBase}/api/admin/chats/${session.id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    const data = await response.json()
    if (data.success) {
      messages.value = data.data.messages
      // Update unread count
      session.unreadCount = 0
      scrollToBottom()
    }
  } catch (error) {
    console.error('Load messages error:', error)
  }
}

// Send reply
const sendReply = async () => {
  if (!replyMessage.value.trim() || !selectedSession.value) return
  
  isSending.value = true
  const messageText = replyMessage.value.trim()
  replyMessage.value = ''
  
  try {
    const response = await fetch(`${apiBase}/api/admin/chats/${selectedSession.value.id}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ message: messageText })
    })
    const data = await response.json()
    if (data.success) {
      messages.value.push(data.data)
      scrollToBottom()
    }
  } catch (error) {
    console.error('Send reply error:', error)
    replyMessage.value = messageText
  } finally {
    isSending.value = false
  }
}

// Close chat
const closeChat = async () => {
  if (!selectedSession.value) return
  try {
    await fetch(`${apiBase}/api/admin/chats/${selectedSession.value.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ status: 'CLOSED' })
    })
    loadSessions()
    selectedSession.value = null
    messages.value = []
  } catch (error) {
    console.error('Close chat error:', error)
  }
}

// Delete chat
const deleteChat = async () => {
  if (!selectedSession.value) return
  
  const confirmed = confirm(`Are you sure you want to delete chat with ${selectedSession.value.fullName}? This action cannot be undone.`)
  if (!confirmed) return
  
  try {
    await fetch(`${apiBase}/api/admin/chats/${selectedSession.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    loadSessions()
    loadStats()
    selectedSession.value = null
    messages.value = []
  } catch (error) {
    console.error('Delete chat error:', error)
  }
}

// Scroll to bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Format time
const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// Polling for new messages
let pollInterval: any = null

onMounted(() => {
  loadSessions()
  loadStats()
  
  // Poll every 5 seconds
  pollInterval = setInterval(() => {
    loadSessions()
    if (selectedSession.value) {
      selectSession(selectedSession.value)
    }
  }, 5000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>
