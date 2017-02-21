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

  userEpisodesWithFalseRequest: [
    'token',
    'accountId',
    'active'
  ],
  userEpisodesWithFalseSuccess: [
    'episodesWithFalse'
  ],
  userEpisodesWithFalseFailure: [
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
    'file',
    'message'
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
  ],

  singleEpisodeRequest: [
    'token',
    'episodeId'
  ],
  singleEpisodeSuccess: [
    'singleEpisode'
  ],
  singleEpisodeFailure: [
    'singleError'
  ],

  newEpisodeRequest: [
    'token',
    'episodeId'
  ],
  newEpisodeSuccess: [
    'newEpisode'
  ],
  newEpisodeFailure: [
    'newEpisodeError'
  ],

  moreEpisodesRequest: [
    'token',
    'accountId',
    'withFollowing',
    'before'
  ],
  moreEpisodesSuccess: [
    'moreEpisodes'
  ],
  moreEpisodesFailure: [
    'moreEpisodesError'
  ]
})

export const EpisodeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  episodes: [],
  episodesWithFalse: [],
  episodesRequesting: false,
  episodesWithFalseRequesting: false,
  episodesError: null,

  otherEpisodes: [],
  otherEpisodesRequesting: false,
  otherEpisodesError: null,

  episodeId: null,
  episodePosting: false,
  error: null,

  episodePutting: false,

  singleEpisode: [],
  singleEpisodeRequesting: false,
  singleError: null,

  newEpisode: [],
  newEpisodeRequesting: false,
  newEpisodeError: null,

  moreEpisodes: [],
  moreEpisodesRequesting: false,
  moreEpisodesError: null
})

/* ------------- Reducers ------------- */
// we're attempting to get Episodes
export const userEpisodesRequest = (state: Object, { token, accountId, active }: Object) =>
  state.merge({ episodesRequesting: true })

export const userEpisodesSuccess = (state: Object, { episodes }: Object) =>
  state.merge({ episodesRequesting: false, episodesError: null, episodes })

export const userEpisodesFailure = (state: Object, { episodesError }: Object) =>
  state.merge({ episodesRequesting: false, episodesError })

// only my episodes
export const userEpisodesWithFalseRequest = (state: Object, { token, accountId, active }: Object) =>
  state.merge({ episodesWithFalseRequesting: true })

export const userEpisodesWithFalseSuccess = (state: Object, { episodesWithFalse }: Object) =>
  state.merge({ episodesWithFalseRequesting: false, episodesError: null, episodesWithFalse })

export const userEpisodesWithFalseFailure = (state: Object, { episodesError }: Object) =>
  state.merge({ episodesWithFalseRequesting: false, episodesError })

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

// we're attempting to get Episode
export const singleEpisodeRequest = (state: Object, { token }: Object) =>
  state.merge({ singleEpisodeRequesting: true })

export const singleEpisodeSuccess = (state: Object, { singleEpisode }: Object) =>
  state.merge({ singleEpisodeRequesting: false, singleError: null, singleEpisode })

export const singleEpisodeFailure = (state: Object, { singleError }: Object) =>
  state.merge({ singleEpisodeRequesting: false, singleError })

// we're attempting to get new Episode
export const newEpisodeRequest = (state: Object, { token }: Object) =>
  state.merge({ newEpisodeRequesting: true })

export const newEpisodeSuccess = (state: Object, { newEpisode }: Object) => {
  const episodes = state.episodes
  let insertIndex
  let nextIndex

  for (let i = 0; i < episodes.length; i++) {
    if (episodes[i].episode.id === newEpisode[0].id) {
      insertIndex = i
    }
  }
  nextIndex = insertIndex + 1

  return state.merge({
    newEpisodeRequesting: false,
    newEpisodeError: null,
    episodes: [
      ...episodes.slice(0, insertIndex),
      {...episodes[insertIndex], episode: newEpisode[0]},
      ...episodes.slice(nextIndex)]
  })
}

export const newEpisodeFailure = (state: Object, { newEpisodeError }: Object) =>
  state.merge({ newEpisodeRequesting: false, newEpisodeError })

// moreEpisodes
export const moreEpisodesRequest = (state: Object, { token }: Object) =>
  state.merge({ moreEpisodesRequesting: true })

export const moreEpisodesSuccess = (state: Object, { moreEpisodes }: Object) =>
  state.merge({
    moreEpisodesRequesting: false,
    moreEpisodeError: null,
    episodes: [...state.episodes, ...moreEpisodes]})

export const moreEpisodesFailure = (state: Object, { moreEpisodesError }: Object) =>
  state.merge({ moreEpisodesRequesting: false, moreEpisodesError })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_EPISODES_REQUEST]: userEpisodesRequest,
  [Types.USER_EPISODES_SUCCESS]: userEpisodesSuccess,
  [Types.USER_EPISODES_FAILURE]: userEpisodesFailure,

  [Types.USER_EPISODES_WITH_FALSE_REQUEST]: userEpisodesWithFalseRequest,
  [Types.USER_EPISODES_WITH_FALSE_SUCCESS]: userEpisodesWithFalseSuccess,
  [Types.USER_EPISODES_WITH_FALSE_FAILURE]: userEpisodesWithFalseFailure,

  [Types.OTHER_EPISODES_REQUEST]: otherEpisodesRequest,
  [Types.OTHER_EPISODES_SUCCESS]: otherEpisodesSuccess,
  [Types.OTHER_EPISODES_FAILURE]: otherEpisodesFailure,

  [Types.USER_EPISODE_POST]: userEpisodePost,
  [Types.USER_EPISODE_POST_SUCCESS]: userEpisodePostSuccess,
  [Types.USER_EPISODE_POST_FAILURE]: userEpisodePostFailure,

  [Types.USER_EPISODE_PUT]: userEpisodePut,
  [Types.USER_EPISODE_PUT_SUCCESS]: userEpisodePutSuccess,
  [Types.USER_EPISODE_PUT_FAILURE]: userEpisodePutFailure,

  [Types.SINGLE_EPISODE_REQUEST]: singleEpisodeRequest,
  [Types.SINGLE_EPISODE_SUCCESS]: singleEpisodeSuccess,
  [Types.SINGLE_EPISODE_FAILURE]: singleEpisodeFailure,

  [Types.NEW_EPISODE_REQUEST]: newEpisodeRequest,
  [Types.NEW_EPISODE_SUCCESS]: newEpisodeSuccess,
  [Types.NEW_EPISODE_FAILURE]: newEpisodeFailure,

  [Types.MORE_EPISODES_REQUEST]: moreEpisodesRequest,
  [Types.MORE_EPISODES_SUCCESS]: moreEpisodesSuccess,
  [Types.MORE_EPISODES_FAILURE]: moreEpisodesFailure
})
