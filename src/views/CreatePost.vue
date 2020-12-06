<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <uploader
      action="/upload"
      :befor-upload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      class="d-flex justify-content-center bg-light text-secondary w-100 my-4"
    >
    <template #uploaded="dataProps">
      <img :src="dataProps.uploadedData.data.url" width="500">
    </template>
    <template #default>
      <h2 class="file-upload">点击上传头图</h2>
    </template>
    <template #loading>
      <div class="d-flex">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only"></span>
        </div>
        <h2>正在上传...</h2>
      </div>
    </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题:</label>
        <validate-input
          type="text"
          placeholder="请输入文章标题"
          :rules="titleRules"
          v-model="titleVal"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情:</label>
        <validate-input
          rows="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large w-330">提交</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue'
import ValidateForm from '@/components/ValidateForm.vue'
import Uploader from '@/components/Uploader.vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { beforeUploadCheck } from '@/hooks/helper'
import { GlobalDataProps, ImageProps, PostProps, ResponseType, UserProps } from '@/store/store'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import createMessage from '@/hooks/createMessage'
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup () {
    let imageID = ''
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const uploadedData = ref()
    const titleVal = ref('')
    const contentVal = ref('')
    const isEditMode = !!route.query.id
    const titleRules: RulesProp = [
      { type: 'title', message: '文章标题不能为空' }
    ]
    const contentRules: RulesProp = [
      { type: 'content', message: '文章详情不能为空' }
    ]
    // 获取照片id展示图片
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageID = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        // 将用户id(_id) 和页面id(column)
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageID) {
            newPost.image = imageID
            console.log(imageID)
          }
          store.dispatch('createPost', newPost).then((e) => {
            console.log(e)
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          }).catch(e => console.log(e))
        }
      }
    }
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      createMessage('图片上传成功', 'success', 2000)
      console.log(rawData)
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式！', 'error', 2000)
      }
      if (error === 'size') {
        createMessage('上传大小不能超过 1Mb!', 'error', 2000)
      }
      return passed
    }
    return {
      onFormSubmit,
      titleRules,
      contentRules,
      contentVal,
      titleVal,
      uploadedData,
      onFileUploaded,
      uploadCheck,
      handleFileUploaded
    }
  }
})
</script>

<style scoped>
  .w-330 {
    width: 330px;
  }
  .file-upload {
    cursor: pointer;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
