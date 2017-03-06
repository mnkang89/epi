import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import FeedActions from '../Redux/FeedRedux'

// attempts to get episodes
export function * getBestFeeds (api, action) {
  console.log('getBestFeeds 사가 진입')
  const { token } = action
  const response = yield call(api.getBestFeeds, token)
  console.log(response)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    const bestFeeds = path(['data', 'items'], response)

    yield put(FeedActions.bestFeedsSuccess(bestFeeds))
  } else {
    console.log('error')
    console.log(response)
    yield put(FeedActions.bestFeedsFailure('WRONG'))
  }
}

export function * moreBestFeeds (api, action) {
  console.log('모어 베스트 피드 사가 진입')
  const { token, accountId, before } = action
  const response = yield call(api.requestMoreBestFeeds, token, accountId, before)
  console.log(response)

  if (response.ok) {
    console.log('ok')
    console.log(response)
    const episodes = path(['data', 'items'], response)

    yield put(FeedActions.moreBestFeedsSuccess(episodes))
  } else {
    console.log('error')
    console.log(response)
    yield put(FeedActions.moreBestFeedsFailure('WRONG'))
  }
}
