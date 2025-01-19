<template>
  <Teleport to="body">
    <!--对于模态框来说，position: fixed 能够相对于浏览器窗口放置有一个条件，
    那就是不能有任何祖先元素设置了 transform、perspective 或者 filter 样式属性。
    也就是说如果我们想要用 CSS transform 为祖先节点 <div class="outer"> 设置动画，就会不小心破坏模态框的布局！
    这是我暂时知道的用teleport的原因-->
    <Transition name="modal-outer">
      <div
        v-show="visible"
        class="absolute w-full bg-black bg-opacity-50 h-screen top-0 left-0 flex justify-center px-8"
      >
        <!--这两个区分开是为了动画加载，因为v-if为按需加载，则切换时外部预加载，里面按需加载（所以才有动画）-->
        <Transition name="modal-inner">
          <div v-if="visible" class="bg-white p-4 self-start mt-32 max-w-screen-md">
            <slot />
            <button @click="$emit('close')" class="text-xl text-white bg-black mt-8 py-2 px-8 rounded-md">
              Close
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { defineProps } from 'vue'
defineEmits(['close'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
  opacity: 0;
}

.modal-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-inner-leave-to {
  transform: scale(0.8);
}
</style>
