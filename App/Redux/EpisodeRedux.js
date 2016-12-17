// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userEpisodesRequest: [
    'token',
    'accountId',
    'active'
  ],
  userEpisodesSuccess: [
    'episodes'
  ],
  userEpisodesFailure: [
    'episodesError'
  ],

  userEpisodePost: [
    'token',
    'fileType',
    'file'
  ],
  userEpisodePostSuccess: [
    'episodeId'
  ],
  userEpisodePostFailure: [
    'error'
  ],

  userEpisodePut: [
    'token',
    'episodeId',
    'active'
  ],
  userEpisodePutSuccess: [
    'episodeId'
  ],
  userEpisodePutFailure: [
    'error'
  ]
})

export const EpisodeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  episodes: [],
  episodesRequesting: true,
  episodesError: null,

  episodeId: null,
  episodePosting: false,
  error: null,

  episodePutting: false
})

/* ------------- Reducers ------------- */
// we're attempting to get Episodes
export const userEpisodesRequest = (state: Object, { token, accountId, active }: Object) => INITIAL_STATE

export const userEpisodesSuccess = (state: Object, { episodes }: Object) =>
  state.merge({ episodesRequesting: false, episodesError: null, episodes })

export const userEpisodesFailure = (state: Object, { episodesError }: Object) =>
  state.merge({ episodesRequesting: false, episodesError })

// we're attempting to check posting Episode
export const userEpisodePost = (state: Object, { token }: Object) =>
  state.merge({ episodePosting: true })

// we've successfully posting Episode
export const userEpisodePostSuccess = (state: Object, { episodeId }: Object) =>
  state.merge({ episodePosting: false, error: null, episodeId })

// we've had a problem posting Episode
export const userEpisodePostFailure = (state: Object, { error }: Object) =>
  state.merge({ episodePosting: false, error })

// we're attempting to check posting Episode
export const userEpisodePut = (state: Object, { token }: Object) =>
  state.merge({ episodePutting: true })

// we've successfully posting Episode
export const userEpisodePutSuccess = (state: Object, { episodeId }: Object) =>
  state.merge({ episodePutting: false, error: null, episodeId })

// we've had a problem posting Episode
export const userEpisodePutFailure = (state: Object, { error }: Object) =>
  state.merge({ episodePutting: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_EPISODES_REQUEST]: userEpisodesRequest,
  [Types.USER_EPISODES_SUCCESS]: userEpisodesSuccess,
  [Types.USER_EPISODES_FAILURE]: userEpisodesFailure,

  [Types.USER_EPISODE_POST]: userEpisodePost,
  [Types.USER_EPISODE_POST_SUCCESS]: userEpisodePostSuccess,
  [Types.USER_EPISODE_POST_FAILURE]: userEpisodePostFailure,

  [Types.USER_EPISODE_PUT]: userEpisodePut,
  [Types.USER_EPISODE_PUT_SUCCESS]: userEpisodePutSuccess,
  [Types.USER_EPISODE_PUT_FAILURE]: userEpisodePutFailure
})
