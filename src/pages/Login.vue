<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const login = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const success = authStore.login(email.value, password.value)

    if (success) {
      router.push('/')
    } else {
      error.value = 'Invalid email or password'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to SiteHub
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <Label for="email">Email address</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Email"
            />
          </div>
          <div>
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <Button type="submit" class="w-full" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            Sign in
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
