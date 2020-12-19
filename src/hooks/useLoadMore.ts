import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

interface LoadParms {
  currentPage: number;
  pageSize: number;
}
// 负责控制加载页面的页数也数量
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParms = { currentPage: 2, pageSize: 5 }, cid?: string) => {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize,
    cid: cid
  }))
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
  const islastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) <= currentPage.value
  })
  return {
    islastPage,
    loadMorePage,
    currentPage
  }
}
export default useLoadMore
