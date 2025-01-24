<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        v-model="geoSearchQuery"
        @input="searchGeo"
        type="text"
        placeholder="请在这里输入想要查询的城市~"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />

      <ul
        v-if="geoSearchQuery && (geoError || geoSearchResults)"
        class="absolute bg-white text-weather-primary w-full py-2 px-1 shadow-md top-[66] rounded-md"
      >
        <p v-if="geoError && (geoError.status === 400 || geoError.status === 404)">
          输入的地点可能来自外星哦~
        </p>
        <p v-else-if="geoError">喔呦，崩溃了~ xdddddd</p>

        <template v-else>
          <li
            v-for="item in geoSearchResults"
            :key="item.id"
            class="py-2 px-2 cursor-pointer hover:text-white hover:bg-weather-primary rounded-md transition-all duration-300"
            @click="handleCitySearch(item)"
          >
            {{ item.name }}, {{ item.adm2 }}, {{ item.adm1 }}, {{ item.country }}
          </li>
        </template>
      </ul>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getGEO } from '@/api/path/weatherApi'
import type { errorObj, geoApiResponse, geoLocation } from '@/types/weatherTypes'
import { useRouter } from 'vue-router'

const router = useRouter()

const pushToCity = (city : string) => {
  router.push({
    name: 'cityView',
    params: {
      city: city 
    },
  })
}

const geoSearchQuery = ref<string>('')
const geoSearchResults = ref<geoLocation[] | null>(null)
const timer = ref<number | undefined>(undefined)
const geoError = ref<errorObj | undefined>(undefined)

const searchGeo = () => {
  clearTimeout(timer.value)
  timer.value = setTimeout(async () => {
    if (geoSearchQuery.value !== '') {
      try {
        const res: geoApiResponse = (await getGEO(geoSearchQuery.value)) as geoApiResponse
        geoError.value = undefined
        console.log('最终获取的数据', res)
        if (res.location.length) {
          const location =
            res.location[0]?.name +
            ',' +
            res.location[0]?.adm2 +
            ',' +
            res.location[0]?.adm1 +
            ',' +
            res.location[0]?.country

          geoSearchResults.value = res.location
          geoError.value = undefined
          console.log('Hello from', location)
          return
        }
      } catch (error) {
        geoError.value = error as errorObj
        console.log('Error:', geoError.value.status)
      }
    }

    //删除所有输入不再搜索
    geoSearchResults.value = null
  }, 300)
}

const handleCitySearch = (item : geoLocation) => {
  console.log('item', item)
  geoSearchResults.value = null
  pushToCity(JSON.stringify(item))
}

onMounted(async () => {})
</script>
