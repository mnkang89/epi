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
  ],

  moreBestFeedsRequest: [
    'token',
    'accountId',
    'before'
  ],
  moreBestFeedsSuccess: [
    'moreBestFeeds'
  ],
  moreBestFeedsFailure: [
    'moreBestFeedsError'
  ]

})

export const FeedTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  bestFeeds: [],
  bestFeedsRequesting: false,
  bestFeedsError: null,

  moreBestFeeds: [],
  moreBestFeedsRequesting: false,
  moreBestFeedsError: null
})

/* ------------- Reducers ------------- */
// we're attempting to get Episodes
export const bestFeedsRequest = (state: Object, { token }: Object) =>
  state.merge({ bestFeedsRequesting: true })

export const bestFeedsRequestSuccess = (state: Object, { bestFeeds }: Object) =>
  state.merge({ bestFeedsRequesting: false, bestFeedsError: null, bestFeeds })

export const bestFeedsRequestFailure = (state: Object, { bestFeedsError }: Object) =>
  state.merge({ bestFeedsRequesting: false, bestFeedsError })

export const moreBestFeedsRequest = (state: Object, { token }: Object) =>
  state.merge({ moreBestFeedsRequesting: true })

export const moreBestFeedsSuccess = (state: Object, { moreBestFeeds }: Object) =>
  state.merge({
    moreBestFeedsRequesting: false,
    moreFeedsError: null,
    bestFeeds: [...state.bestFeeds, ...moreBestFeeds]})

export const moreBestFeedsFailure = (state: Object, { moreBestFeedsError }: Object) =>
  state.merge({ moreBestFeedsRequesting: false, moreBestFeedsError })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.BEST_FEEDS_REQUEST]: bestFeedsRequest,
  [Types.BEST_FEEDS_SUCCESS]: bestFeedsRequestSuccess,
  [Types.BEST_FEEDS_FAILURE]: bestFeedsRequestFailure,

  [Types.MORE_BEST_FEEDS_REQUEST]: moreBestFeedsRequest,
  [Types.MORE_BEST_FEEDS_SUCCESS]: moreBestFeedsSuccess,
  [Types.MORE_BEST_FEEDS_FAILURE]: moreBestFeedsFailure
})
