import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import AccountActions from '../Redux/AccountRedux'

// attempts to get account
export function * account (api, action) {
  const { token, accountId } = action
  const response = yield call(api.requestAccount, token, accountId)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)
    const accountId = path(['data', 'id'], response)
    const email = path(['data', 'email'], response)
    const nickname = path(['data', 'nickname'], response)
    const followerCount = path(['data', 'followerCount'], response)
    const followingCount = path(['data', 'followingCount'], response)
    const profileImagePath = path(['data', 'profileImagePath'], response)

    yield put(AccountActions.infoSuccess(accountId, email, nickname, profileImagePath, followerCount, followingCount))
  } else {
    console.log('error')
    console.log(response)
    const message = path(['data', 'responseMessage'], response)

    // TODO: 에러 케이스 다루기
    console.log(message)
    yield put(AccountActions.infoFailure('WRONG'))
  }
}

// attempts to get account
export function * userEpisodes (api, action) {
  const { token, accountId, active } = action
  const response = yield call(api.requestUserEpisodes, token, accountId, active)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)
    const episodes = path(['data', 'items'], response)

    yield put(AccountActions.userEpisodesSuccess(episodes))
  } else {
    console.log('error')
    console.log(response)
    yield put(AccountActions.episodeError('WRONG'))
  }
}
