<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img :src="column.avatar && column.avatar.url" class="rounded-circle border-light w-25 my-3" :alt="column.avatar">
          <h5 class="card-title">{{column.title}}</h5>
          <p class="card-text text-left">{{column.description}}</p>
          <router-link :to="`/Column/${column._id}`" class="btn btn-outline-primary" ref="ColumnId">进入专栏</router-link>
        </div>
</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue'
import { ColumnlProps } from '../store/store'
import { addColumnAvatar } from '@/hooks/helper'
export default defineComponent({
  name: 'CoulmnList',
  props: {
    // 接收的参数使用类型断言、类型断言使用上面定义的接口规则
    list: {
      type: Array as PropType<ColumnlProps[]>,
      required: true
    }
  },
  setup (props) {
    const columnList = computed(() => {
      return props.list.map((column) => {
        addColumnAvatar(column, 50, 50)
        return column
      })
    })
    return {
      columnList
    }
  }
})
</script>

<style scoped>

</style>
