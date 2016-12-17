// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  infoRequest: [
    'token',
    'accountId'
  ],
  infoSuccess: [
    'accountId',
    'email',
    'nickname',
    'profileImagePath',
    'followerCount',
    'followingCount'
  ],
  infoFailure: [
    'error'
  ],

  userEpisodeCheck: [
    'token',
    'active'
  ],
  userEpisodeCheckSuccess: [
    'episodeStatus',
    'activeEpisodeId'
  ],
  userEpisodeCheckFailure: [
    'error'
  ]
})

export const AccountTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  accountId: null,
  email: null,
  nickname: null,
  profileImagePath: null,
  followerCount: null,
  followingCount: null,
  attempting: false,
  error: null,

  episodeChecking: false,
  episodeStatus: null,
  activeEpisodeId: null
})

/* ------------- Reducers ------------- */

// we're attempting to check signup
export const inforequest = (state: Object, { token, accountId }: Object) =>
  state.merge({ attempting: true, accountId })

export const infosuccess = (state: Object, { accountId, email, nickname, profileImagePath, followerCount, followingCount }: Object) =>
  state.merge({ attempting: false, accountId, email, nickname, profileImagePath, followerCount, followingCount })

export const infofailure = (state: Object, { error }: Object) =>
  state.merge({ attempting: false, error })

// we're attempting to check signup
export const userEpisodeCheck = (state: Object, { token, active }: Object) =>
  state.merge({ episodeChecking: true })

export const userEpisodeCheckSuccess = (state: Object, { episodeStatus, activeEpisodeId }: Object) =>
  state.merge({ episodeChecking: false, episodeStatus, activeEpisodeId })

export const userEpisodeCheckFailure = (state: Object, { error }: Object) =>
  state.merge({ episodeChecking: false, error })
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INFO_REQUEST]: inforequest,
  [Types.INFO_SUCCESS]: infosuccess,
  [Types.INFO_FAILURE]: infofailure,

  [Types.USER_EPISODE_CHECK]: userEpisodeCheck,
  [Types.USER_EPISODE_CHECK_SUCCESS]: userEpisodeCheckSuccess,
  [Types.USER_EPISODE_CHECK_FAILURE]: userEpisodeCheckFailure
})
