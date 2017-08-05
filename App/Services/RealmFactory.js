import Realm from 'realm'

const logQueueSchema = {
  name: 'logQueue',
  properties: {
    logType: { type: 'string' },
    log: { type: 'log' }
  }
}

const logSchema = {
  name: 'log',
  properties: {
    logTime: { type: 'string' },
    userId: { type: 'string' },
    contentIndex: { type: 'string' },
    contentId: { type: 'string' },
    episodeId: { type: 'string' },
    type: { type: 'string' },
    path: { type: 'string' },
    panel: { type: 'string' }
  }
}

const AccountSchema = {
  name: 'account',
  properties: {
    token: 'string',
    accountId: 'int'
  }
}

const UserSchema = {
  name: 'user',
  properties: {
    id: { type: 'int', indexed: true },
    followerCount: {type: 'int', default: 0},
    followingCount: {type: 'int', default: 0},
    followStatus: {type: 'bool', default: false}
  }
}

const EpisodeSchema = {
  name: 'episode',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', indexed: true },
    offset: {type: 'int', default: 0},
    like: {type: 'bool', default: false},
    likeCount: {type: 'int', default: 0},
    commentCount: {type: 'int', default: 0}
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
  return new Realm({schema: [logQueueSchema, logSchema, AccountSchema, UserSchema, EpisodeSchema, CacheImageSchema, CacheVideoSchema, PushTokenSchema]})
}
