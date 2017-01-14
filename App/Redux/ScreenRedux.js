// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  screenRegister: [
    'beforeScreen'
  ]
})

export const ScreenTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  beforeScreen: 'homeTab'
})

/* ------------- Reducers ------------- */
// we're attempting to get Episodes
export const registerScreen = (state: Object, { beforeScreen }: Object) =>
  state.merge({ beforeScreen })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SCREEN_REGISTER]: registerScreen
})
