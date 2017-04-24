// import { createReducer, createActions } from 'reduxsauce'
// import Immutable from 'seamless-immutable'
//
// /* ------------- Types and Action Creators ------------- */
//
// const { Types, Creators } = createActions({
//   loginRequest: ['username', 'password'],
//   loginSuccess: ['username'],
//   loginFailure: ['error'],
//   logout: null
// })
//
// export const LoginTypes = Types
// export default Creators
//
// /* ------------- Initial State ------------- */
//
// export const INITIAL_STATE = Immutable({
//   username: null,
//   error: null,
//   fetching: false
// })
//
// /* ------------- Reducers ------------- */
//
// // we're attempting to login
// export const request = (state) => state.merge({ fetching: true })
//
// // we've successfully logged in
// export const success = (state, { username }) =>
//   state.merge({ fetching: false, error: null, username })
//
// // we've had a problem logging in
// export const failure = (state, { error }) =>
//   state.merge({ fetching: false, error })
//
// // we've logged out
// export const logout = (state) => INITIAL_STATE
//
// /* ------------- Hookup Reducers To Types ------------- */
//
// export const reducer = createReducer(INITIAL_STATE, {
//   [Types.LOGIN_REQUEST]: request,
//   [Types.LOGIN_SUCCESS]: success,
//   [Types.LOGIN_FAILURE]: failure,
//   [Types.LOGOUT]: logout
// })
//
// /* ------------- Selectors ------------- */
//
// // Is the current user logged in?
// export const isLoggedIn = (loginState) => loginState.username !== null
//
//

// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['email', 'password'],
  loginSuccess: ['email'],
  loginFailure: ['error'],
  logout: null
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  email: null,
  password: null,
  token: null,
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state: Object, { email, password }: Object) => state.merge({ fetching: true, email, password })

// we've successfully logged in
export const success = (state: Object, { email }: Object) =>
  state.merge({ fetching: false, error: null, email })

// we've had a problem logging in
export const failure = (state: Object, { error }: Object) =>
  state.merge({ fetching: false, error })

// we've logged out
export const logout = (state: Object) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.LOGOUT]: logout
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isLoggedIn = (loginState: Object) => loginState.username !== null
