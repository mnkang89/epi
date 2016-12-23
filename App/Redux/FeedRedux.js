// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  bestFeedsRequest: [
    'token'
  ],
  bestFeedsSuccess: [
    'bestFeeds'
  ],
  bestFeedsFailure: [
    'bestFeedsError'
  ]
})

export const FeedTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  bestFeeds: [],
  bestFeedsRequesting: true,
  bestFeedsError: null
})

/* ------------- Reducers ------------- */
// we're attempting to get Episodes
export const bestFeedsRequest = (state: Object, { token }: Object) =>
  state.merge({ bestFeedsRequesting: true })

export const bestFeedsRequestSuccess = (state: Object, { bestFeeds }: Object) =>
  state.merge({ bestFeedsRequesting: false, bestFeedsError: null, bestFeeds })

export const bestFeedsRequestFailure = (state: Object, { bestFeedsError }: Object) =>
  state.merge({ bestFeedsRequesting: false, bestFeedsError })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.BEST_FEEDS_REQUEST]: bestFeedsRequest,
  [Types.BEST_FEEDS_SUCCESS]: bestFeedsRequestSuccess,
  [Types.BEST_FEEDS_FAILURE]: bestFeedsRequestFailure
})
