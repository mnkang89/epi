// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  tokenRequest: ['token'],
  idRequest: ['id']
})

export const TokenTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  token: null,
  id: null
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state: Object, { token }: Object) => state.merge({ token })
export const idrequest = (state: Object, { id }: Object) => state.merge({ id })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TOKEN_REQUEST]: request,
  [Types.ID_REQUEST]: idrequest
})
