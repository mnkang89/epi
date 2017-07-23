import { getRealm } from './RealmFactory'
import * as NavigationService from '../Services/NavigationService'

export const tokenChecker = (errCode) => {
  let realm = getRealm()
  let accounts = realm.objects('account')

  if (errCode === 401) {
    realm.write(() => {
      realm.delete(accounts)
    })
    NavigationService.reset('Login')
  }
  return
}

export const getToken = () => {
  let realm = getRealm()
  let accounts = realm.objects('account')
  if (accounts.length === 0) {
    return null
  } else {
    return accounts[0].token
  }
}

export const getAccountId = () => {
  let realm = getRealm()
  let accounts = realm.objects('account')
  if (accounts.length === 0) {
    return null
  } else {
    return accounts[0].accountId
  }
}

export const setToken = (token, accountId) => {
  let realm = getRealm()
  realm.write(() => {
    let accounts = realm.objects('account')
    realm.delete(accounts)
    realm.create('account', {token: token, accountId: accountId})
  })

  realm.write(() => realm.create('account', {token: token, accountId: accountId}))
}

export const isLoggedIn = () => {
  const token = getToken()
  if (token == null) {
    return false
  } else {
    return true
  }
}
