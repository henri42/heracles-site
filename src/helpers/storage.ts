export const USER_ERC_CONNECTED_WITH = 'USER_ERC_CONNECTED_WITH'
export const USER_POLKADOT_ADDRESS = 'USER_POLKADOT_ADDRESS'

export const store = (key: string, data: string) => {
  return localStorage.setItem(key, data)
}
export const get = (key: string) => {
  return localStorage.getItem(key)
}
export const clear = (key: string) => {
  return localStorage.removeItem(key)
}
