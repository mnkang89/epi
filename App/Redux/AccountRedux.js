// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  infoRequest: [
    'token',
    'accountId'],
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

  userEpisodesRequest: [
    'token',
    'active'
  ],
  userEpisodesSuccess: [
    'episodes'
  ],
  userEpisodesFailure: [
    'episodeError'
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

  episodes: [],
  episodesRequesting: false,
  episodesError: null
})

/* ------------- Reducers ------------- */

// we're attempting to check signup
export const inforequest = (state: Object, { token, accountId }: Object) =>
  state.merge({ attempting: true, accountId })

// we've successfully signup
export const infosuccess = (state: Object, { accountId, email, nickname, profileImagePath, followerCount, followingCount }: Object) =>
  state.merge({ attempting: false, accountId, email, nickname, profileImagePath, followerCount, followingCount })

// we've had a problem signup
export const infofailure = (state: Object, { error }: Object) =>
  state.merge({ attempting: false, error })

// we're attempting to check signup
export const userEpisodesRequest = (state: Object, { token, active }: Object) =>
  state.merge({ episodesRequesting: true })

// we've successfully signup
export const userEpisodesSuccess = (state: Object, { episodes }: Object) =>
  state.merge({ episodesRequesting: false, episodesError: null, episodes })

// we've had a problem signup
export const userEpisodesFailure = (state: Object, { episodesError }: Object) =>
  state.merge({ episodesRequesting: false, episodesError })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INFO_REQUEST]: inforequest,
  [Types.INFO_SUCCESS]: infosuccess,
  [Types.INFO_FAILURE]: infofailure,

  [Types.USER_EPISODES_REQUEST]: userEpisodesRequest,
  [Types.USER_EPISODES_SUCCESS]: userEpisodesSuccess,
  [Types.USER_EPISODES_FAILURE]: userEpisodesFailure
})
