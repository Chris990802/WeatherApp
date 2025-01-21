//path里面的api调用server和tools(现在还么实现)里面的公共方法
//然后再index.ts统一对外暴露
import { getAction } from '@/api/server'
import {
  type WeatherApiResponse,
  type currentWeatherApiResponse,
  type geoApiResponse,
} from '@/types/weatherTypes'
import { WEATHER_API_URL_DAILY, QWEATHER_PRIVATE_KEY } from '@/enums/path/userInfo'
import { QWEATHER_PLACES, QWEATHER_CURRET } from '../../enums/path/userInfo'

const defaultParams = {
  key: QWEATHER_PRIVATE_KEY,
}

export const getFutureWeather = async (location: string = 'jinan', days: string | number = '0') => {
  const params = {
    location,
    days,
    ...defaultParams,
  }

  try {
    const res = await getAction<WeatherApiResponse>(WEATHER_API_URL_DAILY, params)
    console.log(res)
    return res.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getGEO = async (location: string = 'jinan') => {
  const params = {
    location,
    ...defaultParams,
  }

  try {
    const res = await getAction<geoApiResponse>(QWEATHER_PLACES, params)
    console.log(res)
    return res.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getCurrentWeather = async (location: string) => {
  const params = {
    location,
    ...defaultParams,
  }

  try {
    const res = await getAction<currentWeatherApiResponse>(QWEATHER_CURRET, params)
    return res.data
  } catch (err) {
    console.log(err)
    throw err
  }
}
