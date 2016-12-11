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
    const numberOfFollower = path(['data', 'numberOfFollower'], response)
    const numberOfFollowing = path(['data', 'numberOfFollowing'], response)

    yield put(AccountActions.infoSuccess(accountId, email, nickname, numberOfFollower, numberOfFollowing))
  } else {
    console.log('error')
    console.log(response)
    const message = path(['data', 'responseMessage'], response)

    // TODO: 에러 케이스 다루기
    console.log(message)
    yield put(AccountActions.infoFailure('WRONG'))
  }
}
