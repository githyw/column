<template>
  <nav class="navbar navbar-dark bg-primary d-flex justify-content-between mb-4 px-4">
    <div class="d-flex justify-content-between">
      <router-link class="navbar-brand navbar-image" to="/">
        <h1 class="blogs">专栏博客</h1>
        <h1 class="blogs">keygit</h1>
        <img src="@/assets/logo.png" alt="博客" class="navImage" style="user-select: none;">
      </router-link>
      <ul class="ul-li" v-if="!user.isLogin">
        <li>测试账号:111@test.com</li>
        <li>测试密码:111111</li>
      </ul>
    </div>
    <ul v-if="!user.isLogin" class="list-inline mb-0 d-flex justify-content-between" style="user-select: none;">
      <nav class="navbar navbar-dark bg-primary" v-if="inputSearch" ref="SearchRef">
        <input class="form-control mr-sm-2" id="search"
               type="search" placeholder="搜索" aria-label="Search"
               @blur="SearchBlur"
               @keyup="searchKeyup"
               style="border-radius: 10px">
      </nav>
      <div v-else class="search-image" @click="searchClick">
        <img src="@/assets/search.png" alt="">
      </div>
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0 d-flex justify-content-between" style="user-select: none;">
      <nav class="navbar navbar-dark bg-primary" v-if="inputSearch" ref="SearchRef">
        <input class="form-control mr-sm-2"
               type="search" placeholder="搜索" aria-label="Search"
               @blur="SearchBlur"
               @keyup="searchKeyup"
               style="border-radius: 10px">
      </nav>
      <div v-else class="search-image" @click="searchClick">
        <img src="@/assets/search.png" alt="">
      </div>
      <li class="list-inline-item">
        <dropdown :title='`${user.nickName}`' :url="user.avatar && user.avatar.url">
          <dropdown-item><router-link to="/create" class="dropdown-item">新建文章</router-link></dropdown-item>
          <dropdown-item><router-link :to="`/Column/${user.column}`" class="dropdown-item">我的专栏</router-link></dropdown-item>
          <dropdown-item><router-link to="/edit" class="dropdown-item">编辑资料</router-link></dropdown-item>
          <dropdown-item><a href="javascript:;" class="dropdown-item" @click="offClick">退出登录</a></dropdown-item>
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'
import { useStore } from 'vuex'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import { UserProps } from '@/store/store'
import createMessage from '@/hooks/createMessage'
import axios from 'axios'

export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const inputSearch = ref(false)
    const store = useStore()
    const SearchRef = ref<HTMLInputElement>()
    const searchKeyup = (e: any) => {
      if (e.code === 'Enter') {
        createMessage('搜索功能暂不可用', 'error', 2000)
      }
    }
    const SearchBlur = (e: any) => {
      if (!e.target.value.trim()) {
        inputSearch.value = false
      }
    }
    const searchClick = () => {
      inputSearch.value = true
    }
    const offClick = () => {
      store.state.user.isLogin = false
      store.state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
    return {
      offClick,
      searchClick,
      inputSearch,
      SearchRef,
      SearchBlur,
      searchKeyup
    }
  }
})
</script>

<style scoped>
.ul-li li{
  list-style-type: none;
  color: #ffffff;
  text-align: left;
}
.dropdown-item:hover{
  color: #ffffff;
  background-color: #0d6efd;
}
  .dropdown-item{
    text-align: center;
  }
  .navbar-image{
    width: 40px;
    transform-style: preserve-3d;
    overflow: hidden;
  }
  .navbar-image img {
    width: 100%;
  }
  .blogs{
    position: absolute;
    left: -99999px;
    top: 0;
  }
  .navImage{
    animation: unnav 1s forwards;
  }
  .navImage:hover{
    animation: nav 1s forwards;
  }
  @keyframes nav {
    0% {
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
  @keyframes unnav {
    0% {
      transform: rotateZ(360deg);
    }
    100% {}
  }
  .search-image{
    margin-top: 12px;
    margin-right: 20px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    animation: unsearch .5s forwards;
  }
  .search-image img{
    width: 100%;
  }
  .search-image:hover{
    animation: search .5s forwards;
  }
  @keyframes search {
    0%{
    }
    100%{
      width: 40px;
      height: 40px;
    }
  }
  @keyframes unsearch {
    0%{
      width: 40px;
      height: 40px;
    }
    100%{
    }
  }
</style>
