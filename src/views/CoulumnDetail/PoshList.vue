<template>
  <div class="post-list">
    <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm animation">
      <router-link :to="`/posts/${post._id}`" class="card-body tdn">
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
    text-decoration: none;
    color: black;
    border-radius: 20px;
    animation: untdn 1s forwards;
  }
  .tdn:hover{
    animation: tdn 1s forwards;
  }
  .animation{
    animation: unball .3s;
    border-radius: 20px;
  }
  .animation:hover{
    animation: ball 1s forwards;
  }
  @keyframes tdn {
    0%{}
    100%{
      box-shadow: 0px 7px 10px rgba(0,0,0,.2);
    }
  }
  @keyframes untdn {
    0%{
      box-shadow: 0px 7px 10px rgba(0,0,0,.2);
    }
    100%{}
  }
  @keyframes ball {
    0% {
    }
    100% {
      margin: 3px;
      background-color: #e8f0f3;
    }
  }
  @keyframes unball {
    0% {
      margin: 3px;
      background-color: #e8f0f3;
    }
    70%{
      border: 1px solid #a8c7fe;
    }
    100% {
    }
  }
</style>
