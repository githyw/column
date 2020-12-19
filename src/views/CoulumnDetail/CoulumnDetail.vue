<template>
  <div class="column-detail-page w-75 mx-auto container">
    <div class="bgc">
      <router-link to="/" class="bgc-a">首页</router-link> /
      <span class="bgc-b">首页专栏</span>
    </div>
    <div class="row pb-5 shadow-sm p-3 mb-5 bg-white rounded">
      <div class="col-3"><img :src="column.value.avatar && column.value.avatar.fitUrl" :alt="column.title" class=" rounded-circle rounded-lg imgborder w-100"></div>
      <div class="mt-3 col-9">
        <h4>{{column.value.title}}</h4>
        <p>{{column.value.description}}</p>
      </div>
    </div>
    <posh-list :list="list" ></posh-list>
    <button class="btn btn-outline-primary my-2 mb-5 btn-block w-25 mx-auto d-flex justify-content-center" @click="loadMorePage" v-if="islastPage">加载更多</button>
  </div>
</template>

<script lang='ts'>
// 单页面数据的 title
import { defineComponent, computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import PoshList from './PoshList.vue'
import { useRoute } from 'vue-router'
import { ColumnlProps } from '@/store/store'
import { addColumnAvatar } from '@/hooks/helper'
import useLoadMore from '@/hooks/useLoadMore'
export default defineComponent({
  name: 'CoulumnDetail',
  components: {
    PoshList
  },
  setup () {
    const route = useRoute()
    const store = useStore()
    const currentId = route.params.id
    const total = computed(() => store.state.posts.total)
    const currentPage = computed(() => store.state.posts.currentPage)
    const islastPage = computed(() => store.state.posts.islastPage)
    const selectColumn = ref()
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', { cid: currentId })
    })
    const column = computed(() => {
      selectColumn.value = store.getters.getColumnById(currentId) as ColumnlProps | undefined
      if (selectColumn.value) {
        addColumnAvatar(selectColumn.value, 100, 100)
      }
      return selectColumn
    })
    const list = computed(() => store.getters.getPortById(currentId))
    const { loadMorePage } = useLoadMore('fetchPosts', total, { currentPage: (currentPage.value ? currentPage.value + 1 : 2), pageSize: 5 }, `${currentId}`)
    return {
      list,
      column,
      loadMorePage,
      islastPage
    }
  }
})
</script>

<style scoped>
  .bgc{
    background-color: #ededed;
    padding: 10px 10px;
    margin-bottom: 10px;
  }
  .bgc-a{
    text-decoration: none;
    color: black;
  }
  .bgc-a:hover{
    color: red;
  }
  .bgc-b{
    color: #cccccc;
  }
  .imgborder{
    border: 1px solid #cccccc;
    width: 100%;
  }
</style>
