<template>
  <div class="flex flex-col flex-1 items-center">
    <!--banner-->
    <div
      v-if="!cityList.some((item) => item === city.id)"
      class="bg-weather-secondary text-white w-full p-4 text-center"
    > 
      <p>您正在浏览这个城市，点击'+'号加入到收藏列表</p>
    </div>

    <div v-else class="bg-weather-secondary text-white w-full p-4 text-center">
      <p>已添加到我的收藏！</p>
    </div>
    <!--weather Overview-->
    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-8">
        {{ city.country + ', ' + city.adm1 + ', ' + city.name }}
      </h1>

      <p class="text-3xl text-white mb-4">
        {{ res.now.text }}
      </p>
      <p class="text-sm mb-8">
        {{
          new Date(currentTime).toLocaleDateString('zh-cn', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })
        }}
        {{
          new Date(currentTime).toLocaleTimeString('zh-cn', {
            timeStyle: 'short',
          })
        }}
      </p>
      <!--温度-->
      <p class="text-8xl mb-8">{{ res.now.temp }}&deg;</p>
      <!--体感温度-->
      <p></p>
      <p class="capitalize text-2xl mb-8">
        体感温度
        {{ res.now.feelsLike }} &deg;
      </p>
      <i :class="`qi-${res.now.icon}-fill`" class="text-[64px]"></i>
    </div>

    <hr class="border-white border-opacity-10 border w-full" />

    <!--hourly weather-->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4 text-2xl">未来24小时天气</h2>
        <div class="flex gap-10 overflow-x-scroll">
          <div
            v-for="(item, index) in hourlyData"
            :key="index"
            class="flex flex-col gap-4 items-center"
          >
            <p class="whitespace-nowrap text-md">{{ item.fxTime }}</p>
            <!--图标-->
            <i :class="`qi-${item.icon}-fill`" class="text-[64px]"></i>
            <!--温度-->
            <p class="text-xl mb-8">{{ item.temp }}&deg;</p>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-white border-opacity-10 border w-full" />
    <!--daily weather-->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4 text-2xl">每日天气</h2>
        <div class="flex flex-col gap-10 overflow-y-scroll">
          <div
            v-for="(item, index) in dailyData"
            :key="index"
            class="flex flex-row justify-between"
          >
            <!-- 左侧：星期几 + 天气图标 -->
            <div class="flex items-center space-x-16">
              <!-- 星期几 -->
              <p class="text-lg font-medium">
                {{
                  index === 0
                    ? '今天'
                    : new Date(item.fxDate).toLocaleDateString('zh-cn', {
                        weekday: 'short', // 如 “Mon”, “Tue”...
                      })
                }}
              </p>
              <!-- 天气图标 -->
              <i :class="`qi-${item.iconDay}-fill`" class="text-[36px]"></i>
            </div>

            <!-- 右侧：最低温、温度条、最高温 -->
            <!-- 这里演示固定长度的条，你也可以根据温度范围动态计算其宽度 -->
            <div class="flex items-center space-x-2 w-1/2">
              <!-- 最低温 -->
              <span class="text-xl">{{ item.tempMin }}°</span>

              <!-- 外层灰色条 -->
              <div class="relative flex-1 h-2 bg-gray-400 rounded">
                <!-- 内层蓝色条：此处仅作示例，假设占 50% 宽度 -->
                <!-- 如果要根据 (tempMax - tempMin) 动态计算，请看下方“可选进阶：动态宽度” -->
                <div
                  class="absolute h-2 bg-blue-500 rounded"
                  :style="computeBarStyle(Number(item.tempMin), Number(item.tempMax))"
                ></div>
              </div>

              <!-- 最高温 -->
              <span class="text-xl">{{ item.tempMax }}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getCurrentWeather, getDailyWeather, getHourlyWeather } from '../api/path/weatherApi'
import type { geoLocation } from '../types/weatherTypes'
import chroma from 'chroma-js'
import { useCityListStore } from '../stores/citylist'
import { storeToRefs } from 'pinia'

interface SavedCity {
  id: string
  cityId: string | null
}

const route = useRoute()

const cityListStore = useCityListStore()
const { cityList, isExist } = storeToRefs(cityListStore)

//待优化：
//用URL传参太蠢了，考虑用pinia全局变量优化
const cityStr = decodeURIComponent(route.params.city as string)
const city = JSON.parse(cityStr) as geoLocation

const utcOffset = city.utcOffset as string

//从localStorage获取城市列表
//这个后续也要用pinia全局变量优化
//加号放在layout传参太麻烦了，考虑都放到这个页面里面吧
const savedCity: SavedCity[] = JSON.parse(localStorage.getItem('savedCities') as string) || []

// 解析 UTC 偏移量（例如 "-08:00"）为毫秒数
function parseOffset(offset: string): number {
  const sign = offset.startsWith('-') ? -1 : 1
  const [hours, minutes] = offset.slice(1).split(':').map(Number)
  return sign * ((hours * 60 + minutes) * 60 * 1000)
}

// 计算目标城市的当地时间
function calculateLocalTime(offset: string): Date {
  const now = new Date()
  // 获取当前时间的 UTC 时间戳
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
  // 根据偏移量计算当地时间
  return new Date(utcTime + parseOffset(offset))
}

const res = await getCurrentWeather(city.id as string)
// const res = {
//   code: '200',
//   updateTime: '2025-01-23T16:12+08:00',
//   fxLink: 'https://www.qweather.com/weather/jinan-101120101.html',
//   now: {
//     obsTime: '2025-01-23T16:08+08:00',
//     temp: '7',
//     feelsLike: '4',
//     icon: '502',
//     text: '霾',
//     wind360: '315',
//     windDir: '西北风',
//     windScale: '2',
//     windSpeed: '7',
//     humidity: '55',
//     precip: '0.0',
//     pressure: '1003',
//     vis: '5',
//     cloud: '94',
//     dew: '1',
//   },
//   refer: {
//     sources: ['QWeather'],
//     license: ['CC BY-SA 4.0'],
//   },
// }

const hourlyRes = await getHourlyWeather(city.id as string)
const hourlyData = hourlyRes.hourly
// const hourlyData = [
//   {
//     fxTime: '2025-01-23T17:00+08:00',
//     temp: '8',
//     icon: '101',
//     text: '多云',
//     wind360: '14',
//     windDir: '北风',
//     windScale: '1-3',
//     windSpeed: '5',
//     humidity: '64',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1004',
//     cloud: '96',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-23T18:00+08:00',
//     temp: '7',
//     icon: '151',
//     text: '多云',
//     wind360: '32',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '5',
//     humidity: '71',
//     pop: '6',
//     precip: '0.0',
//     pressure: '1004',
//     cloud: '89',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-23T19:00+08:00',
//     temp: '6',
//     icon: '151',
//     text: '多云',
//     wind360: '46',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '5',
//     humidity: '78',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1004',
//     cloud: '83',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-23T20:00+08:00',
//     temp: '5',
//     icon: '151',
//     text: '多云',
//     wind360: '53',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '5',
//     humidity: '81',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1004',
//     cloud: '76',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-23T21:00+08:00',
//     temp: '4',
//     icon: '151',
//     text: '多云',
//     wind360: '46',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '5',
//     humidity: '84',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1004',
//     cloud: '54',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-23T22:00+08:00',
//     temp: '3',
//     icon: '151',
//     text: '多云',
//     wind360: '30',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '7',
//     humidity: '87',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1005',
//     cloud: '33',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-23T23:00+08:00',
//     temp: '3',
//     icon: '151',
//     text: '多云',
//     wind360: '22',
//     windDir: '北风',
//     windScale: '1-3',
//     windSpeed: '7',
//     humidity: '89',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1005',
//     cloud: '11',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T00:00+08:00',
//     temp: '3',
//     icon: '151',
//     text: '多云',
//     wind360: '30',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '7',
//     humidity: '90',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1006',
//     cloud: '33',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T01:00+08:00',
//     temp: '2',
//     icon: '151',
//     text: '多云',
//     wind360: '44',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '7',
//     humidity: '90',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1007',
//     cloud: '54',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T02:00+08:00',
//     temp: '2',
//     icon: '151',
//     text: '多云',
//     wind360: '49',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '7',
//     humidity: '90',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1007',
//     cloud: '76',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T03:00+08:00',
//     temp: '2',
//     icon: '151',
//     text: '多云',
//     wind360: '44',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '7',
//     humidity: '89',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1008',
//     cloud: '84',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T04:00+08:00',
//     temp: '2',
//     icon: '151',
//     text: '多云',
//     wind360: '36',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '7',
//     humidity: '89',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1007',
//     cloud: '92',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T05:00+08:00',
//     temp: '1',
//     icon: '151',
//     text: '多云',
//     wind360: '34',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '7',
//     humidity: '89',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1006',
//     cloud: '100',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T06:00+08:00',
//     temp: '1',
//     icon: '151',
//     text: '多云',
//     wind360: '37',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '7',
//     humidity: '93',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1006',
//     cloud: '100',
//     dew: '-1',
//   },
//   {
//     fxTime: '2025-01-24T07:00+08:00',
//     temp: '1',
//     icon: '151',
//     text: '多云',
//     wind360: '41',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '7',
//     humidity: '90',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1006',
//     cloud: '99',
//     dew: '-1',
//   },
//   {
//     fxTime: '2025-01-24T08:00+08:00',
//     temp: '1',
//     icon: '101',
//     text: '多云',
//     wind360: '44',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '9',
//     humidity: '87',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1006',
//     cloud: '99',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T09:00+08:00',
//     temp: '3',
//     icon: '104',
//     text: '阴',
//     wind360: '43',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '9',
//     humidity: '81',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1006',
//     cloud: '87',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T10:00+08:00',
//     temp: '4',
//     icon: '104',
//     text: '阴',
//     wind360: '41',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '11',
//     humidity: '76',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1007',
//     cloud: '75',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T11:00+08:00',
//     temp: '5',
//     icon: '104',
//     text: '阴',
//     wind360: '42',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '11',
//     humidity: '70',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1008',
//     cloud: '62',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T12:00+08:00',
//     temp: '6',
//     icon: '104',
//     text: '阴',
//     wind360: '46',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '11',
//     humidity: '66',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1009',
//     cloud: '43',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T13:00+08:00',
//     temp: '7',
//     icon: '104',
//     text: '阴',
//     wind360: '51',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '13',
//     humidity: '63',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1010',
//     cloud: '24',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T14:00+08:00',
//     temp: '8',
//     icon: '104',
//     text: '阴',
//     wind360: '55',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '13',
//     humidity: '63',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1010',
//     cloud: '4',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T15:00+08:00',
//     temp: '7',
//     icon: '101',
//     text: '多云',
//     wind360: '57',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '13',
//     humidity: '60',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1010',
//     cloud: '3',
//     dew: '0',
//   },
//   {
//     fxTime: '2025-01-24T16:00+08:00',
//     temp: '7',
//     icon: '101',
//     text: '多云',
//     wind360: '58',
//     windDir: '东北风',
//     windScale: '1-3',
//     windSpeed: '13',
//     humidity: '63',
//     pop: '7',
//     precip: '0.0',
//     pressure: '1011',
//     cloud: '1',
//     dew: '1',
//   },
// ]

hourlyData.forEach((item) => {
  const [date, offset] = item.fxTime.split('T')

  const res = offset.split(/[+-]/)[0]
  item['fxTime'] = res
})

//自定义全局最高温最低温进度条
let minTemp = Infinity
let maxTemp = -Infinity

const computeBarStyle = (min: number, max: number) => {
  // 定义颜色序列
  const colorScale = chroma
    .scale([
      '#1D71F2', // 深蓝色
      '#1C9CF6', // 蓝色
      '#7AC26F', //green
      '#FFB400', //黄
      '#FE7701',
      '#b30400',
    ])
    .domain([0, 1])

  // 避免除零
  const totalRange = maxTemp - minTemp || 1
  // 计算条相对父容器的左侧起点(%)，以及总宽度(%)
  const leftPercent = ((min - minTemp) / totalRange) * 100
  const widthPercent = ((max - min) / totalRange) * 100

  const lowColor = colorScale((min + 5) / 45).hex()
  const highColor = colorScale((max + 5) / 45).hex()

  const gradient = `linear-gradient(to right, ${lowColor}, ${highColor})`

  return {
    left: leftPercent + '%',
    width: widthPercent + '%',
    background: gradient,
    borderRadius: '4px',
  }
}

//获取每天天气
const dailyRes = await getDailyWeather(city.id as string)
const dailyData = dailyRes.daily

minTemp = Math.min(
  ...dailyData.map((item) => {
    return Number(item.tempMin)
  }),
)

maxTemp = Math.max(
  ...dailyData.map((item) => {
    return Number(item.tempMax)
  }),
)

const currentTime = calculateLocalTime(utcOffset) as unknown as string
</script>
