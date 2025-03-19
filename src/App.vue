<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import SiteNavigation from './components/SiteNavigation.vue'
import { ref, computed } from 'vue'

const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <div
    class="flex flex-col justify-center items-center min-h-screen font-Robot"
    :class="isHome ? '-translate-y-28' : ''"
  >
    <!-- <video
      autoplay
      loop
      muted
      playsinline
      class="absolute inset-0 z-0 w-full h-full object-cover opacity-50"
      :class="isHome ? 'translate-y-28' : ''"
    >
      <source src="@/assets/image/rainy.mp4" type="video/mp4" />
    </video> -->

    <SiteNavigation />
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.flex {
  transition: justify-content 0.3s ease;
}

.translate {
}
</style>
