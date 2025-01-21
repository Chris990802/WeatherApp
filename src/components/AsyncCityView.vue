<template>
  {{ res }}
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getCurrentWeather } from '@/api/path/weatherApi'

const router = useRoute()
console.log(router.query)
const res = await getCurrentWeather(router.params.id as string)

</script>
