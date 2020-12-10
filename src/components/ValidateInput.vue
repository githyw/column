<template>
  <div class="validate-input-container pb-3 position-relative">
    <input
    v-bind="$attrs"
    v-if="tag !== 'textarea'"
    class="form-control"
    :class="{'is-invalid': inputRef.error}"
    :value="inputRef.val"
    @blur="validateInput"
    v-model="inputRef.val"
    />
    <textarea
      v-else
      v-bind="$attrs"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
    />
    <span v-if="inputRef.error" class="invalid-feedback position-absolute mt-1">{{inputRef.message}}</span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, PropType, onMounted, watch, computed } from 'vue'
import { emitter } from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const pwd = /[\d\w\S]{6}/
// 定义接口规则
export interface RuleProp {
  type: 'required' | 'email' | 'password' | 'title' | 'content' | 'reuse';
  message: string;
  validator?: () => boolean;
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  name: 'ValidateInput',
  props: {
    // 接收的参数使用类型断 言、类型断言使用上面定义的接口规则
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup (props, context) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          context.emit('update:modelValue', val)
        }
      }),
      // 控制span标签是否显示
      error: false,
      message: ''
    })
    const validateInput = () => {
      // 判断是否有rules
      if (props.rules) {
        // 如果有值 则使用every()检查数组，passed的值返回给allPassed
        const allPassed = props.rules.every(rule => {
          let passed = true
          // 哪个type值为false 就将那个message的值赋值给inputRef.message，如果所有判断都为true 那么将不再赋值
          inputRef.message = rule.message
          // 使用switch循环rule.type，判断结果是否为true,然后赋值给passed
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              // 如果为true，那么继续向下判断；为false，则直接跳出循环
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              // 如果为true，那么向下执行，为false，那么跳出循环
              break
            case 'password':
              passed = pwd.test(inputRef.val)
              break
            case 'title':
              passed = (inputRef.val.trim() !== '')
              break
            case 'content':
              passed = (inputRef.val.trim() !== '')
              break
            case 'reuse':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              // 默认passed为true ,结束
              break
          }
          // 将passed 获取到的布尔值return出去
          return passed
        })
        // 将收到的值取反之后赋值给inputRef.error，从而判断是否显示span标签
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      // 将函数发送到ValidataForm.vue中
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput
    }
  }
})
</script>

<style scoped>

</style>
