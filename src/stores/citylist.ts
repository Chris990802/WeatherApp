import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { uid } from 'uid'

type city = {
  id: string
  cityId: string
}

export const useCityListStore = defineStore('citylist', () => {
  const localStorageCity = ref<city[]>([])
  if (localStorage.getItem('savedCities')) {
    localStorageCity.value = JSON.parse(localStorage.getItem('savedCities') as string)
  }

  const cityList = ref<string[]>([])

  //查看当前城市是否存在于收藏列表中
  const isExist = computed(() => (id: string) => cityList.value.some((item) => item === id))

  function addCity(id: string) {
    console.log(id)
    if (!isExist.value(id)) {
      cityList.value.push(id)
      console.log('添加2')
      //同步到localStorage
      const obj = {
        id: uid(),
        cityId: id,
      }

      //状态商店和localStorage都要更新
      localStorageCity.value.push(obj)
      console.log(localStorageCity.value)
      localStorage.setItem('savedCities', JSON.stringify(localStorageCity.value))
    }
  }

  function removeCity(city: string) {
    const index = cityList.value.indexOf(city)
    if (index !== -1) {
      cityList.value.splice(index, 1)

      //localStorage也要删除
      const localStorageIndex = localStorageCity.value.findIndex((item) => item.cityId === city)
      localStorageCity.value.splice(localStorageIndex, 1)
      localStorage.setItem('savedCities', JSON.stringify(localStorageCity.value))
    }
  }

  return { cityList, isExist, addCity, removeCity }
})
