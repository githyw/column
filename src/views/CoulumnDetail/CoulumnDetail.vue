<template>
  <div class="column-detail-page w-75 mx-auto container element">
    <div class="bgc">
      <router-link to="/" class="bgc-a">首页</router-link> /
      <span class="bgc-b">首页专栏</span>
    </div>
    <div class="row pb-5 shadow-sm p-3 mb-5 bg-white rounded border">
      <div class="col-3">
        <img style="user-select: none;"
             :src="column.value.avatar && column.value.avatar.fitUrl"
             :alt="column.title"
             class=" rounded-circle rounded-lg imgborder w-100">
      </div>
      <div class="mt-3 col-9">
        <h4>{{column.value.title}}</h4>
        <p>{{column.value.description}}</p>
      </div>
    </div>
    <posh-list :list="list" style="user-select: none;"></posh-list>
    <button class="btn btn-outline-primary my-2 mb-5 btn-block w-25 mx-auto d-flex justify-content-center" @click="loadMorePage" v-if="islastPage">加载更多</button>
    <router-link to="/" class="toHomeImage" v-if="show">
      <div>
        <img src="@/assets/Home.png" alt="">
      </div>
      <div class="logoToHomeImage"/>
    </router-link>
    <div class="toTopImage" v-if="show" @click="clickImage">
      <div>
        <img src="@/assets/top.png" alt="">
      </div>
      <div class="logoToTopImage"/>
    </div>
  </div>
</template>

<script lang='ts'>
// 单页面数据的 title
import { defineComponent, computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import PoshList from './PoshList.vue'
import { useRoute, useRouter } from 'vue-router'
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
    const router = useRouter()
    const currentId = route.params.id
    const total = computed(() => store.state.posts.total)
    const currentPage = computed(() => store.state.posts.currentPage)
    const islastPage = computed(() => store.state.posts.islastPage)
    const selectColumn = ref()
    const scrollTop = ref()
    const show = ref(false)
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', { cid: currentId })
      window.addEventListener('scroll', () => {
        scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop.value > 700) {
          show.value = true
        } else {
          show.value = false
        }
      }, true)
    })
    // 点击返回顶部
    const clickImage = () => {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    }
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
      islastPage,
      show,
      clickImage
    }
  }
})
</script>

<style scoped>
  .bgc{
    background-color: #f0f0e3;
    padding: 10px 10px;
    margin-bottom: 10px;
    border-radius: 10px;
  }
  .border{
    border-radius: 20px!important;
    background-color: #f0f0e3 !important;
  }
  .bgc-a{
    text-decoration: none;
    color: black;
  }
  .bgc-a:hover{
    color: #0d6efd;
  }
  .bgc-b{
    color: #cccccc;
  }
  .imgborder{
    border: 1px solid #cccccc;
    width: 100%;
  }
  .toTopImage, .logoToTopImage{
    bottom: 30px;
  }
  .toHomeImage, .logoToHomeImage{
    bottom: 80px;
  }
  .toTopImage, .logoToTopImage, .toHomeImage, .logoToHomeImage{
    position: fixed;
    right: 40px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 50%;
    padding: 6px;
    user-select: none;
  }
  .logoToTopImage, .logoToHomeImage{
    border-bottom: 2px solid #0d6efd;
    animation: rotate 3s infinite linear;
  }
  .logoToTopImage:hover, .logoToHomeImage:hover{
    border: 2px solid #0d6efd;
  }
  .toTopImage img, .toHomeImage img{
    width: 100%;
  }
  @keyframes rotate {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(360deg);
    }
  }
</style>
