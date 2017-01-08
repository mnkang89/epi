import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import EpisodeActions from '../Redux/EpisodeRedux'
import ContentActions from '../Redux/ContentRedux'

// attempts to get episodes
export function * userEpisodes (api, action) {
  console.log('유저 에피소드 사가 진입')
  const { token, accountId, active } = action
  const response = yield call(api.requestUserFeeds, token, accountId, active)
  console.log(response)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)
    const episodes = path(['data', 'items'], response)

    yield put(EpisodeActions.userEpisodesSuccess(episodes))
  } else {
    console.log('error')
    console.log(response)
    yield put(EpisodeActions.userEpisodesFailure('WRONG'))
  }
}

// attempts to get episodes
export function * otherEpisodes (api, action) {
  console.log('other 에피소드 사가 진입')
  const { token, accountId, active } = action
  const response = yield call(api.requestOtherFeeds, token, accountId, active)
  console.log(response)

  // dispatch successful email checking
  if (response.ok) {
    console.log('other ok')
    console.log(response)
    const episodes = path(['data', 'items'], response)

    yield put(EpisodeActions.otherEpisodesSuccess(episodes))
  } else {
    console.log('error')
    console.log(response)
    yield put(EpisodeActions.otherEpisodesFailure('WRONG'))
  }
}

// attempts to post episode
export function * postEpisode (api, action) {
  console.log('postEpisode사가워커 진입!!')
  const { token, fileType, file } = action
  const response = yield call(api.postEpisode, token)
  console.log(action)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)

    const episodes = path(['data', 'episodes'], response)
    const episodeId = episodes[0].id

    yield put(EpisodeActions.userEpisodePostSuccess(episodeId))
    yield put(ContentActions.userContentPost(token, episodeId, fileType, file))
  } else {
    console.log('error')
    console.log(response)
    // TODO: 에러케이스 구분
    yield put(EpisodeActions.userEpisodePostFailure('WRONG'))
  }
}

export function * putEpisode (api, action) {
  console.log('putEpisode사가워커 진입!!')
  const { token, episodeId, active } = action
  const response = yield call(api.putEpisode, token, episodeId, active)
  console.log(action)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)

    const episodes = path(['data', 'episodes'], response)
    const episodeId = episodes[0].id

    yield put(EpisodeActions.userEpisodePutSuccess(episodeId))
  } else {
    console.log('error')
    console.log(response)
    // TODO: 에러케이스 구분
    yield put(EpisodeActions.userEpisodePutFailure('WRONG'))
  }
}

// attempts to get single episode
export function * singleEpisode (api, action) {
  console.log('싱글 에피소드 사가 진입')
  const { token, episodeId } = action
  const response = yield call(api.requestSingleEpisode, token, episodeId)

  if (response.ok) {
    console.log('ok')
    console.log(response)
    const singleEpisode = path(['data', 'episodes'], response)

    yield put(EpisodeActions.singleEpisodeSuccess(singleEpisode))
  } else {
    console.log('error')
    console.log(response)
    yield put(EpisodeActions.singleEpisodeFailure('WRONG'))
  }
}
