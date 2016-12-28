import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import ContentActions from '../Redux/ContentRedux'

// attempts to get account
export function * postContent (api, action) {
  console.log('postContent사가워커 진입!!')
  const { token, episodeId, fileType, file, message } = action
  const response = yield call(api.postContent, token, episodeId, fileType, file, message)
  console.log('postContent사가워커 진입!!')

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)
    const contentId = path(['data', 'contents', 'id'], response)

    yield put(ContentActions.userContentPostSuccess(contentId))
  } else {
    console.log('error')
    console.log(response)

    // TODO: 에러케이스 구분
    yield put(ContentActions.userContentPostFailure('WRONG'))
  }
}

// attempts to post like
export function * postLike (api, action) {
  console.log('postLike사가워커 진입!!')
  const { token, contentId } = action
  const response = yield call(api.postLike, token, contentId)

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
  const { token, contentId } = action
  const response = yield call(api.deleteLike, token, contentId)

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
