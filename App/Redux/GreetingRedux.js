// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  firstScreenDispatcher: [
    'firstScreen'
  ],
  signUpScreenDispatcher: [
    'signUpScreen'
  ],
  signInScreenDispatcher: [
    'signInScreen'
  ],
  emailScreenDispatcher: [
    'emailScreen'
  ],
  passwordScreenDispatcher: [
    'passwordScreen'
  ],
  nicknameScreenDispatcher: [
    'nicknameScreen'
  ],
  emailPasswordScreenDispatcher: [
    'emailPasswordScreen'
  ],
  lostPasswordScreenDispatcher: [
    'lostPasswordScreen'
  ]
})

export const GreetingTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  firstScreen: false,
  signUpScreen: false,
  signInScreen: false,
  emailScreen: false,
  passwordScreen: false,
  nicknameScreen: false,
  emailPasswordScreen: false,
  lostPasswordScreen: false
})

/* ------------- Reducers ------------- */
// we're attempting to get Episodes
export const firstScreen = (state: Object, { firstScreen }: Object) =>
  state.merge({ firstScreen })
export const signUpScreen = (state: Object, { signUpScreen }: Object) =>
  state.merge({ signUpScreen })
export const signInScreen = (state: Object, { signInScreen }: Object) =>
  state.merge({ signInScreen })
export const emailScreen = (state: Object, { emailScreen }: Object) =>
  state.merge({ emailScreen })
export const passwordScreen = (state: Object, { passwordScreen }: Object) =>
  state.merge({ passwordScreen })
export const nicknameScreen = (state: Object, { nicknameScreen }: Object) =>
  state.merge({ nicknameScreen })
export const emailPasswordScreen = (state: Object, { emailPasswordScreen }: Object) =>
  state.merge({ emailPasswordScreen })
export const lostPasswordScreen = (state: Object, { lostPasswordScreen }: Object) =>
  state.merge({ lostPasswordScreen })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FIRST_SCREEN_DISPATCHER]: firstScreen,
  [Types.SIGN_UP_SCREEN_DISPATCHER]: signUpScreen,
  [Types.SIGN_IN_SCREEN_DISPATCHER]: signInScreen,
  [Types.EMAIL_SCREEN_DISPATCHER]: emailScreen,
  [Types.PASSWORD_SCREEN_DISPATCHER]: passwordScreen,
  [Types.NICKNAME_SCREEN_DISPATCHER]: nicknameScreen,
  [Types.EMAIL_PASSWORD_SCREEN_DISPATCHER]: emailPasswordScreen,
  [Types.LOST_PASSWORD_SCREEN_DISPATCHER]: lostPasswordScreen
})
