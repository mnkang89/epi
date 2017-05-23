// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  screenRegister: [
    'beforeScreen'
  ],
  feedTabTouched: [
  ]
})

export const ScreenTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  beforeScreen: 'homeTab',
  pastScreen: '',
  feedTrigger: false
})

/* ------------- Reducers ------------- */
// we're attempting to get Episodes
export const registerScreen = (state: Object, { beforeScreen }: Object) =>
  state.merge({ beforeScreen, pastScreen: state.beforeScreen })

export const touchedFeedTab = (state: Object) =>
  state.merge({ feedTrigger: !state.feedTrigger })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SCREEN_REGISTER]: registerScreen,
  [Types.FEED_TAB_TOUCHED]: touchedFeedTab
})
