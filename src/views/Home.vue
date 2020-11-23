<template>
  <div class="Home">
    {{a}}
    <div class="d-flex align-items-center flex-column mbottom">
      <img src="@/assets/shouyeer.svg" alt="" class="w-25 pt-5 ">
      <div class="text">随心写作，自由表达</div>
      <router-link class="btn btn-primary mt-4" to="Coulumn/">开始写文章</router-link>
    </div>
    <h4 class="d-flex justify-content-center">发现精彩</h4>
    <coulmn-list :list='list'></coulmn-list>
  </div>
</template>

<script lang='ts'>
import CoulmnList from '@/components/CoulmnList.vue'
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/store'
export default defineComponent({
  name: 'Home',
  components: {
    CoulmnList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const a = computed(() => store.state.columns.filter(e => e.id > 2).length)
    const list = computed(() => store.state.columns)
    return {
      list,
      a
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
