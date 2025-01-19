//未来几天天气接口返回信息结构
// types/weatherTypes.ts
export interface Location {
  id: string;
  name: string;
  country: string;
  path: string;
  timezone: string;
  timezone_offset: string;
}

export interface DailyWeather {
  date: string;
  text_day: string;
  code_day: string;
  text_night: string;
  code_night: string;
  high: string;
  low: string;
  rainfall: string;
  precip: string;
  wind_direction: string;
  wind_direction_degree: string;
  wind_speed: string;
  wind_scale: string;
  humidity: string;
}

export interface WeatherApiResponse {
  results: {
    location: Location;
    daily: DailyWeather[];
    last_update: string;
  }[];
}
