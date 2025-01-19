import axios from 'axios'

type Fn = (data: FcResponse<unknown>) => unknown

export interface IAnyObject {
  [key: string]: unknown
}

export interface FcResponse<T> {
  errorNo: string
  errMsg: string
  data: T
}

type ApiResponse<T> = Promise<[unknown, FcResponse<T> | undefined]>

//本项目使用 [err , res] 表示返回的数据，err表示错误，res为返回的数据
//这样在任何情况下我们都resolve

//TODO
//自己写Get和Post方法
//接3个参数，url，param，clearfn， clearfn根据返回数据决定是否使用fn对返回做处理
//返回一个元祖，第一个元素是返回可能的错误，第二个元素是返回数据
export const getAction = <T>(
  url: string,
  params: IAnyObject = {},
  clearFn?: Fn,
): ApiResponse<T> => {
  return new Promise((resolve) => {
    axios
      .get(url, { params })
      .then((response) => {
        // 默认值
        let res: FcResponse<T> = {
          errorNo: '',
          errMsg: '',
          data: {} as T,
        }
        console.log(response.data)
        if (clearFn !== undefined) {
          res = clearFn(response.data) as FcResponse<T>
        } else {
          res.errorNo = response.data.errorNo || ''
          res.errMsg = response.data.errMsg || ''
          res.data = response.data as T
        }

        console.log('res is a what', res)
        resolve([null, res])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}

export const postAction = <T>(url: string, params: IAnyObject = {}): ApiResponse<T> => {
  return new Promise((resolve) => {
    axios
      .get(url, { params })
      .then((response) => {
        console.log(response.data)
        resolve([null, response as unknown as FcResponse<T>])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}
