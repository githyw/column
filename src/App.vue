<template>
  <div class="container">
      <global-header :user="currentUser"></global-header>
      <coulmn-list :list='list'></coulmn-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CoulmnList, { ColumnlProps } from '@/components/CoulmnList.vue'
import GlobalHeader, { UserProps } from '@/components/GlobalHeader.vue'
const currentUser: UserProps = {
  isLogin: true,
  name: '郝莹旺'
}
const testData: ColumnlProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 3,
    title: 'test3的专栏',
    description: '这是的tes3专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  }
]
export default defineComponent({
  name: 'App',
  components: {
    CoulmnList,
    GlobalHeader
  },
  setup () {
    return {
      list: testData,
      currentUser
    }
  }
})
</script>

<style>
</style>
