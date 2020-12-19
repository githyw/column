<template>
  <div class="login-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册页面</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="formData.email"
          placeholder="请输入邮箱地址"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
          :rules="nickName"
          type="text"
          placeholder="请输入昵称"
          ref="inputRefpwd"
          v-model="formData.nickName"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          :rules="passwordRules"
          type="password"
          placeholder="请输入密码"
          ref="inputRefpwd"
          v-model="formData.password"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          :rules="passwordReuse"
          type="password"
          placeholder="请再次输入密码"
          ref="inputRefpwd"
          v-model="formData.repeatPassword"
        />
        <div class="form-text w-330">
          <router-link to="/login">已经有账户了? 去登录</router-link>
        </div>
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large bes">注册</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue'
import axios from 'axios'
import createMessage from '@/hooks/createMessage'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'Signup',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const router = useRouter()
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })
    const emailRules: RulesProp = [
      { type: 'required', message: '邮箱不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nickName: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'password', message: '密码不能小于6位数，不能含有空格' }
    ]
    const passwordReuse: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'password', message: '密码不能小于6位数，不能含有空格' },
      {
        type: 'reuse',
        validator: () => {
          return formData.repeatPassword === formData.password
        },
        message: '密码不一致,请重新输入'
      }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          password: formData.password,
          nickName: formData.nickName
        }
        // 注册账号并跳转登录页面
        axios.post('/users/', payload).then(() => {
          createMessage('注册成功 即将跳转登录页面', 'success', 1000)
          setTimeout(() => {
            router.push('/login')
          }, 1000)
        }).catch(e => {
          console.log(e)
          if (e.code === 400) {
            createMessage(e.error, 'error', 1000)
          } else if (e.code === 500) {
            createMessage('注册成功,即将跳转登录页面,500', 'success', 1500)
            setTimeout(() => {
              router.push('/login')
            }, 1500)
          }
        })
      }
    }
    return {
      onFormSubmit,
      emailRules,
      nickName,
      passwordRules,
      passwordReuse,
      formData
    }
  }
})
</script>

<style scoped>
  .w-330 {
    width: 330px;
  }
  .bes{
    width: 100%;
  }
</style>
