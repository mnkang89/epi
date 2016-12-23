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

  otherEpisodesRequest: [
    'token',
    'accountId',
    'active'
  ],
  otherEpisodesSuccess: [
    'otherEpisodes'
  ],
  otherEpisodesFailure: [
    'otherEpisodesError'
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

  otherEpisodes: [],
  otherEpisodesRequesting: true,
  otherEpisodesError: null,

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

// other user episodes
export const otherEpisodesRequest = (state: Object, { token, accountId, active }: Object) =>
  state.merge({ otherEpisodesRequesting: true })

export const otherEpisodesSuccess = (state: Object, { otherEpisodes }: Object) =>
  state.merge({ otherEpisodesRequesting: false, otherEpisodesError: null, otherEpisodes })

export const otherEpisodesFailure = (state: Object, { otherEpisodesError }: Object) =>
  state.merge({ otherEpisodesRequesting: false, otherEpisodesError })

// we're attempting to check posting Episode
export const userEpisodePost = (state: Object, { token }: Object) =>
  state.merge({ episodePosting: true })

export const userEpisodePostSuccess = (state: Object, { episodeId }: Object) =>
  state.merge({ episodePosting: false, error: null, episodeId })

export const userEpisodePostFailure = (state: Object, { error }: Object) =>
  state.merge({ episodePosting: false, error })

// we're attempting to check posting Episode
export const userEpisodePut = (state: Object, { token }: Object) =>
  state.merge({ episodePutting: true })

export const userEpisodePutSuccess = (state: Object, { episodeId }: Object) =>
  state.merge({ episodePutting: false, error: null, episodeId })

export const userEpisodePutFailure = (state: Object, { error }: Object) =>
  state.merge({ episodePutting: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_EPISODES_REQUEST]: userEpisodesRequest,
  [Types.USER_EPISODES_SUCCESS]: userEpisodesSuccess,
  [Types.USER_EPISODES_FAILURE]: userEpisodesFailure,

  [Types.OTHER_EPISODES_REQUEST]: otherEpisodesRequest,
  [Types.OTHER_EPISODES_SUCCESS]: otherEpisodesSuccess,
  [Types.OTHER_EPISODES_FAILURE]: otherEpisodesFailure,

  [Types.USER_EPISODE_POST]: userEpisodePost,
  [Types.USER_EPISODE_POST_SUCCESS]: userEpisodePostSuccess,
  [Types.USER_EPISODE_POST_FAILURE]: userEpisodePostFailure,

  [Types.USER_EPISODE_PUT]: userEpisodePut,
  [Types.USER_EPISODE_PUT_SUCCESS]: userEpisodePutSuccess,
  [Types.USER_EPISODE_PUT_FAILURE]: userEpisodePutFailure
})
