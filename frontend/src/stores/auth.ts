import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: {
      username: '',
      displayName: 'Manxia',
      avatar: 'M'
    }
  }),

  actions: {
    login(username: string, password: string): boolean {
      if (username === 'admin' && password === 'password') {
        this.isAuthenticated = true
        this.user.username = username
        return true
      }
      return false
    },

    logout() {
      this.isAuthenticated = false
      this.user.username = ''
    }
  }
})