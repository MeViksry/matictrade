<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <NuxtLink
        to="/admin/users"
        class="p-2 rounded-xl hover:bg-gray-100 hover:bg-dark-800 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-white">Create New User</h1>
        <p class="text-gray-500">Add a new user to the system</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Account Information -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-white mb-4">Account Information</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :class="{ 'border-red-500': errors.email }"
              placeholder="user@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Username <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.username"
              type="text"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :class="{ 'border-red-500': errors.username }"
              placeholder="johndoe"
            />
            <p v-if="errors.username" class="mt-1 text-xs text-red-500">{{ errors.username }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                :class="{ 'border-red-500': errors.password }"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
            <button
              type="button"
              @click="generatePassword"
              class="mt-1 text-xs text-primary-500 hover:text-primary-600"
            >
              Generate strong password
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.fullName"
              type="text"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :class="{ 'border-red-500': errors.fullName }"
              placeholder="John Doe"
            />
            <p v-if="errors.fullName" class="mt-1 text-xs text-red-500">{{ errors.fullName }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Phone
            </label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="+62 812 3456 7890"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Role <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.role"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option v-if="authStore.user?.role === 'SUPER_ADMIN'" value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Address
          </label>
          <textarea
            v-model="form.address"
            rows="2"
            class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter address..."
          ></textarea>
        </div>
      </div>

      <!-- Subscription -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-white mb-4">Subscription</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Plan <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.subscriptionPlan"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              @change="updatePrice"
            >
              <option value="FREE">Free</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Price (USDT) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.subscriptionPrice"
              type="number"
              min="0"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div v-if="form.subscriptionPlan === 'CUSTOM'">
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Duration (Days) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.customDuration"
              type="number"
              min="1"
              max="365"
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              Payment Method <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.paymentMethod"
              required
              disabled
              class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="CRYPTO">USDT (Crypto)</option>
            </select>
          </div>
        </div>

        <div class="mt-4">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              v-model="form.autoRenew"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span class="text-sm text-gray-300">Enable auto-renewal</span>
          </label>
        </div>

        <!-- Subscription Summary -->
        <div class="mt-6 p-4 bg-dark-800 rounded-xl">
          <h4 class="text-sm font-medium text-gray-300 mb-2">Summary</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Plan</span>
              <span class="font-medium text-white">{{ form.subscriptionPlan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Duration</span>
              <span class="font-medium text-white">{{ getDuration() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Price</span>
              <span class="font-medium text-white">{{ formatCurrency(form.subscriptionPrice) }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-dark-700">
              <span class="text-gray-500">End Date</span>
              <span class="font-medium text-white">{{ getEndDate() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Notes -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-white mb-4">Admin Notes</h2>
        <textarea
          v-model="form.adminNotes"
          rows="3"
          class="w-full px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Add any internal notes about this user..."
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between">
        <NuxtLink
          to="/admin/users"
          class="px-6 py-2.5 rounded-xl border border-dark-600 text-white hover:bg-dark-800 transition-colors"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-8 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl transition-colors flex items-center space-x-2"
        >
          <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{{ isSubmitting ? 'Creating...' : 'Create User' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { addDays, format } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const router = useRouter()
const authStore = useAuthStore()
const adminStore = useAdminStore()
const toast = useCustomToast()

// State
const isSubmitting = ref(false)
const showPassword = ref(false)
const errors = reactive<Record<string, string>>({})

const form = reactive({
  email: '',
  username: '',
  password: '',
  fullName: '',
  phone: '',
  address: '',
  role: 'USER',
  subscriptionPlan: 'MONTHLY',
  subscriptionPrice: 15,
  customDuration: 30,
  autoRenew: false,
  paymentMethod: 'CRYPTO',
  adminNotes: ''
})

// Price presets in USDT
const pricePresets: Record<string, number> = {
  FREE: 0,
  MONTHLY: 15,
  YEARLY: 150,
  CUSTOM: 0
}

// Methods
const updatePrice = () => {
  form.subscriptionPrice = pricePresets[form.subscriptionPlan] || 0
}

const getDuration = () => {
  switch (form.subscriptionPlan) {
    case 'FREE': return 'Unlimited'
    case 'MONTHLY': return '30 days'
    case 'YEARLY': return '365 days'
    case 'CUSTOM': return `${form.customDuration} days`
    default: return '-'
  }
}

const getEndDate = () => {
  const days = form.subscriptionPlan === 'FREE' ? 9999 
    : form.subscriptionPlan === 'MONTHLY' ? 30 
    : form.subscriptionPlan === 'YEARLY' ? 365 
    : form.customDuration
  return format(addDays(new Date(), days), 'dd MMM yyyy')
}

const formatCurrency = (value: number) => {
  return `${value.toFixed(2)} USDT`
}

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.password = password
  showPassword.value = true
}

const validate = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email format'
  }

  if (!form.username) {
    errors.username = 'Username is required'
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (!form.fullName) {
    errors.fullName = 'Full name is required'
  }

  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validate()) {
    toast.error('Please fix the errors in the form')
    return
  }

  isSubmitting.value = true
  try {
    await adminStore.createUser({
      email: form.email,
      username: form.username,
      password: form.password,
      fullName: form.fullName,
      phone: form.phone || undefined,
      address: form.address || undefined,
      role: form.role as any,
      subscriptionPlan: form.subscriptionPlan as any,
      subscriptionPrice: form.subscriptionPrice,
      customDuration: form.subscriptionPlan === 'CUSTOM' ? form.customDuration : undefined,
      autoRenew: form.autoRenew,
      paymentMethod: form.paymentMethod as any
    })

    toast.success('User created successfully')
    router.push('/admin/users')
  } catch (error: any) {
    toast.error(error.message || 'Failed to create user')
  } finally {
    isSubmitting.value = false
  }
}
</script>