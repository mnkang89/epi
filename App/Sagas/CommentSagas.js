import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import CommentActions from '../Redux/CommentRedux'

// attempts to post comment
export function * postComment (api, action) {
  console.log('postComment사가워커 진입!!')
  const { token, episodeId, contentId, message } = action
  const response = yield call(api.postComment, token, contentId, message)

  // dispatch successful comment Post
  if (response.ok) {
    console.log('ok')
    console.log(response)

    yield put(CommentActions.commentPostSuccess())
    yield put(CommentActions.commentGet(token, episodeId, contentId))
  } else {
    console.log('error')
    console.log(response)

    // TODO: 에러케이스 구분
    yield put(CommentActions.commentPostFailure('WRONG'))
  }
}

// attempts to get comment
export function * getComment (api, action) {
  console.log('getComment사가워커 진입!!')
  const { token, episodeId } = action
  const response = yield call(api.getComment, token, episodeId)

  // dispatch successful comment Get
  if (response.ok) {
    console.log('ok')
    console.log(response)
    const comments = path(['data', 'comments'], response)

    yield put(CommentActions.commentGetSuccess(comments))
  } else {
    console.log('error')
    console.log(response)

    // TODO: 에러케이스 구분
    yield put(CommentActions.commentGetFailure('WRONG'))
  }
}
