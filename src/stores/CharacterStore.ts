import { defineStore } from 'pinia'
import { ref } from 'vue'

// 검색 조건 타입 정의
interface SearchCriteria {
  name: string
  status: string
  species: string
  gender: string
}

export const useCharacterStore = defineStore('character', () => {
  const searchCriteria = ref<SearchCriteria>({
    name: '',
    status: '',
    species: '',
    gender: '',
  })

  const setSearchCriteria = (criteria: Partial<SearchCriteria>) => {
    Object.assign(searchCriteria.value, {
      ...searchCriteria.value,
      ...Object.fromEntries(Object.entries(criteria).filter(([_, value]) => value !== undefined)),
    })
    console.log('Setting search criteria:', searchCriteria.value)
  }

  const clearSearchCriteria = () => {
    Object.keys(searchCriteria.value).forEach((key) => {
      searchCriteria.value[key as keyof SearchCriteria] = ''
    })
  }

  // 검색 파라미터 객체 반환
  const getSearchParams = () => {
    const params: Partial<SearchCriteria> = {}
    Object.entries(searchCriteria.value).forEach(([key, value]) => {
      if (value) params[key as keyof SearchCriteria] = value
    })
    return params
  }

  return {
    searchCriteria,
    setSearchCriteria,
    clearSearchCriteria,
    getSearchParams,
  }
})
