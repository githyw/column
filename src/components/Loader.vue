<template>
  <teleport to="#back">
    <div class="d-flex justify-content-center align-items-center h-100 loading-container"
      :style="{backgroundColor:background || ''}"
    >
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status"></div>
        <div v-if="text" class="text-primary small">{{text}}</div>
      </div>
    </div>
  </teleport>
</template>

<script lang='ts'>
import useDOMCreate from '@/hooks/useDOMCreate'
import { defineComponent, onUnmounted } from 'vue'
export default defineComponent({
  name: 'Loader',
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup () {
    // 创建DOM节点
    useDOMCreate('back')
  }
})
</script>

<style>
  .loading-container {
    background: rgba(255,255,255,.5);
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .loading-container {
    text-align: center;
  }
</style>
