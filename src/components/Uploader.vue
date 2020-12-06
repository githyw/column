<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary">正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary" name="uploaded">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    >
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, PropType } from 'vue'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean
export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      require: true
    },
    beforUpload: {
      type: Function as PropType<CheckFunction>
    }
  },
  emits: ['file-uploaded', 'file-upload-error'],
  inheritAttrs: false,
  setup (props, content) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>('ready')
    const uploadedData = ref()
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files)
        if (props.beforUpload) {
          const result = props.beforUpload(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        if (props.action !== undefined) {
          axios.post(props.action, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(e => {
            fileStatus.value = 'success'
            uploadedData.value = e.data
            console.log(e.data.data.url)
            content.emit('file-uploaded', e.data)
          }).catch((error) => {
            fileStatus.value = 'error'
            content.emit('file-upload-error', { error })
          }).finally(() => {
            if (fileInput.value) {
              fileInput.value.value = ''
            }
          })
        }
      }
    }
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      uploadedData,
      handleFileChange
    }
  }
})
</script>

<style scoped>
</style>
