//path里面的api调用server和tools(现在还么实现)里面的公共方法
//然后再index.ts统一对外暴露
import { getAction} from '@/api/server'
import type { WeatherApiResponse } from '@/types/weatherTypes'
import { WEATHER_API_URL_DAILY, PRIVATE_KEY } from '@/enums/path/userInfo'

const defaultParams = {
  unit: 'c',
  language: 'zh-Hans',
  start: '0',
  key: PRIVATE_KEY,
}

export const getFutureWeather = async (location: string = 'jinan', days: string | number = '0') => {
  const params = {
    location,
    days,
    ...defaultParams,
  }

  const [err, res] = await getAction<WeatherApiResponse>(WEATHER_API_URL_DAILY, params)
  console.log(res)

  if (err !== null || undefined) {
    console.log('error', err)
    return err
  } else if (res === undefined) {
    console.error('Error: Response is undefined')
    return new Error('Response is undefined')
  }
  return res.data
}
