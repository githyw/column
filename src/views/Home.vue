<template>
  <div class="Home">
    <div class="d-flex justify-content-center"><img src="@/assets/shouye.svg" alt="" class="w-50 p-5 "></div>
    <coulmn-list :list='list'></coulmn-list>
  </div>
</template>

<script lang='ts'>
import CoulmnList from '@/components/CoulmnList.vue'
import testData from '@/hooks/ColumnlProps.ts' // 调用CoulmnList里面定义的接口
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

</style>
