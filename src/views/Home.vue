<template>
  <div class="Home">
    <div class="d-flex align-items-center flex-column mbottom">
      <img src="@/assets/shouyeer.svg" alt="" class="w-25 pt-5 ">
      <div class="text">随心写作，自由表达</div>
      <router-link class="btn btn-primary mt-4" to="/create">开始写文章</router-link>
    </div>
    <h4 class="d-flex justify-content-center">发现精彩</h4>
    <coulmn-list :list='list'></coulmn-list>
  </div>
  <button class="btn btn-outline-primary my-2 mb-5 btn-block w-25 mx-auto d-flex justify-content-center" @click="loadMorePage" v-if="!islastPage">加载更多</button>
</template>

<script lang='ts'>
import CoulmnList from '@/components/CoulmnList.vue'
import { defineComponent, computed, onMounted } from 'vue'
import useLoadMore from '@/hooks/useLoadMore'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/store'
export default defineComponent({
  name: 'Home',
  components: {
    CoulmnList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentPage = computed(() => store.state.columns.currentPage)
    const total = computed(() => store.state.columns.total)
    onMounted(() => {
      store.dispatch('fetchColumns', { pageSize: 3 })
    })
    const list = computed(() => store.getters.getColumns)
    const { loadMorePage, islastPage } = useLoadMore('fetchColumns', total, { currentPage: (currentPage.value ? currentPage.value + 1 : 2), pageSize: 3 })
    return {
      list,
      loadMorePage,
      islastPage
    }
  }
})
</script>

<style scoped>
  .text{
    font-size: 35px;
  }
  .mbottom{
    margin-bottom: 100px;
  }
</style>
