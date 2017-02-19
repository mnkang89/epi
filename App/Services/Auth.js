// @flow

import Realm from 'realm'

const TokenSchema = {
  name: 'token',
  properties: {
    token: 'string',
    accountId: 'int'
  }
}

const realm = new Realm({schema: [TokenSchema], schemaVersion: 1})

export const getToken = () => {
  let tokens = realm.objects('token')
  if (tokens.length === 0) {
    return null
  } else {
    return tokens[0].token
  }
}

export const getAccountId = () => {
  let tokens = realm.objects('token')
  if (tokens.length === 0) {
    return null
  } else {
    return tokens[0].accountId
  }
}

export const setToken = (token, accountId) => {
  let tokens = realm.objects('token')
  console.log(tokens)
  // realm.delete(tokens)
  realm.write(() => realm.create('token', {token: token, accountId: accountId}))
}

export const isLoggedIn = () => {
  const token = getToken()
  if (token == null) {
    return false
  } else {
    return true
  }
}
