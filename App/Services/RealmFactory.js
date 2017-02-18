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
    id: 'string',
    url: 'string',
    path: 'string',
    expireDateTime: {type: 'date'}
  }
}

export const getRealm = () => {
  return new Realm({schema: [AccountSchema, CacheImageSchema]})
}
