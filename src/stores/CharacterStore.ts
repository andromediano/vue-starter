import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCharacterStore = defineStore('character', () => {
  const name = ref<string>('')
  const status = ref<string>('')
  const species = ref<string>('')
  const gender = ref<string>('')

  const setSearchCriteria = (criteria: {
    name?: string
    status?: string
    species?: string
    gender?: string
  }) => {
    if (criteria.name !== undefined) name.value = criteria.name
    if (criteria.status !== undefined) status.value = criteria.status
    if (criteria.species !== undefined) species.value = criteria.species
    if (criteria.gender !== undefined) gender.value = criteria.gender
    console.log('Setting search criteria:', {
      name: name.value,
      status: status.value,
      species: species.value,
      gender: gender.value,
    })
  }

  const clearSearchCriteria = () => {
    name.value = ''
    status.value = ''
    species.value = ''
    gender.value = ''
  }

  // 검색 파라미터 객체 반환
  const getSearchParams = () => {
    const params: { [key: string]: string } = {}
    if (name.value) params.name = name.value
    if (status.value) params.status = status.value
    if (species.value) params.species = species.value
    if (gender.value) params.gender = gender.value
    return params
  }

  return {
    name,
    status,
    species,
    gender,
    setSearchCriteria,
    clearSearchCriteria,
    getSearchParams,
  }
})
