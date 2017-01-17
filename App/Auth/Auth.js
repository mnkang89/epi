import { AsyncStorage } from 'react-native'

const tokenKey = '@EPISODE:TOKEN'

export const getToken = () => {
  return AsyncStorage.getItem(tokenKey)
}

export const setToken = (token) => {
  AsyncStorage.setItem(tokenKey, token)
}
