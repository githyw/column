<template>
  <div class="dropdown" ref="dropdownRef">
    <div class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
      <img :src="url" alt="" class="border">
      <span>{{title}}</span>
    </div>
    <ul class="dropdown-menu dropdown-menu-lg-right width" :style="{display: 'block'}" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'
export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String
    }
  },
  setup () {
    const isOpen = ref(false)
    const dropdownRef = ref<null | HTMLElement>(null)
    // 控制用户展开栏是否隐藏或显示
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    const isClickOutside = useClickOutside(dropdownRef)
    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false
      }
    })
    return {
      isOpen,
      toggleOpen,
      dropdownRef
    }
  }
})
</script>

<style scoped>
.border{
  width: 25px;
  height: 25px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}
  .dropdown-menu{
    min-width: 8rem;
  }
</style>
