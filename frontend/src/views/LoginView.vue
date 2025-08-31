<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Personal Life Management</h1>
      <input 
        v-model="username" 
        type="text" 
        placeholder="Username" 
        @keypress.enter="handleLogin"
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="Password" 
        @keypress.enter="handleLogin"
      />
      <button class="login-btn" @click="handleLogin">Login</button>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('admin')
const password = ref('password')
const error = ref('')

const handleLogin = () => {
  const success = authStore.login(username.value, password.value)
  
  if (success) {
    router.push('/dashboard')
  } else {
    error.value = 'Invalid credentials'
    setTimeout(() => {
      error.value = ''
    }, 3000)
  }
}
</script>

<style scoped>
.error-message {
  color: #e53e3e;
  font-size: 14px;
  margin-top: 10px;
}
</style>