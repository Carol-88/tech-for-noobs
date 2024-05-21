import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import router from '@/router'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: null,
    profile: null,
    errorMessage: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.user // Devuelve true si user no es null
  },
  actions: {
    async fetchUser() {
      try {
        const { data } = await supabase.auth.getUser()
        if (data && data.user) {
          this.user = data.user
          this.errorMessage = null
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error.message)
        this.errorMessage = 'Error al obtener el usuario. Por favor, inténtalo de nuevo más tarde.'
      }
    },
    async signUp(email, password) {
      try {
        const { user, error } = await supabase.auth.signUp({
          email: email,
          password: password
        })
        if (error) throw error
        if (user) this.user = user
        this.errorMessage = null
      } catch (error) {
        console.error('Error al registrarse:', error.message)
        this.errorMessage = 'Error al registrarse. Por favor, inténtalo de nuevo más tarde.'
      }
    },
    async signInWithEmail(email, password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        })
        if (error) throw error
        if (data) {
          this.user = data.user
          console.log(this.user)
          this.errorMessage = null
          // await this.fetchUser()
          // await this.fetchPostList()
          // await this.fetchProfile()
          router.push({ path: '/' })
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error.message)
        this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.'
      }
    },
    async signOut() {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        this.user = null
        this.errorMessage = null
        router.push({ path: '/login' })
      } catch (error) {
        console.error('Error al cerrar sesión:', error.message)
        this.errorMessage = 'Error al cerrar sesión. Por favor, inténtalo de nuevo más tarde.'
      }
    },
    async fetchProfile() {
      if (!this.user || !this.user.id) {
        this.errorMessage = 'No hay usuario seleccionado o no inició sesión.'
        return
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .match({ id: this.user.id })

        if (error) {
          this.errorMessage = 'Error al obtener el perfil.'
          return
        }
        if (!data || data.length === 0) {
          this.errorMessage = 'Perfil no encontrado.'
          return
        }
        this.profile = data[0]
        this.errorMessage = null
      } catch (error) {
        console.error('Error al obtener el perfil:', error.message)
        this.errorMessage = 'Error al obtener el perfil. Por favor, inténtalo de nuevo más tarde.'
      }
    },
    async updateProfile(full_name, avatar_url, username) {
      if (!this.user || !this.user.id) {
        this.errorMessage = 'No hay usuario seleccionado o no inició sesión.'
        return
      }

      try {
        let newUsername = this.profile.username
        let newAvatarUrl = this.profile.avatar_url
        let newFullName = this.profile.full_name

        if (full_name) newFullName = full_name
        if (avatar_url) newAvatarUrl = avatar_url
        if (username) newUsername = username

        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: newFullName,
            avatar_url: newAvatarUrl,
            username: newUsername
          })
          .match({ id: this.user.id })

        if (error) throw error
        this.profile = {
          username: newUsername,
          avatar_url: newAvatarUrl,
          full_name: newFullName
        }
        this.errorMessage = null
      } catch (error) {
        console.error('Error al actualizar el perfil:', error.message)
        this.errorMessage =
          'Error al actualizar el perfil. Por favor, inténtalo de nuevo más tarde.'
      }
    },
    async deleteUser() {
      try {
        const { error } = await supabase.from('users').delete().match({ id: this.user?.id })
        if (error) throw error
        this.user = null
        this.errorMessage = null
      } catch (error) {
        console.error('Error al eliminar el usuario:', error.message)
        this.errorMessage = 'Error al eliminar el usuario. Por favor, inténtalo de nuevo más tarde.'
      }
    }
  }
})
