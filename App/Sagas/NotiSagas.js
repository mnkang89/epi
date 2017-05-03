import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import NotiActions from '../Redux/NotiRedux'

// attempts to get episodes
export function * getNoties (api, action) {
  console.log('getNoties 사가 진입')
  const { token, page } = action
  const response = yield call(api.getNoties, token, page)
  console.log(response)

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

export function * moreNoties (api, action) {
  console.log('모어 노티 사가 진입')
  const { token, page } = action
  const response = yield call(api.getNoties, token, page)
  console.log(response)

  if (response.ok) {
    console.log('ok')
    const noties = path(['data', 'notifications'], response)

    yield put(NotiActions.moreNotiesSuccess(noties))
  } else {
    console.log('error')
    console.log(response)
    yield put(NotiActions.moreNotiesFailure('WRONG'))
  }
}
