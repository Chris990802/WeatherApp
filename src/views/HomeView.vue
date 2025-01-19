<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for a city or a state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFutureWeather } from '@/api/path/weatherApi'
import type { WeatherApiResponse } from '@/types/weatherTypes'


const searchQuery = ref<string>('')

onMounted(async () => {
  const res: WeatherApiResponse = await getFutureWeather('历下区', 5) as WeatherApiResponse;
  console.log('最终获取的数据', res);

  if (res.results.length) { 
    const a : string = res.results[0].location.path
    console.log('Hello from', a)
  }
})
</script>
