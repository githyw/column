import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

interface LoadParms {
  currentPage: number;
  pageSize: number;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParms = { currentPage: 2, pageSize: 5 }) => {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize
  }))
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
  const islastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    islastPage,
    loadMorePage,
    currentPage
  }
}
export default useLoadMore
