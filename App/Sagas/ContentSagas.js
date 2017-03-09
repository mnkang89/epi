import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import ContentActions from '../Redux/ContentRedux'
import { getToken } from '../Services/Auth'
import CameraScreenActions from '../Redux/CameraScreenRedux'

// get active episodeId if not exist, then create new episode
export function * postContent (api, action) {
  console.tron.log('post content saga')
  const token = yield getToken()
  console.tron.log('get token success')
  const { contentType, contentPath, message } = action
  const episodeId = yield getActiveEpisodeIdOrCreateNewEpisode(api, token)
  if (episodeId != null) {
    // dispatch successful email checking
    const state = yield postContentToEpisode(api, token, episodeId, contentType, contentPath, message)
    console.tron.log('state of postContentToEpisode ' + state)
    if (state) {
      yield put(CameraScreenActions.endCameraScreen())
    } else {
      yield put(CameraScreenActions.failToPostContent())
    }
  } else {
    yield put(CameraScreenActions.failToPostContent())
  }
}

export function * postContentToEpisode (api, token, episodeId, contentType, contentPath, message) {
  const response = yield call(api.postContent, token, episodeId, contentType.value, contentPath, message)
  if (response.ok) {
    return true
  } else {
    return false
  }
}

export function * getActiveEpisodeIdOrCreateNewEpisode (api, token) {
  const response = yield call(api.checkUserEpisode, token, true)

  if (response.ok) {
    const episodes = path(['data', 'episodes'], response)
    if (episodes.length === 1) {
      const episodeId = episodes[0].id
      return episodeId
    } else {
      const response = yield call(api.postEpisode, token)
      if (response.ok) {
        const episodes = path(['data', 'episodes'], response)
        return episodes[0].id
      }
    }
  } else {
    return null
  }
}

// attempts to post like
export function * postLike (api, action) {
  console.log('postLike사가워커 진입!!')
  const { token, episodeId } = action
  const response = yield call(api.postLike, token, episodeId)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)
    // const contentId = path(['data', 'contents', 'id'], response)

    yield put(ContentActions.likePostSuccess(response))
  } else {
    console.log('error')
    console.log(response)

    // TODO: 에러케이스 구분
    yield put(ContentActions.likePostFailure('WRONG'))
  }
}

// attempts to delete like
export function * deleteLike (api, action) {
  console.log('deleteLike사가워커 진입!!')
  const { token, episodeId } = action
  const response = yield call(api.deleteLike, token, episodeId)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)
    // const contentId = path(['data', 'contents', 'id'], response)

    yield put(ContentActions.likeDeleteSuccess(response))
  } else {
    console.log('error')
    console.log(response)

    // TODO: 에러케이스 구분
    yield put(ContentActions.likeDeleteFailure('WRONG'))
  }
}
