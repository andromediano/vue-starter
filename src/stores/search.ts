// src/stores/search.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref<string>('')

  const setSearchQuery = (query: string) => {
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
