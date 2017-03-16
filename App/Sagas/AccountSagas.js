import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import AccountActions from '../Redux/AccountRedux'
import { getToken } from '../Services/Auth'
import CameraScreenActions from '../Redux/CameraScreenRedux'

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
export function * otherInfo (api, action) {
  console.log('otherInfo사가워커 진입!!')
  const { token, otherAccountId } = action
  console.log(token)
  console.log(otherAccountId)
  const response = yield call(api.requestOtherInfo, token, otherAccountId)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)
    const accountId = path(['data', 'id'], response)
    // const email = path(['data', 'email'], response)
    const nickname = path(['data', 'nickname'], response)
    const followerCount = path(['data', 'followerCount'], response)
    const followingCount = path(['data', 'followingCount'], response)
    const following = path(['data', 'following'], response)
    const profileImagePath = path(['data', 'profileImagePath'], response)

    // yield put(AccountActions.otherInfoSuccess(accountId, email, nickname, profileImagePath, followerCount, followingCount, following))
    yield put(AccountActions.otherInfoObjectAdd(accountId, nickname, profileImagePath, followerCount, followingCount, following))
  } else {
    console.log('error')
    console.log(response)
    const message = path(['data', 'responseMessage'], response)

    // TODO: 에러 케이스 다루기
    console.log(message)
    yield put(AccountActions.otherInfoFailure('WRONG'))
  }
}

export function * checkUserEpisode (api, action) {
  const { token, active } = action
  const response = yield call(api.checkUserEpisode, token, active)

  if (response.ok) {
    console.log('ok')
    console.log(response)
    const episodes = path(['data', 'episodes'], response)

    if (episodes.length === 0) {
      yield put(AccountActions.userEpisodeCheckSuccess(false, null))
    } else {
      const activeEpisodeId = episodes[0].id
      yield put(AccountActions.userEpisodeCheckSuccess(true, activeEpisodeId))
    }
  } else {
    console.log('error')
    console.log(response)
    yield put(AccountActions.userEpisodeCheckFailure('WRONG'))
  }
}

// attempts to post follow
export function * postFollow (api, action) {
  console.log('postFollow사가워커 진입!!')
  const { token, id } = action
  const response = yield call(api.postFollow, token, id)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)

    yield put(AccountActions.followPostSuccess(response))
  } else {
    console.log('error')
    console.log(response)

    // TODO: 에러케이스 구분
    yield put(AccountActions.followPostFailure('WRONG'))
  }
}

// attempts to delete follow
export function * deleteFollow (api, action) {
  console.log('deleteFollow사가워커 진입!!')
  const { token, id } = action
  const response = yield call(api.deleteFollow, token, id)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)

    yield put(AccountActions.followDeleteSuccess(response))
  } else {
    console.log('error')
    console.log(response)

    // TODO: 에러케이스 구분
    yield put(AccountActions.followDeleteFailure('WRONG'))
  }
}

export function * getFollowing (api, action) {
  console.log('getFollowing사가워커 진입!!')
  const { token, id } = action
  const response = yield call(api.getFollowing, token, id)
  const follows = path(['data', 'accounts'], response)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)

    yield put(AccountActions.getFollowingSuccess(follows))
    // yield put(AccountActions.openFollow(true, '팔로잉'))
  } else {
    console.log('error')
    console.log(response)

    // TODO: 에러케이스 구분
    yield put(AccountActions.getFollowingFailure('WRONG'))
  }
}

export function * getFollower (api, action) {
  console.log('getFollower사가워커 진입!!')
  const { token, id } = action
  const response = yield call(api.getFollower, token, id)
  const follows = path(['data', 'accounts'], response)

  // dispatch successful email checking
  if (response.ok) {
    console.log('ok')
    console.log(response)

    yield put(AccountActions.getFollowerSuccess(follows))
    // yield put(AccountActions.openFollow(true, '팔로워'))
  } else {
    console.log('error')
    console.log(response)

    // TODO: 에러케이스 구분
    yield put(AccountActions.getFollowerFailure('WRONG'))
  }
}

export function * getActiveUserEpisode (api, action) {
  const token = yield getToken()
  const response = yield call(api.checkUserEpisode, token, true)

  // dispatch successful email checking
  if (response.ok) {
    const episodes = path(['data', 'episodes'], response)
    if (episodes.length === 1) {
      const activeEpisodeId = episodes[0].id
      yield put(CameraScreenActions.setActiveEpisode(activeEpisodeId))
    }
  } else {
    console.log('fail to get active user episode')
  }
}
