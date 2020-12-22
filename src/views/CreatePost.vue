<template>
  <div class="create-post-page">
    <h4>{{isEditMode? '编辑文章' : '新建文章'}}</h4>
    <uploader
      action="/upload"
      :befor-upload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      :uploaded="uploadedData"
      class="d-flex justify-content-center bg-light text-secondary w-100 my-4"
    >
    <template #uploaded="dataProps">
      <img :src="dataProps.uploadedData.data.url" width="500" class="h-200">
    </template>
    <template #default>
      <h2 class="file-upload h-200">点击上传头图</h2>
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
      <div class="d-flex justify-content-center">
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large w-330">{{isEditMode? '更新文章' : '发布文章'}}</button>
      </template>
      <template #return>
        <span class="btn btn-secondary right" @click="ClickBack">返回</span>
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
import { GlobalDataProps, ImageProps, PostProps, ResponseType } from '@/store/store'
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
    const onFormSubmit = (result: boolean) => {
      if (result) {
        // 将用户id(_id) 和页面id(column)取出来
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
          }
          // 新建文章提交数据 if === createPost则提交新数据 else === updatePost则更新数据
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            id: route.query.id,
            payload: newPost
          } : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功，即将跳转到文章', 'success', 1000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 1000)
          }).catch(e => {
            console.log(e)
          })
        }
      }
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
    const ClickBack = () => {
      router.go(-1)
    }
    return {
      onFormSubmit,
      titleRules,
      contentRules,
      contentVal,
      titleVal,
      uploadedData,
      uploadCheck,
      handleFileUploaded,
      isEditMode,
      ClickBack
    }
  }
})
</script>

<style scoped>
  .right{
    margin-left: 30px;
  }
  .w-330 {
    width: 330px;
  }
  .file-upload {
    cursor: pointer;
  }
  .h-200{
    height: 200px;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
