<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul>
          <li class="list-inline-item">₢ 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import currentUser from '@/hooks/userProps.ts' // 调用GlobalHeader 里面定义的接口

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader
  },
  // setup里面可以传入两个参数 第一个参数为props 第二个参数为context
  setup () {
    return {
      currentUser
    }
  }
})
</script>

<style>
</style>
