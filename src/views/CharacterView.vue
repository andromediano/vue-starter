<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCharacterStore } from '@/stores/CharacterStore'

// Rick and Morty 캐릭터 인터페이스 정의
interface Character {
  id: number
  name: string
  status: string
  species: string
  gender: string
  image: string
}

// 라우터와 라우트 사용
const router = useRouter()
const route = useRoute()

// Pinia 스토어 사용
const characterStore = useCharacterStore()

// 반응형 변수 선언
const characters = ref<Character[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)

// 표시할 페이지 번호 계산
const visiblePages = computed(() => {
  const pages: number[] = []
  const pageGroup = Math.floor((currentPage.value - 1) / 10)
  const startPage = pageGroup * 10 + 1
  const endPage = Math.min(startPage + 9, totalPages.value)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

// Rick and Morty 캐릭터 검색 함수
const fetchCharacters = async () => {
  const searchParams = characterStore.getSearchParams()
  console.log('Fetching characters for page:', currentPage.value, 'with params:', searchParams)
  loading.value = true
  error.value = null

  try {
    const response = await axios.get('https://rickandmortyapi.com/api/character', {
      params: {
        ...searchParams,
        page: currentPage.value,
      },
    })
    characters.value = response.data.results
    totalPages.value = response.data.info.pages

    // URL에 페이지 번호 반영
    router.push({
      query: {
        page: currentPage.value.toString(),
      },
    })
  } catch (err) {
    error.value =
      '캐릭터를 가져오는 중 오류가 발생했습니다: ' +
      (err instanceof Error ? err.message : String(err))
    characters.value = []
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

// 페이지 변경 함수
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchCharacters()
  }
}

// 초기화 함수
const initialize = () => {
  const pageFromUrl = parseInt((route.query.page as string) || '1', 10)
  console.log('Initializing with page from URL:', pageFromUrl)
  if (!isNaN(pageFromUrl) && pageFromUrl >= 1) {
    currentPage.value = pageFromUrl
  }

  const storedName = localStorage.getItem('searchName') || ''
  const storedStatus = localStorage.getItem('searchStatus') || ''
  const storedSpecies = localStorage.getItem('searchSpecies') || ''
  const storedGender = localStorage.getItem('searchGender') || ''
  characterStore.setSearchCriteria({
    name: storedName,
    status: storedStatus,
    species: storedSpecies,
    gender: storedGender,
  })

  fetchCharacters() // 검색 조건 없이도 초기 데이터 로드
}

// 컴포넌트 마운트 시 초기화 및 watch 설정
onMounted(() => {
  initialize()

  // 검색 조건 변경 감지 및 localStorage 동기화
  watch(
    () => [
      characterStore.name,
      characterStore.status,
      characterStore.species,
      characterStore.gender,
    ],
    ([newName, newStatus, newSpecies, newGender], [oldName, oldStatus, oldSpecies, oldGender]) => {
      console.log('Search criteria changed:', { newName, newStatus, newSpecies, newGender })
      if (
        newName !== oldName ||
        newStatus !== oldStatus ||
        newSpecies !== oldSpecies ||
        newGender !== oldGender
      ) {
        localStorage.setItem('searchName', newName)
        localStorage.setItem('searchStatus', newStatus)
        localStorage.setItem('searchSpecies', newSpecies)
        localStorage.setItem('searchGender', newGender)
        currentPage.value = 1 // 검색 조건이 바뀌면 첫 페이지로 리셋
        fetchCharacters()
      }
    },
  )

  // 라우트 변경 감지 (뒤로 가기/앞으로 가기)
  watch(
    () => route.query.page,
    (newPage) => {
      const pageFromUrl = parseInt((newPage as string) || '1', 10)
      console.log('Route changed to page:', pageFromUrl)
      if (!isNaN(pageFromUrl) && pageFromUrl >= 1 && pageFromUrl !== currentPage.value) {
        currentPage.value = pageFromUrl
        fetchCharacters()
      }
    },
  )
})
</script>

<template>
  <div class="container">
    <h1>Rick and Morty 캐릭터 검색</h1>

    <!-- 검색 입력 -->
    <div class="search-container">
      <input
        v-model="characterStore.name"
        @keyup.enter="fetchCharacters"
        placeholder="이름 (예: Rick)"
        type="text"
      />
      <select v-model="characterStore.status" @change="fetchCharacters">
        <option value="">상태 선택</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>
      <input
        v-model="characterStore.species"
        @keyup.enter="fetchCharacters"
        placeholder="종 (예: Human)"
        type="text"
      />
      <select v-model="characterStore.gender" @change="fetchCharacters">
        <option value="">성별 선택</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="genderless">Genderless</option>
        <option value="unknown">Unknown</option>
      </select>
      <button @click="fetchCharacters" :disabled="loading">
        {{ loading ? '로딩 중...' : '검색' }}
      </button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <ul v-if="characters.length" class="character-list">
      <li v-for="character in characters" :key="character.id">
        <img :src="character.image" alt="character image" class="character-image" />
        <div class="character-info">
          <h2>{{ character.name }}</h2>
          <p>Status: {{ character.status }}</p>
          <p>Species: {{ character.species }}</p>
          <p>Gender: {{ character.gender }}</p>
        </div>
      </li>
    </ul>
    <p v-else-if="!loading">캐릭터가 없습니다.</p>

    <!-- 페이지네이션 컨트롤 -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1 || loading">
        이전
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="changePage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages || loading"
      >
        다음
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

input,
select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  flex: 1;
  min-width: 150px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.character-list {
  list-style: none;
  padding: 0;
}

.character-list li {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  margin: 10px 0;
  padding: 15px;
  border-radius: 5px;
}

.character-image {
  width: 100px;
  height: 100px;
  margin-right: 15px;
  border-radius: 5px;
}

.character-info {
  flex: 1;
}

.error {
  color: red;
  margin: 10px 0;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.pagination button {
  padding: 8px 12px;
  background-color: #35495e;
  color: white;
  border: none;
  border-radius: 5px;
  min-width: 40px;
  cursor: pointer;
}

.pagination button.active {
  background-color: #42b983;
  font-weight: bold;
}
</style>
