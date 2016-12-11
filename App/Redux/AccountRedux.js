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
    'numberOfFollower',
    'numberOfFollowing'
  ],
  infoFailure: [
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
  profileImage: null,
  numberOfFollower: null,
  numberOfFollowing: null,
  attempting: false,
  error: null
})

/* ------------- Reducers ------------- */

// we're attempting to check signup
export const inforequest = (state: Object, { token, accountId }: Object) =>
  state.merge({ attempting: true, accountId })

// we've successfully signup
export const infosuccess = (state: Object, { accountId, email, nickname, numberOfFollower, numberOfFollowing }: Object) =>
  state.merge({ attempting: false, accountId, email, nickname, numberOfFollower, numberOfFollowing })

// we've had a problem signup
export const infofailure = (state: Object, { error }: Object) =>
  state.merge({ attempting: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INFO_REQUEST]: inforequest,
  [Types.INFO_SUCCESS]: infosuccess,
  [Types.INFO_FAILURE]: infofailure
})
