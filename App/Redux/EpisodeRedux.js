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

  initOtherEpisodes: [
  ],

  otherEpisodesObjectAdd: [
    'otherId',
    'otherEpisodes'
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

  newEpisodeWithFalseRequest: [
    'token',
    'episodeId'
  ],
  newEpisodeWithFalseSuccess: [
    'newEpisode'
  ],
  newEpisodeWithFalseFailure: [
    'newEpisodeError'
  ],

  newOtherEpisodeRequest: [
    'token',
    'accountId',
    'episodeId'
  ],
  newOtherEpisodeSuccess: [
    'otherId',
    'newEpisode'
  ],
  newOtherEpisodeFailure: [
    'newEpisodeError'
  ],

  moreFeedsRequest: [
    'token',
    'accountId',
    'withFollowing',
    'before'
  ],
  moreFeedsSuccess: [
    'moreFeeds'
  ],
  moreFeedsFailure: [
    'moreFeedsError'
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
  ],

  moreOtherEpisodesRequest: [
    'token',
    'accountId',
    'withFollowing',
    'before'
  ],
  moreOtherEpisodesSuccess: [
    'otherId',
    'moreOtherEpisodes'
  ],
  moreOtherEpisodesFailure: [
    'moreOtherEpisodesError'
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

  otherEpisodesObject: {},

  episodeId: null,
  episodePosting: false,
  error: null,

  episodePutting: false,

  singleEpisode: [],
  singleEpisodeRequesting: false,
  singleError: null,

  newEpisode: [],
  newEpisodeRequesting: false,
  newOtherEpisodeRequesting: false,
  newEpisodeError: null,

  moreFeeds: [],
  moreFeedsRequesting: false,
  moreFeedsError: null,

  moreEpisodes: [],
  moreEpisodesRequesting: false,
  moreEpisodesError: null,

  moreOtherEpisodes: [],
  moreOtherEpisodesRequesting: false,
  moreOtherEpisodesError: null
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

// init other user episodes
export const otherEpisodesInit = (state: Object) =>
  state.merge({ otherEpisodes: [] })

// other episodes object
// bracket notation is used to make variable as a key name
export const otherEpisodesObjectAdd = (state: Object, { otherId, otherEpisodes }: Object) => {
  if (Object.keys(state.otherEpisodesObject).includes(otherId.toString())) {
    console.log('해당 에피소드오브젝트 이미 존재')
    return state.merge({})
  } else {
    console.log('해당 에피소드오브젝트 머지 성공')
    return state.merge({ otherEpisodesObject: {...state.otherEpisodesObject, [otherId]: otherEpisodes} })
  }
}

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
  console.log('뉴에피소드')
  console.log(newEpisode)
  console.log('뉴에피소드')

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

// we're attempting to get new EpisodesWithFalse
export const newEpisodeWithFalseRequest = (state: Object, { token }: Object) =>
  state.merge({ newEpisodeRequesting: true })

export const newEpisodeWithFalseSuccess = (state: Object, { newEpisode }: Object) => {
  const episodesWithFalse = state.episodesWithFalse
  let insertIndex
  let nextIndex

  for (let i = 0; i < episodesWithFalse.length; i++) {
    if (episodesWithFalse[i].episode.id === newEpisode[0].id) {
      insertIndex = i
    }
  }
  nextIndex = insertIndex + 1

  return state.merge({
    newEpisodeRequesting: false,
    newEpisodeError: null,
    episodesWithFalse: [
      ...episodesWithFalse.slice(0, insertIndex),
      {...episodesWithFalse[insertIndex], episode: newEpisode[0]},
      ...episodesWithFalse.slice(nextIndex)]
  })
}

export const newEpisodeWithFalseFailure = (state: Object, { newEpisodeError }: Object) =>
  state.merge({ newOtherEpisodeRequesting: false, newEpisodeError })

// we're attempting to get new otherEpisode
export const newOtherEpisodeRequest = (state: Object, { token }: Object) =>
  state.merge({ newOtherEpisodeRequesting: true })

export const newOtherEpisodeSuccess = (state: Object, { otherId, newEpisode }: Object) => {
  let insertIndex
  let nextIndex
  console.log('아더아이디')
  console.log(otherId)
  console.log(state.otherEpisodesObject[otherId])
  for (let i = 0; i < state.otherEpisodesObject[otherId.toString()].length; i++) {
    if (state.otherEpisodesObject[otherId.toString()][i].episode.id === newEpisode[0].id) {
      insertIndex = i
    }
  }
  nextIndex = insertIndex + 1

  return state.merge({
    newOtherEpisodeRequesting: false,
    newEpisodeError: null,
    otherEpisodesObject: {
      ...state.otherEpisodesObject,
      [otherId]: [
        ...state.otherEpisodesObject[otherId.toString()].slice(0, insertIndex),
        {...state.otherEpisodesObject[otherId.toString()][insertIndex], episode: newEpisode[0]},
        ...state.otherEpisodesObject[otherId.toString()].slice(nextIndex)
      ]
    }
  })
}

export const newOtherEpisodeFailure = (state: Object, { newEpisodeError }: Object) =>
  state.merge({ newEpisodeRequesting: false, newEpisodeError })

// moreFeeds(FeedScreen)
export const moreFeedsRequest = (state: Object, { token }: Object) =>
  state.merge({ moreFeedsRequesting: true })

export const moreFeedsSuccess = (state: Object, { moreFeeds }: Object) =>
  state.merge({
    moreFeedsRequesting: false,
    moreFeedsError: null,
    episodes: [...state.episodes, ...moreFeeds]})

export const moreFeedsFailure = (state: Object, { moreFeedsError }: Object) =>
  state.merge({ moreFeedsRequesting: false, moreFeedsError })

// moreEpisodes(ProfileScreen)
export const moreEpisodesRequest = (state: Object, { token }: Object) =>
  state.merge({ moreEpisodesRequesting: true })

export const moreEpisodesSuccess = (state: Object, { moreEpisodes }: Object) =>
  state.merge({
    moreEpisodesRequesting: false,
    moreEpisodesError: null,
    episodesWithFalse: [...state.episodesWithFalse, ...moreEpisodes]})

export const moreEpisodesFailure = (state: Object, { moreEpisodesError }: Object) =>
  state.merge({ moreEpisodesRequesting: false, moreEpisodesError })

// moreOtherEpisodes(UserProfileScreen)
export const moreOtherEpisodesRequest = (state: Object, { token }: Object) =>
  state.merge({ moreOtherEpisodesRequesting: true })

export const moreOtherEpisodesSuccess = (state: Object, { otherId, moreOtherEpisodes }: Object) =>
  state.merge({
    moreOtherEpisodesRequesting: false,
    moreOtherEpisodesError: null,
    otherEpisodesObject: {
      ...state.otherEpisodesObject,
      [otherId]: [...state.otherEpisodesObject[otherId], ...moreOtherEpisodes]
    }
  })

export const moreOtherEpisodesFailure = (state: Object, { moreOtherEpisodesError }: Object) =>
  state.merge({ moreOtherEpisodesRequesting: false, moreOtherEpisodesError })

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

  [Types.OTHER_EPISODES_INIT]: otherEpisodesInit,
  [Types.OTHER_EPISODES_OBJECT_ADD]: otherEpisodesObjectAdd,

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

  [Types.NEW_EPISODE_WITH_FALSE_REQUEST]: newEpisodeWithFalseRequest,
  [Types.NEW_EPISODE_WITH_FALSE_SUCCESS]: newEpisodeWithFalseSuccess,
  [Types.NEW_EPISODE_WITH_FALSE_FAILURE]: newEpisodeWithFalseFailure,

  [Types.NEW_OTHER_EPISODE_REQUEST]: newOtherEpisodeRequest,
  [Types.NEW_OTHER_EPISODE_SUCCESS]: newOtherEpisodeSuccess,
  [Types.NEW_OTHER_EPISODE_FAILURE]: newOtherEpisodeFailure,

  [Types.MORE_FEEDS_REQUEST]: moreFeedsRequest,
  [Types.MORE_FEEDS_SUCCESS]: moreFeedsSuccess,
  [Types.MORE_FEEDS_FAILURE]: moreFeedsFailure,

  [Types.MORE_EPISODES_REQUEST]: moreEpisodesRequest,
  [Types.MORE_EPISODES_SUCCESS]: moreEpisodesSuccess,
  [Types.MORE_EPISODES_FAILURE]: moreEpisodesFailure,

  [Types.MORE_OTHER_EPISODES_REQUEST]: moreOtherEpisodesRequest,
  [Types.MORE_OTHER_EPISODES_SUCCESS]: moreOtherEpisodesSuccess,
  [Types.MORE_OTHER_EPISODES_FAILURE]: moreOtherEpisodesFailure
})
