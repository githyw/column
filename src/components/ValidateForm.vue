<template>
 <form class="validate-form-container">
   <slot name="default"></slot>
   <div class="submit-area" @click.prevent="submitForm">
     <slot name="submit">
       <button type="submit" class="btn btn-primary">提交</button>
     </slot>
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
    const submitForm = () => {
      const result = funcArr.map(func => func()).every(result => result)
      console.log(funcArr.map(func => func()))
      context.emit('form-submit', result)
      console.log(result)
    }
    const callback = (func?: ValidateFunc) => {
      if (func !== undefined) {
        funcArr.push(func)
        console.log(callback())
      }
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>

<style scoped>
</style>
