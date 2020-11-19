<template>
  <div class="container">
      <global-header :user="currentUser"></global-header>
      <validate-form @form-submit="onFormSubmit">
        <div class="mb-3">
          <label class="form-label">邮箱地址</label>
          <validate-input
          :rules="emailRules"
          placeholder="请输入邮箱地址"
          type="text"
        />
        </div>
        <div class="mb-3">
          <label class="form-label">密码</label>
          <validate-input
          type="password"
          placeholder="请输入密码"
          />
        </div>
        <template #submit>
          <span class="btn btn-danger">btn</span>
        </template>
      </validate-form>
      <coulmn-list :list='list'></coulmn-list>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import CoulmnList from '@/components/CoulmnList.vue'
import testData from '@/hooks/ColumnlProps.ts' // 调用CoulmnList里面定义的接口

import GlobalHeader from '@/components/GlobalHeader.vue'
import currentUser from '@/hooks/userProps.ts' // 调用GlobalHeader 里面定义的接口

import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'

export default defineComponent({
  name: 'App',
  components: {
    CoulmnList,
    GlobalHeader,
    ValidateInput,
    ValidateForm
  },
  // setup里面可以传入两个参数 第一个参数为props 第二个参数为context
  setup () {
    // 正则表达式邮箱验证失败时触发的提醒
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const onFormSubmit = (result: boolean) => {
      console.log(1234, result)
    }
    return {
      list: testData,
      currentUser,
      emailRules,
      onFormSubmit
    }
  }
})
</script>

<style>
</style>
