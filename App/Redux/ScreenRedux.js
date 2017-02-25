// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  isFirstLogin: [
    'firstLogin'
  ],
  screenRegister: [
    'beforeScreen'
  ]
})

export const ScreenTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  firstLogin: false,
  beforeScreen: 'homeTab'
})

/* ------------- Reducers ------------- */
// we're attempting to get Episodes
export const isFirstLogin = (state: Object, { firstLogin }: Object) =>
  state.merge({ firstLogin })

export const registerScreen = (state: Object, { beforeScreen }: Object) =>
  state.merge({ beforeScreen })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.IS_FIRST_LOGIN]: isFirstLogin,
  [Types.SCREEN_REGISTER]: registerScreen
})
