// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  notiesRequest: [
    'token'
  ],
  notiesSuccess: [
    'noties'
  ],
  notiesFailure: [
    'error'
  ]
})

export const NotiTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  notiesRequesting: false,
  noties: [],
  error: null
})

/* ------------- Reducers ------------- */
// we're attempting to get Episodes
export const notiesRequest = (state: Object, { token }: Object) =>
  state.merge({ notiesRequesting: true })

export const notiesRequestSuccess = (state: Object, { noties }: Object) =>
  state.merge({ notiesRequesting: false, error: null, noties })

export const notiesRequestFailure = (state: Object, { error }: Object) =>
  state.merge({ notiesRequesting: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.NOTIES_REQUEST]: notiesRequest,
  [Types.NOTIES_SUCCESS]: notiesRequestSuccess,
  [Types.NOTIES_FAILURE]: notiesRequestFailure
})
