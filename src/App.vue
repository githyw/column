<template>
  <global-header :user="currentUser"></global-header>
  <div class="container">
    <loader text="加载中..." v-if="isLoading"></loader>
    <router-view></router-view>
  </div>
  <footer class="text-center py-4 text-secondary bg-light mt-auto">
    <small class="list-inline mb-0">
      <ul>
        <li>目前状态：求职中...</li>
        <li>期望职位：web前端工程师</li>
      </ul>
      <ul>
        <li class="list-inline-item">₢ 2020 博客专栏 丨</li>
        <li class="list-inline-item">豫ICP备2020033329号-1</li>
        <li class="list-inline-item">文档</li>
        <li class="list-inline-item font-size tdn" @click="contactClick">联系方式</li>
        <li class="list-inline-item"><a href="https://github.com/githyw/column" class="tdn">GitHub</a></li>
        <li class="list-inline-item">更多</li>
      </ul>
    </small>
  </footer>
  <Modal :visible="contact" title="联系方式(非诚勿扰)" @modal-on-confirm="contactClick" @modal-on-close="contactClick">
    <div class="auto">我欲寻一伯乐</div>
    <p>电话：15537751057</p>
    <p>邮箱：961406169@qq.com</p>
    <p class="noEpiboly">外包勿扰，谢谢</p>
  </Modal>
</template>
<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import Modal from '@/components/Modal.vue'
import Loader from '@/components/Loader.vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store/store'
import createMessage from '@/hooks/createMessage'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader,
    Modal
  },
  // setup里面可以传入两个参数 第一个参数为props 第二个参数为context
  setup () {
    const store = useStore<GlobalDataProps>()
    const isLoading = computed(() => store.state.Loading)
    const currentUser = computed(() => store.state.user)
    const error = computed(() => store.state.error)
    const contact = ref(false)
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error', 2000)
      }
    })
    const contactClick = () => {
      contact.value = !contact.value
    }
    return {
      currentUser,
      isLoading,
      error,
      contactClick,
      contact
    }
  }
})
</script>

<style>
  .auto{
    text-align: center;
  }
  .font-size{
    font-weight: 700;
    cursor: pointer;
  }
  li{
    list-style-type: none;
  }
  .tdn{
    text-decoration: none;
    color: #6c757d;
    font-weight: 700;
  }
  .noEpiboly{
    font-style: italic;
    font-weight: 700;
    font-size: 12px;
  }
  .tdn:hover{
    color: red;
  }
</style>
