import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import SignupActions from '../Redux/SignupRedux'

// attempts to check email
export function * email (api, action) {
  const { email } = action
  if (email === '') {
    // dispatch failure
    yield put(SignupActions.emailFailure('WRONG'))
  } else {
    const response = yield call(api.checkEmail, email)
    console.log('ㅗㅑㅗㅑ')
    console.log(response)
    console.log('ㅗㅑㅗㅑ')

    // dispatch successful email checking
    if (response.ok) {
      console.log(response)
      const exist = path(['data', 'exist'], response)

      if (exist) {
        yield put(SignupActions.emailFailure('DUPLICATED'))
      } else {
        yield put(SignupActions.emailSuccess(email))
      }
    } else {
      console.log(response)
      // yield put(SignupActions.emailSuccess(email))
      // yield put(SignupActions.emailFailure('WRONG'))
    }
  }
}

// attempts to check nickname
export function * password ({ password, passwordCheck }) {
  if (password === passwordCheck) {
    // password matched
    yield put(SignupActions.passwordSuccess(password))
  } else {
    // password not matched
    yield put(SignupActions.passwordFailure('NOT_MATCH'))
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
