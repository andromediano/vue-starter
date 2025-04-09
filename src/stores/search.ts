import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const firstName = ref<string>('')
  const lastName = ref<string>('')
  const email = ref<string>('')

  const setSearchCriteria = (criteria: {
    firstName?: string
    lastName?: string
    email?: string
  }) => {
    if (criteria.firstName !== undefined) firstName.value = criteria.firstName
    if (criteria.lastName !== undefined) lastName.value = criteria.lastName
    if (criteria.email !== undefined) email.value = criteria.email
    console.log('Setting search criteria:', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
    })
  }

  const clearSearchCriteria = () => {
    firstName.value = ''
    lastName.value = ''
    email.value = ''
  }

  // 검색 조건을 조합한 쿼리 문자열 반환
  const getSearchQuery = () => {
    return [firstName.value, lastName.value, email.value]
      .filter(Boolean) // 빈 문자열 제거
      .join(' ')
      .trim()
  }

  return {
    firstName,
    lastName,
    email,
    setSearchCriteria,
    clearSearchCriteria,
    getSearchQuery,
  }
})
