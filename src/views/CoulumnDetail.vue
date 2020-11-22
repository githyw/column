<template>
  <div class="column-detail-page w-75 mx-auto container">
    <div class="row pb-5 shadow-sm p-3 mb-5 bg-white rounded">
      <div class="col-3"><img :src="column.avatar" :alt="column.title" class=" rounded-circle rounded-lg imgborder"></div>
      <div class="mt-3 col-9">
        <h4>{{column.title}}</h4>
        <p>{{column.description}}</p>
      </div>
    </div>
    <posh-list :list="list"></posh-list>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { testProsts, testData } from '@/hooks/ColumnlProps.ts'
import PoshList from '@/components/PoshList.vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'CoulumnDetail',
  components: {
    PoshList
  },
  setup () {
    const route = useRoute()
    const currentId = +route.params.id
    const column = testData.find(c => c.id === currentId)
    const list = testProsts.filter(post => post.columnId === currentId)
    return {
      list,
      column
    }
  }
})
</script>

<style scoped>
  .imgborder{
    border: 1px solid #cccccc;
    width: 100%;
  }
</style>
