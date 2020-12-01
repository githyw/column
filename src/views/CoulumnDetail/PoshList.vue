<template>
  <div class="post-list">
    <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4>{{post.title}}</h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-4">
            <img :src="post.image.url" :alt="post.title" class="rounded-lg w-100">
          </div>
          <p :class="{'col-8': post.image}" class="text-muted">{{post.excerpt}}</p>
        </div>
        <span class="text-muted">{{post.createdAt}}</span>
      </div>
    </article>
  </div>
</template>

<script lang='ts'>
// 单页面数据的List
import { PostProps } from '../../store/store'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'PoshList',
  props: {
    list: {
      request: true,
      type: Array as PropType<PostProps[]>
    }
  }
})
</script>

<style scoped>
</style>
