<template>
  <teleport to="#message">
    <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between"
    :class="classObject"
    v-if="isVisible"
    >
      <span>{{message}}</span>
      <button type="button" class="btn-close" aria-label="Close" @click.prevent="hide"></button>
    </div>
  </teleport>
</template>

<script lang='ts'>
import { defineComponent, ref, PropType } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'
export type MessageType = 'success' | 'error' | 'default'
export default defineComponent({
  name: 'Message',
  props: {
    message: String,
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  setup (props, content) {
    // 创建DOM节点
    useDOMCreate('message')
    const isVisible = ref(true)
    const classObject = {
      'alert alert-success': props.type === 'success',
      'alert alert-danger': props.type === 'error',
      'alert alert-primary': props.type === 'default'
    }
    const hide = () => {
      isVisible.value = false
      content.emit('close-message', true)
    }
    return {
      classObject,
      isVisible,
      hide
    }
  }
})
</script>

<style scoped>
</style>
