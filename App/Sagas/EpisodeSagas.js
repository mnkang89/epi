import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import EpisodeActions from '../Redux/EpisodeRedux'
import ContentActions from '../Redux/ContentRedux'
import CameraScreenActions from '../Redux/CameraScreenRedux'
import { getToken } from '../Services/Auth'

// attempts to get episodes
export function * userEpisodes (api, action) {
  console.log('유저 에피소드 사가 진입')
  const { token, accountId, active } = action
  const response = yield call(api.requestUserFeeds, token, accountId, active)

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

// attempts to get episodes with false
export function * userEpisodesWithFalse (api, action) {
  console.log('유저 에피소드 위드 폴스 사가 진입')
  const { token, accountId, active } = action
  const response = yield call(api.requestUserFeeds, token, accountId, active)
  console.log(response)

  if (response.ok) {
    console.log('ok')
    console.log(response)
    const episodesWithFalse = path(['data', 'items'], response)

    yield put(EpisodeActions.userEpisodesWithFalseSuccess(episodesWithFalse))
  } else {
    console.log('error')
    console.log(response)

    yield put(EpisodeActions.userEpisodesWithFalseFailure('WRONG'))
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

    yield put(EpisodeActions.otherEpisodesObjectAdd(accountId, episodes))
  } else {
    console.log('error')
    console.log(response)
    yield put(EpisodeActions.otherEpisodesFailure('WRONG'))
  }
}

export function * moreFeeds (api, action) {
  console.log('모어 피드 사가 진입')
  const { token, accountId, withFollowing, before } = action
  const response = yield call(api.requestMoreFeeds, token, accountId, withFollowing, before)
  // console.log('비포')
  // console.log(before)
  // console.log('비포')

  if (response.ok) {
    const episodes = path(['data', 'items'], response)

    yield put(EpisodeActions.moreFeedsSuccess(episodes))
  } else {
    console.log('error')
    console.log(response)
    yield put(EpisodeActions.moreFeedsFailure('WRONG'))
  }
}

export function * moreEpisodes (api, action) {
  console.log('모어 에피소드 사가 진입')
  const { token, accountId, withFollowing, before } = action
  const response = yield call(api.requestMoreFeeds, token, accountId, withFollowing, before)
  console.log(response)

  if (response.ok) {
    console.log('ok')
    console.log(response)
    const episodes = path(['data', 'items'], response)

    yield put(EpisodeActions.moreEpisodesSuccess(episodes))
  } else {
    console.log('error')
    console.log(response)
    yield put(EpisodeActions.moreEpisodesFailure('WRONG'))
  }
}

export function * moreOtherEpisodes (api, action) {
  console.log('모어 아더 에피소드 사가 진입')
  const { token, accountId, withFollowing, before } = action
  console.log(token)
  console.log(accountId)
  console.log(withFollowing)
  console.log(before)
  const response = yield call(api.requestMoreOtherFeeds, token, accountId, withFollowing, before)
  console.log(response)

  if (response.ok) {
    console.log('ok')
    console.log(response)
    const episodes = path(['data', 'items'], response)

    yield put(EpisodeActions.moreOtherEpisodesSuccess(accountId, episodes))
  } else {
    console.log('error')
    console.log(response)
    yield put(EpisodeActions.moreOtherEpisodesFailure('WRONG'))
  }
}

// attempts to post episode
export function * postEpisode (api, action) {
  console.log('postEpisode사가워커 진입!!')
  const { token, fileType, file, message } = action
  const response = yield call(api.postEpisode, token)
  console.log(action)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)

    const episodes = path(['data', 'episodes'], response)
    const episodeId = episodes[0].id

    yield put(EpisodeActions.userEpisodePostSuccess(episodeId))
    yield put(ContentActions.userContentPost(token, episodeId, fileType, file, message))
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

export function * deactivateEpisode (api, action) {
  const token = yield getToken()
  const { activeEpisodeId } = action
  const response = yield call(api.putEpisode, token, activeEpisodeId, false)

  if (response.ok) {
    yield put(CameraScreenActions.setActiveEpisode(null))
  } else {
    console.log('fail to deactivate episode')
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

// attempts to get new episode
export function * newEpisode (api, action) {
  console.log('뉴 에피소드 사가 진입')
  const { token, episodeId } = action
  const response = yield call(api.requestSingleEpisode, token, episodeId)

  if (response.ok) {
    console.log('ok')
    console.log(response)
    const newEpisode = path(['data', 'episodes'], response)

    yield put(EpisodeActions.newEpisodeSuccess(newEpisode))
  } else {
    console.log('error')
    console.log(response)
    yield put(EpisodeActions.newEpisodeFailure('WRONG'))
  }
}

export function * newEpisodeWithFalse (api, action) {
  console.log('뉴 에피소드 위드 폻스 사가 진입')
  const { token, episodeId } = action
  const response = yield call(api.requestSingleEpisode, token, episodeId)

  if (response.ok) {
    console.log('ok')
    console.log(response)
    const newEpisode = path(['data', 'episodes'], response)

    yield put(EpisodeActions.newEpisodeWithFalseSuccess(newEpisode))
  } else {
    console.log('error')
    console.log(response)
    yield put(EpisodeActions.newEpisodeWithFalseFailure('WRONG'))
  }
}

export function * newOtherEpisode (api, action) {
  console.log('뉴 아더 에피소드 사가 진입')
  const { token, accountId, episodeId } = action
  const response = yield call(api.requestSingleEpisode, token, accountId, episodeId)
  console.log(accountId)
  console.log(episodeId)

  if (response.ok) {
    console.log('ok')
    console.log(response)
    const newEpisode = path(['data', 'episodes'], response)

    yield put(EpisodeActions.newOtherEpisodeSuccess(accountId, newEpisode))
  } else {
    console.log('error')
    console.log(response)
    yield put(EpisodeActions.newOtherEpisodeFailure('WRONG'))
  }
}
