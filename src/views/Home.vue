<template>
  <div class="Home">
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
import { testData } from '@/hooks/ColumnlProps.ts' // 调用CoulmnList里面定义的接口
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Home',
  components: {
    CoulmnList
  },
  setup () {
    return {
      list: testData
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
