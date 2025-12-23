<template>
  <div class="space-y-6 animate-in">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white">Settings</h1>
      <p class="text-gray-400 mt-1">Manage your account settings and profile</p>
    </div>

    <!-- Profile Photo Section -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-white mb-6">Profile Photo</h2>
      <div class="flex flex-col sm:flex-row items-center gap-6">
        <!-- Avatar Container -->
        <div class="relative group">
          <div class="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ring-4 ring-primary-500/20">
            <img 
              v-if="profileForm.avatar" 
              :src="profileForm.avatar" 
              alt="Profile" 
              class="w-full h-full object-cover"
            />
            <span v-else class="text-white text-4xl font-bold">
              {{ authStore.user?.fullName?.charAt(0) || 'U' }}
            </span>
          </div>
          <!-- Camera Button -->
          <button 
            @click="triggerFileInput"
            class="absolute bottom-1 right-1 w-9 h-9 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ring-3 ring-dark-900"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
          <input 
            ref="fileInputRef"
            type="file" 
            accept="image/*"
            class="hidden"
            @change="handleAvatarChange"
          />
        </div>
        <!-- Info Text -->
        <div class="text-center sm:text-left">
          <p class="text-sm text-gray-400 mb-2">
            Click the camera icon to upload a new photo
          </p>
          <p class="text-xs text-gray-500">
            Accepted formats: JPG, PNG, GIF. Max size: 2MB
          </p>
          <button 
            v-if="profileForm.avatar"
            @click="removeAvatar"
            class="mt-3 text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Remove photo
          </button>
        </div>
      </div>
    </div>

    <!-- Account Info Section -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-white mb-4">Account Information</h2>
      <form @submit.prevent="saveProfile" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              v-model="profileForm.fullName"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              v-model="profileForm.username"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="@username"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              :value="authStore.user?.email"
              type="email"
              disabled
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-700 text-gray-500 cursor-not-allowed"
            />
            <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Phone</label>
            <input
              v-model="profileForm.phone"
              type="tel"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="+62 8xx xxxx xxxx"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <button 
            type="submit"
            :disabled="isSavingProfile"
            class="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
          >
            {{ isSavingProfile ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Change Password Section -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-white mb-4">Change Password</h2>
      <form @submit.prevent="changePassword" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">New Password</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <p v-if="passwordError" class="text-sm text-red-500">{{ passwordError }}</p>
        <div class="flex justify-end">
          <button 
            type="submit"
            :disabled="isChangingPassword"
            class="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
          >
            {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const toast = useCustomToast()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isSavingProfile = ref(false)
const isChangingPassword = ref(false)
const passwordError = ref('')

const profileForm = reactive({
  fullName: authStore.user?.fullName || '',
  username: authStore.user?.username || '',
  phone: authStore.user?.phone || '',
  avatar: authStore.user?.avatar || ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('File too large', 'Maximum file size is 2MB')
    return
  }
  
  // Convert to base64
  const reader = new FileReader()
  reader.onload = (e) => {
    profileForm.avatar = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeAvatar = () => {
  profileForm.avatar = ''
}

const saveProfile = async () => {
  isSavingProfile.value = true
  
  try {
    const { put } = useApi()
    const response = await put('/api/auth/profile', {
      fullName: profileForm.fullName,
      username: profileForm.username,
      phone: profileForm.phone,
      avatar: profileForm.avatar
    })
    
    if (response.success) {
      // Update auth store with new data
      authStore.user = {
        ...authStore.user!,
        fullName: profileForm.fullName,
        username: profileForm.username,
        phone: profileForm.phone,
        avatar: profileForm.avatar
      }
      // Also save to localStorage for persistence
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(authStore.user))
      }
      toast.success('Profile updated', 'Your changes have been saved')
    }
  } catch (error: any) {
    toast.error('Error', error.message || 'Failed to update profile')
  } finally {
    isSavingProfile.value = false
  }
}

const changePassword = async () => {
  passwordError.value = ''
  
  // Validate
  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
    passwordError.value = 'Please fill all password fields'
    return
  }
  
  if (passwordForm.newPassword.length < 8) {
    passwordError.value = 'New password must be at least 8 characters'
    return
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Passwords do not match'
    return
  }
  
  isChangingPassword.value = true
  
  try {
    const { post } = useApi()
    const response = await post('/api/auth/change-password', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    
    if (response.success) {
      toast.success('Password changed', 'Your password has been updated')
      // Reset form
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }
  } catch (error: any) {
    passwordError.value = error.message || 'Failed to change password'
  } finally {
    isChangingPassword.value = false
  }
}

// Watch for auth store changes
watch(() => authStore.user, (user) => {
  if (user) {
    profileForm.fullName = user.fullName || ''
    profileForm.username = user.username || ''
    profileForm.phone = user.phone || ''
    profileForm.avatar = user.avatar || ''
  }
}, { immediate: true })
</script>
