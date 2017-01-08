import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import NotiActions from '../Redux/NotiRedux'

// attempts to get episodes
export function * getNoties (api, action) {
  console.log('getNoties 사가 진입')
  const { token } = action
  const response = yield call(api.getNoties, token)
  console.log(response)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    const noties = path(['data', 'notifications'], response)

    yield put(NotiActions.notiesSuccess(noties))
  } else {
    console.log('error')
    console.log(response)
    yield put(NotiActions.notiesFailure('WRONG'))
  }
}
