<template>
  <div class="Login">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          :rules="passwordRules"
          type="password"
          placeholder="请输入密码"
          ref="inputRefpwd"
          v-model="passwordVal"
        />
      </div>
    </validate-form>
  </div>
</template>

<script lang='ts'>
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const emailVal = ref('')
    const passwordVal = ref('')
    const store = useStore()
    const router = useRouter()
    const inputRef = ref()
    const inputRefpwd = ref()
    // 正则表达式邮箱验证失败时触发的提醒
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'password', message: '密码不能小于6位数' }
    ]
    // 通过ValidataForm.vue发送出来的数据进行处理
    const onFormSubmit = (result: boolean) => {
      // 如果为flase 那么清空表单
      // 如果为true 那么路由跳转到首页，并且登录状态改为true
      if (!result) {
        const pwdFalse = inputRefpwd.value.validateInput() === false
        const emailFalse = inputRef.value.validateInput() === false
        // 如果邮箱和密码都为flase 那么清空所有input表单，或者邮箱为flase 那么也清空表单
        // 如果密码为flase 那么只清空密码的input表单
        if ((emailFalse && pwdFalse) || emailFalse) {
          inputRefpwd.value.inputRef.val = ''
          inputRef.value.inputRef.val = ''
        } else if (pwdFalse) {
          inputRefpwd.value.inputRef.val = ''
        }
      } else {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        store.dispatch('loginAndFetch', payload).then(data => {
          console.log(data)
          router.push('/')
        }).catch(e => {
          console.log(e)
        })
      }
    }
    return {
      emailRules,
      passwordRules,
      onFormSubmit,
      inputRef,
      inputRefpwd,
      emailVal,
      passwordVal
    }
  }
})
</script>

<style scoped>
</style>
