<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">首页</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <dropdown :title='`你好 ${user.nickName}`'>
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
import { defineComponent, PropType, computed } from 'vue'
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
  setup (props) {
    const store = useStore()
    console.log(props.user)
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

</style>
