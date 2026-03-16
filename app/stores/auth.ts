import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = useSupabaseUser()
  const isLoggedIn = computed(() => !!user.value)

  async function signOut() {
    const supabase = useSupabaseClient()
    await supabase.auth.signOut()
    await navigateTo('/auth/login')
  }

  return { user, isLoggedIn, signOut }
})
