import { put, call } from 'redux-saga/effects'
import SignupActions from '../Redux/SignupRedux'

// attempts to check email
export function * email (api, action) {
  const { email } = action
  if (email === '') {
    // dispatch failure
    yield put(SignupActions.emailFailure('WRONG'))
  } else {
    const response = yield call(api.checkEmail, email)
    // dispatch successful email checking
    if (response.ok) {
      yield put(SignupActions.emailSuccess(email))
    } else {
      yield put(SignupActions.emailFailure('WRONG'))
    }
  }
}

// attempts to check nickname
export function * nickname ({ nickname }) {
  if (nickname === '') {
    // dispatch failure
    yield put(SignupActions.nicknameFailure('WRONG'))
  } else {
    // dispatch successful nickname checking
    yield put(SignupActions.nicknameSuccess(nickname))
  }
}

// attempts to signup
export function * signup ({ email, password, nickname }) {
  if (password === '') {
    // dispatch failure
    yield put(SignupActions.signupFailure('WRONG'))
  } else {
    // dispatch successful signup
    yield put(SignupActions.signupSuccess(email))
  }
}
