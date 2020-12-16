<template>
  <nav class="w-690">
    <modal :title="'删除文章'"
           :visible="modalIsVisible"
           @modal-on-close="modalIsVisible = false"
           @modal-on-confirm="hideAndDelete">
      <p>确定要删除这篇文章吗？</p>
    </modal>
    <div class="bgc">
      <router-link to="/home" class="bgc-a">首页 </router-link>/
      <router-link :to="`/column/${columnId}`" class="bgc-a">专栏首页 </router-link>/
      <span class="bgc-b">{{posts.title}}</span>
    </div>
    <div v-if="posts.image">
      <img :src="posts.image.url" :alt="posts.title" class="w-500">
    </div>
    <h3 class="my-4">{{posts.title}}</h3>
    <div class="py-4 my-3 bdtb">
      <div class="d-flex align-items-stretch">
        <img :src="column.avatar.url" :alt="column.title" class="rounded-circle rounded-lg imgborder mr-3">
        <div>
          <h4 class="mb-3">{{column.title}}</h4>
          <div class="text-size">{{column.description}}</div>
        </div>
      </div>
      <div class="text-size d-flex align-items-center style">发表于：{{posts.createdAt}}</div>
    </div>
    <div class="mt-4" v-html="currentHTML"></div>
    <div v-if="showEditArea" class="btn-group mt-5">
      <router-link :to="{name: 'create', query: { id: posts._id }}" class="btn btn-success">修改</router-link>
      <router-link to="javascript:;" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</router-link>
    </div>
  </nav>
</template>

<script lang='ts'>
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { UserProps, PostProps, ImageProps, ResponseType } from '@/store/store'
import MarkdownIt from 'markdown-it'
import Modal from '@/components/Modal.vue'
import createMessage from '@/hooks/createMessage'
export default defineComponent({
  name: 'PostDetail',
  components: {
    Modal
  },
  setup () {
    const route = useRoute()
    const store = useStore()
    const router = useRouter()
    const md = new MarkdownIt()
    const currentId = route.params.id
    const modalIsVisible = ref(false)
    const User = computed(() => store.state.user)
    console.log(User)
    onMounted(() => {
      store.dispatch('fetchPost', currentId).then(e => {
        console.log(e)
        console.log(111)
        console.log(currentId)
      }).catch(e => console.log('2:' + e))
    })
    const posts = computed(() => store.getters.getPostById(currentId))
    const currentHTML = computed(() => {
      const { content, isHTML } = posts.value
      if (posts.value && posts.value.excerpt) {
        return isHTML ? content : md.render(posts.value.excerpt)
      }
    })
    const column = computed(() => store.getters.getColumnById(posts.value.column))
    const columnId = column.value._id
    console.log(column)
    console.log('post:' + currentId)
    console.log('posts:' + posts.value)
    console.log(posts)
    const currentImageUrl = computed(() => {
      if (posts.value && posts.value.image) {
        const { image } = posts.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    console.log(currentImageUrl)
    const showEditArea = computed(() => {
      const { isLogin, _id } = User.value
      if (posts.value && posts.value.author && isLogin) {
        const postAuthor = posts.value.author._id as UserProps
        return postAuthor === _id
      } else {
        return false
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: ResponseType<PostProps>) => {
        createMessage('删除成功，即将跳转专栏首页', 'success', 1000)
        setTimeout(() => {
          if (rawData.data.column !== undefined) {
            router.push({ name: 'column', params: { id: rawData.data.column } })
          }
        }, 1000)
      })
    }
    console.log(showEditArea.value)
    console.log(User)
    return {
      posts,
      User,
      currentHTML,
      showEditArea,
      column,
      currentImageUrl,
      modalIsVisible,
      hideAndDelete,
      columnId
    }
  }
})
</script>

<style scoped>
  .bgc{
    background-color: #ededed;
    padding: 10px 10px;
    margin-bottom: 10px;
  }
  .bgc-a{
    text-decoration: none;
    color: black;
  }
  .bgc-a:hover{
    color: red;
  }
  .bgc-b{
    color: #cccccc;
  }
  .w-690 {
    width: 690px;
    margin: 0 auto;
  }
  .imgborder{
    border: 1px solid #cccccc;
    width: 10%;
    height: 10%;
  }
  .w-500{
    width: 100%;
  }
  .bdtb{
    overflow: hidden;
    *zoom: 1;
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
  }
  .text-size{
    color: #6c757d;
  }
  .style{
    float: right;
    margin-right: 5px;
    margin-top: 20px;
    font-style: italic;
  }
</style>
