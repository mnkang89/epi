import Realm from 'realm'

const visitLogQueueSchema = {
  name: 'visitLogQueue',
  properties: {
    log: { type: 'visitLog' }
  }
}

const impLogQueueSchema = {
  name: 'impLogQueue',
  properties: {
    log: { type: 'impViewLog' }
  }
}

const viewLogQueueSchema = {
  name: 'viewLogQueue',
  properties: {
    log: { type: 'impViewLog' }
  }
}

const visitLog = {
  name: 'visitLog',
  properties: {
    accountId: { type: 'int' },
    datetime: { type: 'string' },
    ip: { type: 'string' },
    type: { type: 'string' },
    version: { type: 'string' },
    visitAccountId: { type: 'int' }
  }
}

const impViewLog = {
  name: 'impViewLog',
  properties: {
    accountId: { type: 'int' },
    contentId: { type: 'int' },
    datetime: { type: 'string' },
    episodeId: { type: 'int' },
    episodeIdx: { type: 'int' },
    feedIdx: { type: 'int' },
    ip: { type: 'string' },
    screenType: { type: 'string' },
    type: { type: 'string' },
    version: { type: 'string' }
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
  return new Realm({schema: [visitLogQueueSchema, impLogQueueSchema, viewLogQueueSchema, impViewLog, visitLog, AccountSchema, UserSchema, EpisodeSchema, CacheImageSchema, CacheVideoSchema, PushTokenSchema]})
}
