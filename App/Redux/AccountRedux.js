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

  otherInfoRequest: [
    'token',
    'otherAccountId'
  ],
  otherInfoSuccess: [
    'otherAccountId',
    'otherEmail',
    'otherNickname',
    'otherProfileImagePath',
    'otherFollowerCount',
    'otherFollowingCount'
  ],
  otherInfoFailure: [
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
  ],

  followPost: [
    'token',
    'id',
    'accountId'
  ],
  followPostSuccess: [
    'response'
  ],
  followPostFailure: [
    'error'
  ],

  followDelete: [
    'token',
    'id',
    'accountId'
  ],
  followDeleteSuccess: [
    'response'
  ],
  followDeleteFailure: [
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

  otherAccountId: null,
  otherEmail: null,
  otherNickname: null,
  otherProfileImagePath: null,
  otherFollowerCount: null,
  otherFollowingCount: null,

  episodeChecking: false,
  episodeStatus: null,
  activeEpisodeId: null,

  followPosting: false,
  followDeleting: false
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
export const otherInfoRequest = (state: Object, { token, otherAccountId }: Object) =>
  state.merge({ attempting: true, otherAccountId })

export const otherInfoSuccess = (state: Object, { otherAccountId, otherEmail, otherNickname, otherProfileImagePath, otherFollowerCount, otherFollowingCount }: Object) =>
  state.merge({ attempting: false, otherAccountId, otherEmail, otherNickname, otherProfileImagePath, otherFollowerCount, otherFollowingCount })

export const otherInfoFailure = (state: Object, { error }: Object) =>
  state.merge({ attempting: false, error })

// we're attempting to check signup
export const userEpisodeCheck = (state: Object, { token, active }: Object) =>
  state.merge({ episodeChecking: true })

export const userEpisodeCheckSuccess = (state: Object, { episodeStatus, activeEpisodeId }: Object) =>
  state.merge({ episodeChecking: false, episodeStatus, activeEpisodeId })

export const userEpisodeCheckFailure = (state: Object, { error }: Object) =>
  state.merge({ episodeChecking: false, error })

// follow POST
export const postFollow = (state: Object, { token, id, accountId }: Object) =>
  state.merge({ followPosting: true })

export const postFollowSuccess = (state: Object, { response }: Object) =>
  state.merge({ followPosting: false })

export const postFollowFailure = (state: Object, { error }: Object) =>
  state.merge({ followPosting: false })

// follow DELETE
export const deleteFollow = (state: Object, { token, id, accountId }: Object) =>
  state.merge({ followDeleting: true })

export const deleteFollowSuccess = (state: Object, { response }: Object) =>
  state.merge({ followDeleting: false })

export const deleteFollowFailure = (state: Object, { error }: Object) =>
  state.merge({ followDeleting: false })
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INFO_REQUEST]: inforequest,
  [Types.INFO_SUCCESS]: infosuccess,
  [Types.INFO_FAILURE]: infofailure,

  [Types.OTHER_INFO_REQUEST]: otherInfoRequest,
  [Types.OTHER_INFO_SUCCESS]: otherInfoSuccess,
  [Types.OTHER_INFO_FAILURE]: otherInfoFailure,

  [Types.USER_EPISODE_CHECK]: userEpisodeCheck,
  [Types.USER_EPISODE_CHECK_SUCCESS]: userEpisodeCheckSuccess,
  [Types.USER_EPISODE_CHECK_FAILURE]: userEpisodeCheckFailure,

  [Types.FOLLOW_POST]: postFollow,
  [Types.FOLLOW_POST_SUCCESS]: postFollowSuccess,
  [Types.FOLLOW_POST_FAILURE]: postFollowFailure,

  [Types.FOLLOW_DELETE]: deleteFollow,
  [Types.FOLLOW_DELETE_SUCCESS]: deleteFollowSuccess,
  [Types.FOLLOW_DELETE_FAILURE]: deleteFollowFailure
})
