<template>
  <nav class="w-690">
    <div v-if="posts.image">
      <img :src="posts.image.url" :alt="posts.title" class="w-500">
    </div>
    <h1 class="my-4">{{posts.title}}</h1>
    <div class="d-flex justify-content-between py-4 my-3 bdtb">
      <div class="d-flex align-items-stretch">
        <img :src="column[0].avatar && column[0].avatar.url" :alt="columns.avatar" class="rounded-circle rounded-lg imgborder w-25 mr-3">
        <div>
          <h3 class="mb-3">{{User.nickName}}</h3>
          <div class="text-size">{{User.description}}</div>
        </div>
      </div>
      <div class="text-size d-flex align-items-center style">发表于：{{posts.createdAt}}</div>
    </div>
    <div class="mt-4">{{posts.excerpt}}</div>
  </nav>
</template>

<script lang='ts'>
import { defineComponent, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { UserProps } from '@/store/store'
export default defineComponent({
  name: 'PostDetail',
  setup () {
    const route = useRoute()
    const store = useStore()
    const currentId = route.params.id
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    console.log('post:' + currentId)
    const posts = computed(() => store.getters.getPostById(currentId))
    console.log(posts)
    const User = store.state.user
    const column = store.state.columns
    const columns = computed(() => {
      return column.map((column: UserProps) => {
        if (!column.avatar) {
          column.avatar = {
            fitUrl: require('@/assets/column.jpg')
          }
        }
        return column
      })
    })
    console.log(User)
    console.log(column)
    return {
      posts,
      User,
      column,
      columns
    }
  }
})
</script>

<style scoped>
  .w-690 {
    width: 690px;
    margin: 0 auto;
  }
  .imgborder{
    border: 1px solid #cccccc;
    width: 100%;
  }
  .w-500{
    width: 100%;
  }
  .bdtb{
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
  }
  .text-size{
    color: #6c757d;
  }
  .style{
    font-style: italic;
  }
</style>
