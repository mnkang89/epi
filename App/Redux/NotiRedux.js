// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  notiesRequest: [
    'token',
    'page'
  ],
  notiesSuccess: [
    'noties'
  ],
  notiesFailure: [
    'error'
  ],

  moreNotiesRequest: [
    'token',
    'page'
  ],
  moreNotiesSuccess: [
    'moreNoties'
  ],
  moreNotiesFailure: [
    'moreNotiesError'
  ]
})

export const NotiTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  notiesRequesting: false,
  noties: [],
  error: null,

  moreNotiesRequesting: false,
  moreNoties: [],
  moreNotiesError: null
})

/* ------------- Reducers ------------- */
// we're attempting to get Episodes
export const notiesRequest = (state: Object, { token }: Object) =>
  state.merge({ notiesRequesting: true })

export const notiesRequestSuccess = (state: Object, { noties }: Object) =>
  state.merge({ notiesRequesting: false, error: null, noties })

export const notiesRequestFailure = (state: Object, { error }: Object) =>
  state.merge({ notiesRequesting: false, error })

export const moreNotiesRequest = (state: Object, { token }: Object) =>
  state.merge({ moreNotiesRequesting: true })

export const moreNotiesSuccess = (state: Object, { moreNoties }: Object) =>
  state.merge({
    moreNotiesRequesting: false,
    moreNotiesError: null,
    noties: [...state.noties, ...moreNoties]
  })

export const moreNotiesFailure = (state: Object, { moreNotiesError }: Object) =>
  state.merge({ moreNotiesRequesting: false, moreNotiesError })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.NOTIES_REQUEST]: notiesRequest,
  [Types.NOTIES_SUCCESS]: notiesRequestSuccess,
  [Types.NOTIES_FAILURE]: notiesRequestFailure,

  [Types.MORE_NOTIES_REQUEST]: moreNotiesRequest,
  [Types.MORE_NOTIES_SUCCESS]: moreNotiesSuccess,
  [Types.MORE_NOTIES_FAILURE]: moreNotiesFailure
})
