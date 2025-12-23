<template>
  <!-- Chat Button -->
  <button
    v-if="!isOpen"
    @click="openChat"
    class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
  >
    <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
    <!-- Unread Indicator -->
    <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
      {{ unreadCount > 9 ? '9+' : unreadCount }}
    </span>
  </button>

  <!-- Chat Window -->
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-200"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed inset-x-4 bottom-4 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-96 max-h-[85vh] bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-500 to-green-600 p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 class="text-white font-semibold text-sm sm:text-base">Live Support</h3>
              <p class="text-white/70 text-[10px] sm:text-xs">We typically reply within minutes</p>
            </div>
          </div>
          <button @click="closeChat" class="text-white/70 hover:text-white transition p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Registration Form -->
      <div v-if="!sessionId" class="p-3 sm:p-4 overflow-y-auto max-h-[60vh]">
        <p class="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Please fill in your details to start chatting:</p>
        <form @submit.prevent="startChat" class="space-y-2 sm:space-y-3">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email *"
            required
            class="w-full px-3 sm:px-4 py-2 text-sm bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
          <input
            v-model="form.fullName"
            type="text"
            placeholder="Full Name *"
            required
            class="w-full px-3 sm:px-4 py-2 text-sm bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
          <input
            v-model="form.whatsapp"
            type="tel"
            placeholder="WhatsApp Number *"
            required
            class="w-full px-3 sm:px-4 py-2 text-sm bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
          <input
            v-model="form.username"
            type="text"
            placeholder="Username *"
            required
            class="w-full px-3 sm:px-4 py-2 text-sm bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
          <input
            v-model="form.address"
            type="text"
            placeholder="Address (Optional)"
            class="w-full px-3 sm:px-4 py-2 text-sm bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 sm:py-3 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base font-semibold rounded-lg transition disabled:opacity-50"
          >
            {{ isLoading ? 'Starting...' : 'Start Chat' }}
          </button>
        </form>
      </div>

      <!-- Chat Interface -->
      <div v-else class="flex flex-col flex-1 min-h-0">
        <!-- Messages -->
        <div 
          ref="messagesContainer"
          class="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 sm:space-y-3"
        >
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="text-center py-6 sm:py-8">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-white font-medium text-sm sm:text-base">Connected!</p>
            <p class="text-gray-400 text-xs sm:text-sm">Send a message to start the conversation</p>
          </div>

          <!-- Message List -->
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-xl sm:rounded-2xl',
              msg.senderType === 'VISITOR' 
                ? 'ml-auto bg-green-500 text-white rounded-br-sm' 
                : 'mr-auto bg-dark-700 text-white rounded-bl-sm'
            ]"
          >
            <!-- Image -->
            <a v-if="msg.imageUrl" :href="`${apiBase}${msg.imageUrl}`" target="_blank" class="block mb-1">
              <img 
                :src="`${apiBase}${msg.imageUrl}`" 
                alt="Uploaded image" 
                class="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition"
                style="max-height: 200px;"
              />
            </a>
            <p v-if="msg.message" class="text-xs sm:text-sm">{{ msg.message }}</p>
            <p class="text-[9px] sm:text-[10px] opacity-70 mt-0.5 sm:mt-1">
              {{ formatTime(msg.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Input -->
        <div class="p-3 sm:p-4 border-t border-dark-700">
          <form @submit.prevent="sendMessage" class="flex gap-2 items-center">
            <!-- Image Upload Button -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageSelect"
            />
            <button
              type="button"
              @click="($refs.fileInput as HTMLInputElement)?.click()"
              :disabled="isUploading"
              class="w-9 h-9 sm:w-10 sm:h-10 bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-white rounded-full flex items-center justify-center transition flex-shrink-0"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              class="flex-1 px-3 sm:px-4 py-2 text-sm bg-dark-700 border border-dark-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <button
              type="submit"
              :disabled="(!newMessage.trim() && !isUploading) || isSending"
              class="w-9 h-9 sm:w-10 sm:h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition disabled:opacity-50 flex-shrink-0"
            >
              <svg v-if="isUploading" class="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

interface ChatMessage {
  id: string
  sessionId: string
  senderType: 'VISITOR' | 'ADMIN'
  message: string
  imageUrl?: string
  createdAt: string
}

// Props for external control
const props = defineProps<{
  isOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const config = useRuntimeConfig()
const apiBase = config.public?.apiBaseUrl || ''

// State
const isOpen = ref(false)
const isLoading = ref(false)
const isSending = ref(false)
const isUploading = ref(false)
const sessionId = ref<string | null>(null)
const messages = ref<ChatMessage[]>([])
const newMessage = ref('')
const unreadCount = ref(0)
const messagesContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const form = ref({
  email: '',
  fullName: '',
  whatsapp: '',
  username: '',
  address: ''
})

// Watch for external isOpen prop changes
watch(() => props.isOpen, (newVal) => {
  if (newVal !== undefined) {
    isOpen.value = newVal
  }
})

// Load session from localStorage
onMounted(() => {
  const savedSession = localStorage.getItem('chatSessionId')
  if (savedSession) {
    sessionId.value = savedSession
    loadMessages()
  }
})

// Open/Close chat
const openChat = () => {
  isOpen.value = true
  emit('update:isOpen', true)
  unreadCount.value = 0
}

const closeChat = () => {
  isOpen.value = false
  emit('update:isOpen', false)
}

// Start chat session
const startChat = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${apiBase}/api/public/chat/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const data = await response.json()
    if (data.success) {
      sessionId.value = data.data.sessionId
      localStorage.setItem('chatSessionId', data.data.sessionId)
      connectWebSocket()
    }
  } catch (error) {
    console.error('Start chat error:', error)
  } finally {
    isLoading.value = false
  }
}

// Load existing messages
const loadMessages = async () => {
  if (!sessionId.value) return
  try {
    const response = await fetch(`${apiBase}/api/public/chat/${sessionId.value}/messages`)
    const data = await response.json()
    if (data.success) {
      messages.value = data.data.messages
      scrollToBottom()
      connectWebSocket()
    } else {
      // Session was deleted by admin, clear localStorage and show form again
      localStorage.removeItem('chatSessionId')
      sessionId.value = null
      messages.value = []
    }
  } catch (error) {
    console.error('Load messages error:', error)
    // On error, clear session and show form again
    localStorage.removeItem('chatSessionId')
    sessionId.value = null
    messages.value = []
  }
}

// Send message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !sessionId.value) return
  
  isSending.value = true
  const messageText = newMessage.value.trim()
  newMessage.value = ''
  
  try {
    const response = await fetch(`${apiBase}/api/public/chat/${sessionId.value}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageText })
    })
    const data = await response.json()
    if (data.success) {
      messages.value.push(data.data)
      scrollToBottom()
    }
  } catch (error) {
    console.error('Send message error:', error)
    newMessage.value = messageText // Restore message on error
  } finally {
    isSending.value = false
  }
}

// Handle image selection and upload
const handleImageSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file || !sessionId.value) return

  isUploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('message', newMessage.value.trim())
    
    const response = await fetch(`${apiBase}/api/public/chat/${sessionId.value}/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    if (data.success) {
      messages.value.push(data.data)
      newMessage.value = ''
      scrollToBottom()
    } else {
      alert('Failed to upload image')
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert('Failed to upload image')
  } finally {
    isUploading.value = false
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// WebSocket connection
let socket: WebSocket | null = null

const connectWebSocket = () => {
  if (!sessionId.value) return
  
  // Use Socket.IO client or simple polling for now
  // For simplicity, using polling every 3 seconds
  setInterval(async () => {
    if (!sessionId.value || !isOpen.value) return
    try {
      const response = await fetch(`${apiBase}/api/public/chat/${sessionId.value}/messages`)
      const data = await response.json()
      if (data.success && data.data.messages.length > messages.value.length) {
        const newMessages = data.data.messages.slice(messages.value.length)
        messages.value.push(...newMessages)
        
        // Count unread admin messages
        const adminMessages = newMessages.filter((m: ChatMessage) => m.senderType === 'ADMIN')
        if (adminMessages.length > 0 && !isOpen.value) {
          unreadCount.value += adminMessages.length
        }
        scrollToBottom()
      }
    } catch (error) {
      console.error('Poll messages error:', error)
    }
  }, 3000)
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

// Watch for new messages to scroll
watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>
