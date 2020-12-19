<template>
 <form class="validate-form-container">
   <slot name="default"></slot>
   <div class="d-flex justify-content-center">
     <span class="submit-area d-flex justify-content-center" @click.prevent="submitForm">
       <slot name="submit">
         <button type="submit" class="btn btn-primary w-330">提交</button>
       </slot>
     </span>
     <span>
       <slot name="return"></slot>
     </span>
   </div>
 </form>
</template>

<script lang='ts'>
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
export const emitter = mitt()
type ValidateFunc = () => boolean
export default defineComponent({
  name: 'ValidataForm',
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: ValidateFunc[] = []
    // 对接收过来的函数进行处理，传进来的都是函数
    const callback = (func?: ValidateFunc) => {
      if (func !== undefined) {
        // 将所有值push到一个新的数组中
        funcArr.push(func)
      }
    }
    const submitForm = () => {
      // 1.将funcArr的数组中的函数使用map调用返回一个布尔值的数组
      // 2.使用every测试这个数组中所有元素是否通过(true)，全部通过则返回true，只要有一个不通过则返回false
      const result = funcArr.map(func => func()).every(result => result)
      // 将测试出来的布尔值发送出去
      context.emit('form-submit', result)
    }
    // 接收ValidataInput.vue传过来的函数
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      // 结束之后清除数据
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>

<style>
</style>
