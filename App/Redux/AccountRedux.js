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
    'accountId',
    'active'
  ],
  userEpisodesSuccess: [
    'episodes'
  ],
  userEpisodesFailure: [
    'episodesError'
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

  episodes: [],
  episodesRequesting: false,
  episodesError: null,

  episodeStatus: null,
  activeEpisodeId: null
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
export const userEpisodesRequest = (state: Object, { token, accountId, active }: Object) =>
  state.merge({ episodesRequesting: true })

// we've successfully signup
export const userEpisodesSuccess = (state: Object, { episodes }: Object) =>
  state.merge({ episodesRequesting: false, episodesError: null, episodes })

// we've had a problem signup
export const userEpisodesFailure = (state: Object, { episodesError }: Object) =>
  state.merge({ episodesRequesting: false, episodesError })

// we're attempting to check signup
export const userEpisodeCheck = (state: Object, { token, active }: Object) =>
  state.merge({ episodesRequesting: true })
export const userEpisodeCheckSuccess = (state: Object, { episodeStatus, activeEpisodeId }: Object) =>
  state.merge({ episodesRequesting: false, episodeStatus, activeEpisodeId })
export const userEpisodeCheckFailure = (state: Object, { error }: Object) =>
  state.merge({ episodesRequesting: false, error })
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INFO_REQUEST]: inforequest,
  [Types.INFO_SUCCESS]: infosuccess,
  [Types.INFO_FAILURE]: infofailure,

  [Types.USER_EPISODES_REQUEST]: userEpisodesRequest,
  [Types.USER_EPISODES_SUCCESS]: userEpisodesSuccess,
  [Types.USER_EPISODES_FAILURE]: userEpisodesFailure,

  [Types.USER_EPISODE_CHECK]: userEpisodeCheck,
  [Types.USER_EPISODE_CHECK_SUCCESS]: userEpisodeCheckSuccess,
  [Types.USER_EPISODE_CHECK_FAILURE]: userEpisodeCheckFailure
})
