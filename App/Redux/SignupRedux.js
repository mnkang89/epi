// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  emailCheck: ['email'],
  emailSuccess: ['email'],
  emailFailure: ['error'],

  passwordRequest: ['password', 'passwordCheck'],
  passwordSuccess: ['password'],
  passwordFailure: ['error'],

  nicknameCheck: ['nickname'],
  nicknameSuccess: ['nickname'],
  nicknameFailure: ['error'],

  signupRequest: ['email', 'password', 'nickname'],
  signupSuccess: ['email'],
  signupFailure: ['error']
})

export const SignupTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  email: null,
  password: null,
  passwordCheck: null,
  nickname: null,
  error: null,
  checking: false
})

/* ------------- Reducers ------------- */

// we're attempting to check email
export const email = (state: Object) =>
  state.merge({
    checking: true
  })

// Valid email
export const emailValid = (state: Object, { email }: Object) =>
  state.merge({
    checking: false,
    error: null,
    email
  })

// Invalid email
export const emailInvalid = (state: Object, { error }: Object) =>
  state.merge({
    checking: false,
    error
  })

// we're attempting to check password
export const password = (state: Object, { password, passwordCheck }: Object) =>
  state.merge({
    checking: true,
    password,
    passwordCheck
  })

// Valid password
export const passwordValid = (state: Object, { password }: Object) =>
  state.merge({
    checking: false,
    error: null,
    password
  })

// Invalid password
export const passwordInvalid = (state: Object, { error }: Object) =>
  state.merge({
    checking: false,
    error
  })

// we're attempting to check nickname
export const nickname = (state: Object) =>
  state.merge({
    checking: true
  })

// Valid nickname
export const nickValid = (state: Object, { nickname }: Object) =>
  state.merge({
    checking: false,
    error: null,
    email
  })

// Invalid nickname
export const nickInvalid = (state: Object, { error }: Object) =>
  state.merge({
    checking: false,
    error
  })

// we're attempting to check signup
export const request = (state: Object) => INITIAL_STATE

// we've successfully signup
export const success = (state: Object, { username }: Object) =>
  state.merge({ fetching: false, error: null, username })

// we've had a problem signup
export const failure = (state: Object, { error }: Object) =>
  state.merge({ fetching: false, error })

/*
export const success = (state: Object, action: Object) => {
  const { temperature } = action
  return state.merge({ fetching: false, error: null, temperature })
}
*/
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.EMAIL_CHECK]: email,
  [Types.EMAIL_SUCCESS]: emailValid,
  [Types.EMAIL_FAILURE]: emailInvalid,

  [Types.PASSWORD_REQUEST]: password,
  [Types.PASSWORD_SUCCESS]: passwordValid,
  [Types.PASSWORD_FAILURE]: passwordInvalid,

  [Types.NICKNAME_CHECK]: nickname,
  [Types.NICKNAME_SUCCESS]: nickValid,
  [Types.NICKNAME_FAILURE]: nickInvalid,

  [Types.SIGNUP_REQUEST]: request,
  [Types.SIGNUP_SUCCESS]: success,
  [Types.SIGNUP_FAILURE]: failure
})
