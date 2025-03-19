<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseModal from './BaseModal.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCityListStore } from '../stores/citylist'
import { storeToRefs } from 'pinia'
import type { geoLocation } from '../types/weatherTypes'

const route = useRoute()
const cityListStore = useCityListStore()

const modalActive = ref(false)
const toggleModal = () => {
  modalActive.value = !modalActive.value
}

const { cityList, isExist } = storeToRefs(cityListStore)
const { addCity } = cityListStore

const handleClickPlus = () => {
  const cityStr = route.params.city ? decodeURIComponent(route.params.city as string) : undefined
  const currentCityId = cityStr ? (JSON.parse(cityStr) as geoLocation) : { id: '' }

  //有就return
  if (isExist.value(currentCityId.id)) {
    console.log('已经在我的收藏列表中啦！')
    alert('已经在我的收藏列表中啦！')
    return
  }

  //添加
  addCity(currentCityId.id)
}
</script>

<template>
  <div>
    <header class="sticky top-0">
      <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">
        <RouterLink :to="{ name: 'home' }">
          <div class="gap-3 flex items-center">
            <p class="text-2xl">我的天气</p>
          </div>
        </RouterLink>

        <div class="flex gap-3 flex-1 justify-end">
          <i
            @click="toggleModal"
            class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-150 cursor-pointer text-white"
          ></i>
          <i
            v-if="route.params.city"
            class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer text-white"
            @click="handleClickPlus()"
          ></i> 
        </div>

        <BaseModal :visible="modalActive" @close="toggleModal">
          <div class="text-black">
            <h1 class="text-2xl mb-1">About:</h1>
            <p class="mb-4">
              The Local Weather allows you to track the current and future weather of cities of your
              choosing.
            </p>
            <h2 class="text-2xl">How it works:</h2>
            <ol class="list-decimal list-inside mb-4">
              <li>Search for your city by entering the name into the search bar.</li>
              <li>
                Select a city within the results, this will take you to the current weather for your
                selection.
              </li>
              <li>
                Track the city by clicking on the "+" icon in the top right. This will save the city
                to view at a later time on the home page.
              </li>
            </ol>

            <h2 class="text-2xl">Removing a city</h2>
            <p>
              If you no longer wish to track a city, simply select the city within the home page. At
              the bottom of the page, there will be am option to delete the city.
            </p>
          </div>
        </BaseModal>
      </nav>
    </header>
  </div>
</template>
