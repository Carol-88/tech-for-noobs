import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const usePostStore = defineStore({
  id: 'post',
  state: () => ({
    posts: [],
    activePost: null,
    post: {
      title: '',
      subtitle: '',
      image: null,
      text: '',
      author_name: '',
      date: ''
    },
    errorMessage: ''
  }),
  actions: {
    async fetchPostList() {
      try {
        const { data, error } = await supabase.from('posts').select('*')
        if (error) {
          this.errorMessage = 'Error al obtener la lista de posts.'
          throw error
        }
        if (data && data.length > 0) {
          this.posts = data
          this.errorMessage = ''
        }
      } catch (error) {
        console.error('Error al obtener la lista de posts:', error.message)
        this.errorMessage =
          'Error al obtener la lista de posts. Por favor, inténtalo de nuevo más tarde.'
      }
    },
    updatePostTitle(title) {
      this.post.title = title
    },
    updateSubtitle(subtitle) {
      this.post.subtitle = subtitle
    },
    updateImage(image) {
      this.post.image = image
    },
    updateText(text) {
      this.post.text = text
    },
    updateDate(date) {
      this.post.date = new Date(date)
    },
    updatePost(postData) {
      Object.assign(this.post, postData)
    },
    updateAuthorName(author_name) {
      this.post.author_name = author_name
    },
    async loadPostById(id) {
      try {
        let { data: posts } = await supabase.from('posts').select('id')

        const post = posts.find((p) => p.id === id)

        if (post) {
          this.activePost = post
        } else {
          console.log('Post not found')
        }
      } catch (error) {
        console.error('Error al cargar el post por ID:', error)
        throw error
      }
    },

    async createPost() {
      try {
        const { data, error } = await supabase.from('posts').insert([this.post])
        if (error) {
          this.errorMessage = 'Error al crear el post.'
          throw error
        }
        if (data) {
          this.fetchPostList()
          this.errorMessage = ''
        }
      } catch (error) {
        console.error('Error al crear el post:', error.message)
        this.errorMessage = 'Error al crear el post. Por favor, inténtalo de nuevo más tarde.'
      }
    }
  }
})
