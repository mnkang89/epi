import Realm from 'realm'

const AccountSchema = {
  name: 'account',
  properties: {
    token: 'string',
    accountId: 'int'
  }
}

const EpisodeSchema = {
  name: 'episode',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', indexed: true },
    offset: {type: 'int', default: 0},
    like: {type: 'bool', default: false}
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
  return new Realm({schema: [AccountSchema, EpisodeSchema, CacheImageSchema, CacheVideoSchema, PushTokenSchema]})
}
