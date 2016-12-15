import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import ContentActions from '../Redux/ContentRedux'

// attempts to get account
export function * postContent (api, action) {
  console.log('postContent사가워커 진입!!')
  const { token, episodeId, fileType, file } = action
  const response = yield call(api.postContent, token, episodeId, fileType, file)
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
