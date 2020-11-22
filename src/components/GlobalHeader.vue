<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">低调</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
      <li class="list-inline-item"><a href="/login" class="btn btn-outline-light my-2">注册</a></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <dropdown :title='`你好 ${user.name}`'>
          <dropdown-item><router-link href="javascript:;" class="dropdown-item">新建文章</router-link></dropdown-item>
          <dropdown-item :disabled="true"><router-link href="javascript:;" class="dropdown-item">编辑资料</router-link></dropdown-item>
          <dropdown-item><router-link href="javascript:;" class="dropdown-item">退出登录</router-link></dropdown-item>
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
// 给登录按钮定义接口后导出
export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}
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
  }
})
</script>

<style scoped>

</style>
