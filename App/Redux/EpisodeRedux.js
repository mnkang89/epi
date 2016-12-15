// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userEpisodePost: [
    'token',
    'filetype',
    'file'
  ],
  userEpisodePostSuccess: [
    'episodeId'
  ],
  userEpisodePostFailure: [
    'error'
  ]
})

export const EpisodeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  episodeId: null,
  episodePosting: false,
  error: null
})

/* ------------- Reducers ------------- */

// we're attempting to check posting Episode
export const userEpisodePost = (state: Object, { token }: Object) =>
  state.merge({ episodePosting: true })

// we've successfully posting Episode
export const userEpisodePostSuccess = (state: Object, { episodeId }: Object) =>
  state.merge({ episodePosting: false, error: null, episodeId })

// we've had a problem posting Episode
export const userEpisodePostFailure = (state: Object, { error }: Object) =>
  state.merge({ episodePosting: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_EPISODE_POST]: userEpisodePost,
  [Types.USER_EPISODE_POST_SUCCESS]: userEpisodePostSuccess,
  [Types.USER_EPISODE_POST_FAILURE]: userEpisodePostFailure
})
