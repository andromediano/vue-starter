// src/stores/search.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref<string>('')
  console.log('Pinia store initialized with searchQuery:', searchQuery.value)

  const setSearchQuery = (query: string) => {
    console.log('Setting searchQuery to:', query)
    searchQuery.value = query
  }

  const clearSearchQuery = () => {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    setSearchQuery,
    clearSearchQuery,
  }
})
