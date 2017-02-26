import Realm from 'realm'

const AccountSchema = {
  name: 'account',
  properties: {
    token: 'string',
    accountId: 'int'
  }
}

const CacheImageSchema = {
  name: 'cacheImage',
  properties: {
    id: { type: 'string', indexed: true },
    url: 'string',
    path: 'string',
    expireDateTime: {type: 'date'}
  }
}

const CacheVideoSchema = {
  name: 'cacheVideo',
  properties: {
    id: { type: 'string', indexed: true },
    url: 'string',
    path: 'string',
    expireDateTime: {type: 'date'}
  }
}

const PushTokenSchema = {
  name: 'pushToken',
  properties: {
    token: {type: 'string'}
  }
}

export const getRealm = () => {
  return new Realm({schema: [AccountSchema, CacheImageSchema, CacheVideoSchema, PushTokenSchema]})
}
