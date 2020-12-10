<template>
  <global-header :user="currentUser"></global-header>
  <div class="container">
    <loader text="加载中..." v-if="isLoading"></loader>
    <router-view></router-view>
  </div>
  <footer class="text-center py-4 text-secondary bg-light mt-auto">
    <small class="list-inline mb-0">
      <ul>
        <li class="list-inline-item">₢ 2020 者也专栏</li>
        <li class="list-inline-item">课程</li>
        <li class="list-inline-item">文档</li>
        <li class="list-inline-item">联系</li>
        <li class="list-inline-item">更多</li>
      </ul>
    </small>
  </footer>
</template>
<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import Loader from '@/components/Loader.vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store/store'
import createMessage from '@/hooks/createMessage'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  // setup里面可以传入两个参数 第一个参数为props 第二个参数为context
  setup () {
    const store = useStore<GlobalDataProps>()
    const isLoading = computed(() => store.state.Loading)
    const currentUser = computed(() => store.state.user)
    const error = computed(() => store.state.error)
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error', 2000)
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style>
</style>
