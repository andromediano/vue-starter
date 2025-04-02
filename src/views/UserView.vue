<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'
import axios from 'axios'

// GitHub 사용자 인터페이스 정의
interface GitHubUser {
  id: number
  login: string
  html_url: string
  avatar_url: string
}

// 라우터와 라우트 사용
const router = useRouter()
const route = useRoute()

// Pinia 스토어 사용
const searchStore = useSearchStore()

// 반응형 변수 선언
const users = ref<GitHubUser[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const perPage = ref<number>(10)

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

// GitHub 사용자 검색 함수
const fetchUsers = async () => {
  if (!searchStore.searchQuery.trim()) {
    error.value = '검색어를 입력해주세요.'
    users.value = []
    totalPages.value = 0
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await axios.get('https://api.github.com/search/users', {
      params: {
        q: searchStore.searchQuery,
        page: currentPage.value,
        per_page: perPage.value,
      },
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })
    users.value = response.data.items
    const totalCount = response.data.total_count
    totalPages.value = Math.ceil(totalCount / perPage.value)

    // URL 업데이트 (페이지 번호만)
    router.push({
      query: {
        page: currentPage.value.toString(),
      },
    })
  } catch (err) {
    error.value =
      '사용자를 가져오는 중 오류가 발생했습니다: ' +
      (err instanceof Error ? err.message : String(err))
    users.value = []
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

// 페이지 변경 함수
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchUsers()
  }
}

// 라우트 변경 감지 및 초기화
watch(
  () => route.query.page,
  (newPage) => {
    const pageFromUrl = parseInt((newPage as string) || '1', 10)
    if (!isNaN(pageFromUrl) && pageFromUrl >= 1) {
      currentPage.value = pageFromUrl
      if (searchStore.searchQuery) fetchUsers()
    }
  },
  { immediate: true },
)

// 검색어 변경 감지
watch(
  () => searchStore.searchQuery,
  () => {
    currentPage.value = 1 // 검색어가 바뀌면 첫 페이지로 리셋
    fetchUsers()
  },
)
</script>

<template>
  <div class="container">
    <h1>GitHub 사용자 검색</h1>

    <!-- 검색 입력 -->
    <div class="search-container">
      <input
        v-model="searchStore.searchQuery"
        @keyup.enter="fetchUsers"
        placeholder="GitHub 사용자 검색 (예: octocat)"
        type="text"
      />
      <button @click="fetchUsers" :disabled="loading">
        {{ loading ? '로딩 중...' : '검색' }}
      </button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <ul v-if="users.length" class="user-list">
      <li v-for="user in users" :key="user.id">
        <h2>{{ user.login }}</h2>
        <p>{{ user.html_url }}</p>
      </li>
    </ul>
    <p v-else-if="!loading">사용자가 없습니다.</p>

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
}

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  flex-grow: 1;
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

.user-list {
  list-style: none;
  padding: 0;
}

.user-list li {
  border: 1px solid #ddd;
  margin: 10px 0;
  padding: 15px;
  border-radius: 5px;
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
  min-width: 40px;
}

.pagination button.active {
  background-color: #42b983;
  font-weight: bold;
}
</style>
