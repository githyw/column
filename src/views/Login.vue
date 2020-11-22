<template>
  <div class="Login">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
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
        />
      </div>
    </validate-form>
  </div>
</template>

<script lang='ts'>
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { useRouter } from 'vue-router'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
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
    const onFormSubmit = (result: boolean) => {
      if (!result) {
        const pwdFalse = inputRefpwd.value.validateInput() === false
        const emailFalse = inputRef.value.validateInput() === false
        if ((emailFalse && pwdFalse) || emailFalse) {
          inputRefpwd.value.inputRef.val = ''
          inputRef.value.inputRef.val = ''
        } else if (pwdFalse) {
          inputRefpwd.value.inputRef.val = ''
        }
      } else {
        router.push({ name: 'Coulumn', params: { id: 1 } })
      }
    }
    return {
      emailRules,
      passwordRules,
      onFormSubmit,
      inputRef,
      inputRefpwd
    }
  }
})
</script>

<style scoped>
</style>
