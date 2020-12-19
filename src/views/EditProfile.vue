<template>
  <div class="w-690">
    <ul class="nav nav-tabs my-4">
      <li class="nav-item">
        <a href="#"
           :class="generateActiveClass('profile')"
           @click.prevent="switchTab('profile')"
        >
          更新个人资料
        </a>
      </li>
      <li>
        <a href="#"
           :class="generateActiveClass('column')"
           @click.prevent="switchTab('column')"
        >
          更新专栏信息
        </a>
      </li>
    </ul>
    <h3>编辑个人资料</h3>
    <uploader
      action="/upload"
      class="d-flex justify-content-center bg-light text-secondary w-100 my-4"
      :beforeUpload="commonUploadCheck"
      :uploaded="uploadedData"
      @file-uploaded="onFileUploaded"
    >
      <template #default>
        <h2 class="file-upload h-200">点击上传头像</h2>
      </template>
      <template #uploaded="dataProps">
        <div>
          <img :src="dataProps.uploadedData.data.url" class="border h-200">
        </div>
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <validate-input
        placeholder="请输入名称"
        :rules="nameRules"
        v-model="nameValue"
        type="text"
      />
      <validate-input
        :rules="descRules"
        tag="textarea"
        placeholder="请输入简介信息"
        rows="5"
        v-model="descValue"
      />
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large w-330">提交修改</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { useStore } from 'vuex'
import { ImageProps, ResponseType } from '@/store/store'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import Uploader from '@/components/Uploader.vue'
import createMessage from '@/hooks/createMessage'
import { useRouter } from 'vue-router'
import { commonUploadCheck } from '@/hooks/helper'
type EditCategory = 'profile' | 'column' | 'init'
export default defineComponent({
  name: 'EditProfile',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    // 通过value的值判断获取user还是column的图片的url
    const currentCategory = ref<EditCategory>('init')
    const generateActiveClass = (klass: EditCategory) => {
      return {
        active: currentCategory.value === klass,
        'nav-link': true
      }
    }
    const userStore = computed(() => store.state.user)
    const uploadedData = ref()
    const currentColumn = computed(() => store.getters.getColumnById(userStore.value.column))
    // 监控currentCategory,值发生改变则调用第二个函数
    watch(currentCategory, () => {
      if (currentCategory.value === 'profile') {
        if (userStore.value && userStore.value.avatar) {
          const { avatar } = userStore.value
          // 将user的图片和id赋值给uploadedData
          uploadedData.value = { data: avatar }
        }
      } else {
        if (currentColumn.value && currentColumn.value.avatar) {
          const { avatar } = currentColumn.value
          // 将column的图片和id赋值给uploadedData
          uploadedData.value = { data: avatar }
        } else {
          uploadedData.value = null
        }
      }
    })
    // 以下操作和上述一样
    const nameValue = ref(userStore.value && userStore.value.nickName)
    const descValue = ref(userStore.value && userStore.value.description)
    const switchTab = (which: EditCategory) => {
      currentCategory.value = which
      if (which === 'column' && currentColumn.value) {
        const { title, description } = currentColumn.value
        nameValue.value = title
        descValue.value = description
      } else {
        const { nickName, description } = userStore.value
        nameValue.value = nickName
        descValue.value = description
      }
    }
    onMounted(() => {
      currentCategory.value = 'profile'
      const cid = userStore.value.column
      if (cid) {
        store.dispatch('fetchColumn', cid)
      }
    })
    let imageId = ''
    const nameRules: RulesProp = [
      { type: 'required', message: '输入不能为空' }
    ]
    const descRules: RulesProp = [
      { type: 'required', message: '输入不能为空' }
    ]
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        let payload: any = {}
        if (currentCategory.value === 'profile') {
          payload = {
            _id: userStore.value._id,
            nickName: nameValue.value,
            description: descValue.value
          }
        } else {
          payload = {
            _id: currentColumn.value._id,
            title: nameValue.value,
            description: descValue.value
          }
        }
        if (imageId) {
          payload.avatar = imageId
        }
        // 三元表达式 判断currentCategory的值是否为profile 为true则执行updateUser 为false则执行updateColumn
        const actionName = currentCategory.value === 'profile' ? 'updateUser' : 'updateColumn'
        const sendData = currentCategory.value === 'profile' ? {
          id: userStore.value._id,
          payload
        } : {
          id: currentColumn.value._id,
          payload
        }
        store.dispatch(actionName, sendData).then(() => {
          createMessage('修改成功，即将跳转到首页', 'success', 1000)
          setTimeout(() => {
            router.push('/')
          }, 1000)
        })
      }
    }
    return {
      nameRules,
      descRules,
      nameValue,
      descValue,
      onFileUploaded,
      commonUploadCheck,
      onFormSubmit,
      generateActiveClass,
      switchTab,
      uploadedData
    }
  }
})
</script>

<style scoped>
  .w-690{
    width: 690px;
    margin: 0 auto;
  }
  .border{
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
  }
  .h-200{
    height: 200px;
    line-height: 200px;
    cursor:pointer;
  }
  .h-400{
    height: 400px;
  }
</style>
