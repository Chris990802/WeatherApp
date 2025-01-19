export function getAction(url, params) {
  return axios.get(url, { params })
}

export function postAction(url, data) {
  return axios.post(url, data)
}
