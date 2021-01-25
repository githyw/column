<template>
  <div class="post-list justify-content-custom">
    <article v-for="post in list" :key="post._id" class="col-5 m-2 tdn card mb-3 shadow-sm">
      <router-link :to="`/posts/${post._id}`" class="card-body" style="text-decoration:none;">
        <span class="tdn"><h4>{{post.title}}</h4></span>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-4">
            <img :src="post.image.url" :alt="post.title" class="rounded-lg w-100">
          </div>
          <p :class="{'col-8': post.image}" class="text-muted">{{post.excerpt}}</p>
        </div>
        <span class="text-muted">{{post.createdAt}}</span>
      </router-link>
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
  .tdn{
    width: 48%;
    text-decoration: none;
    color: black;
    border-radius: 20px;
    background-color: #f0f0e3;
    transition: box-shadow 1s;
  }
  .tdn:hover{
    border-left: 1px dashed #00adff;
    border-right: 1px dashed red;
    box-shadow: 0px 7px 15px 3px rgba(0,0,0,.3) !important;
    transition: box-shadow .8s, border-left 1s, border-right 1s;
  }
  .justify-content-custom{
    display: flex;
    flex-wrap: wrap;
    margin-top: calc(var(--bs-gutter-y) * -1);
    margin-right: calc(var(--bs-gutter-x)/ -2);
    margin-left: calc(var(--bs-gutter-x)/ -2);
    justify-content:  space-between!important;
  }
</style>
