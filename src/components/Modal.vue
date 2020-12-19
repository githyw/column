<template>
<teleport to="#modal">
  <div class="modal d-block" tabindex="-1" role="dialog" v-if="visible">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{title}}</h5>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="onConfirm">确认</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="onClose">取消</button>
        </div>
      </div>
    </div>
  </div>
</teleport>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'
export default defineComponent({
  name: 'Modal',
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['modal-on-close', 'modal-on-confirm'],
  setup (props, content) {
    useDOMCreate('modal')
    // 点击取消按钮 发送事件
    const onClose = () => {
      content.emit('modal-on-close')
    }
    // 点击确定按钮 发送事件
    const onConfirm = () => {
      content.emit('modal-on-confirm')
    }
    return {
      onClose,
      onConfirm
    }
  }
})
</script>

<style scoped>
</style>
