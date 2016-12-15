import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import EpisodeActions from '../Redux/EpisodeRedux'
import ContentActions from '../Redux/ContentRedux'

// attempts to get account
export function * postEpisode (api, action) {
  console.log('postEpisode사가워커 진입!!')
  const { token, fileType, file } = action
  const response = yield call(api.postEpisode, token)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)
    const episodeId = path(['data', 'episodes', 'id'], response)

    yield put(EpisodeActions.userEpisodePostSuccess(episodeId))
    yield put(ContentActions.userContentPost(token, episodeId, fileType, file))
  } else {
    console.log('error')
    console.log(response)
    // TODO: 에러케이스 구분
    yield put(EpisodeActions.userEpisodePostFailure('WRONG'))
  }
}
