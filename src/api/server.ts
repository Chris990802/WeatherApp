import axios from 'axios'

type Fn = (data: FcResponse<unknown>) => unknown

export interface IAnyObject {
  [key: string]: unknown
}

export interface FcResponse<T> {
  data: T
}

type ApiResponse<T> = Promise<FcResponse<T>>

axios.interceptors.response.use(
  (response) => {
    if (response.status !== 200) return Promise.reject(response.data)
    return response
  },
  (err) => {
    const { status, detail } = err.response.data.error
    return Promise.reject({ status, detail })
  },
)

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

  let res: FcResponse<T> = {
    data: {} as T,
  }

  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then((response) => {
        if (clearFn !== undefined) {
          res = clearFn(response.data) as FcResponse<T>
        } else {
          res.data = response.data as T
        }
        resolve(res)
      })
      .catch((err) => {
        console.log('出现了错误', err)
        reject(err)
      })
  })
}

// export const postAction = <T>(url: string, params: IAnyObject = {}): ApiResponse<T> => {
//   return new Promise((resolve) => {
//     axios
//       .post(url, { params })
//       .then((response) => {
//         console.log(response.data)
//         resolve([null, response as unknown as FcResponse<T>])
//       })
//       .catch((err) => {
//         resolve([err, undefined])
//       })
//   })
// }

//动态生成JWT
// export const generalJWT = async () => {
//   try {
//     const YourPrivateKey = QWEATHER_JWT_PRIVATE_KEY
//     console.log('JWT:')
//     // 导入私钥，确保是 PKCS#8 格式
//     const privateKey = await importPKCS8(YourPrivateKey, 'EdDSA')

//     // 设置 JWT 头部
//     const customHeader = {
//       alg: 'EdDSA',
//       kid: 'TE5AY2EMTQ', // 使用你实际的 key ID
//     }

//     // 设置有效时间
//     const iat = Math.floor(Date.now() / 1000) - 30 // 允许的略微延迟
//     const exp = iat + 900 // 过期时间设置为 15 分钟

//     // 设置 JWT payload
//     const customPayload = {
//       sub: '3B2F67EJBA', // 使用你的实际 project ID 或 subject
//       iat: iat,
//       exp: exp,
//     }

//     // 创建 JWT 并签名
//     const token = await new SignJWT(customPayload).setProtectedHeader(customHeader).sign(privateKey)
//     console.log('JWT:', token)
//   } catch (error) {
//     console.error('Error generating JWT:', error)
//   }
// }
