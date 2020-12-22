<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">博客</router-link>
    <ul class="ul-li" v-if="!user.isLogin">
      <li>测试账号:111@test.com</li>
      <li>测试密码:111111</li>
    </ul>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
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
import { defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import { UserProps } from '@/store/store'
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
    const store = useStore()
    const offClick = () => {
      store.state.user.isLogin = false
      store.state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
    return {
      offClick
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
</style>
