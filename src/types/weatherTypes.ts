//未来几天天气接口返回信息结构
// types/weatherTypes.ts
export interface Location {
  id: string
  name: string
  country: string
  path: string
  timezone: string
  timezone_offset: string
}

export interface DailyWeather {
  date: string
  text_day: string
  code_day: string
  text_night: string
  code_night: string
  high: string
  low: string
  rainfall: string
  precip: string
  wind_direction: string
  wind_direction_degree: string
  wind_speed: string
  wind_scale: string
  humidity: string
}

export interface WeatherApiResponse {
  results: {
    location: Location
    daily: DailyWeather[]
    last_update: string
  }[]
}

//使用和风api接口
export interface geoLocation {
  name: string
  id: string
  lat: string
  lon: string
  adm2: string
  adm1: string
  country: string
  tz: string
  utcOffset: string
  isDst: string
  type: string
  rank: string
  fxLink: string
}

export interface geoApiResponse {
  code: string
  location: geoLocation[]
  refer: {
    sources: string[]
    license: string[]
  }
}

export type errorObj = {
  status: number
  detail: string
}

//当前天气查询接口
export interface currentWeatherApiResponse {
  code: string
  updateTime: string
  fixLink: string
  now: currentWeather
  refer: {
    sources: string[]
    license: string[]
  }
}

export interface currentWeather {
  obsTime: string
  temp: string
  feelsLike: string
  icon: string
  text: string
  wind360: string
  windDir: string
  windScale: string
  windSpeed: string
  humidity: string
  precip: string
  pressure: string
  vis: string
  cloud: string
  dew: string
}
