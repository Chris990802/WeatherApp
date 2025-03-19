<template>
  <div>
    <Suspense>
      <AsyncCityView />

      <template #fallback>
        <div
          style="
            width: 100vw;
            height: 91vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
        >
          <a-spin :indicator="indicator" class="mb-6 flex flex-col" />
          <!-- <br /> -->
          <span class="text-8x text-white">加载中...</span>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import AsyncCityView from '@/components/AsyncCityView.vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '64px',
    color: 'white',
    fontWeight: 'bolder',
  },
  spin: true,
})
</script>

<style scoped>
/* 自定义骨架线组件样式 */
.a-skeleton-line {
  @apply bg-gray-400 bg-opacity-20;
  height: 1px;
}

/* 骨架动画优化 */
:deep(.ant-skeleton-content .ant-skeleton-title),
:deep(.ant-skeleton-content .ant-skeleton-paragraph li) {
  @apply bg-gray-400 bg-opacity-20;
}
</style>
