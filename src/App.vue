<script setup>
import { useUserStore } from './stores/user.js'
import { usePostStore } from './stores/postStore.js'
import NavComponent from './components/NavComponent.vue'
import { onMounted } from 'vue'

const userStore = useUserStore()
const postStore = usePostStore()

onMounted(async () => {
  try {
    await userStore.fetchUser()
    if (userStore.isLoggedIn) {
      await postStore.fetchPostList()
      await userStore.fetchProfile()
    } else {
      await postStore.fetchPostList()
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <NavComponent />
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
  font-family: monospace;
}

html {
  background-color: rgb(6 43 50);
}

button {
  padding: 12px 24px;
  background-color: #011c39; /* Mantén el color azul vibrante para el botón */
  color: white;
  border: none;
  border-radius: 8px; /* Bordes redondeados */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #00366f;
}

input {
  width: 90%;
  padding: 10px;
  margin: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
