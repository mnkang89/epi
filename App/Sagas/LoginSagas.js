// import { put } from 'redux-saga/effects'
// import LoginActions from '../Redux/LoginRedux'
//
// // attempts to login
// export function * login ({ username, password }) {
//   if (password === '') {
//     // dispatch failure
//     yield put(LoginActions.loginFailure('WRONG'))
//   } else {
//     // dispatch successful logins
//     yield put(LoginActions.loginSuccess(username))
//   }
// }

import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import LoginActions from '../Redux/LoginRedux'
import TokenActions from '../Redux/TokenRedux'
import { setToken } from '../Services/Auth'

let validateEmail = (email) => {
  // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // i think this is more readable?
  const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
  return re.test(email)
}

let validatePassword = (password) => {
  if (password.length >= 8 && password.length <= 12) {
    return true
  } else {
    return false
  }
}

// attempts to login
export function * login (api, action) {
  const { email, password } = action

  if (email === '') {
    // dispatch failure
    yield put(LoginActions.loginFailure('VACANT_EMAIL'))
  } else if (password === '') {
    yield put(LoginActions.loginFailure('VACANT_PASSWORD'))
  } else if (!validateEmail(email) || !validatePassword(password)) {
    yield put(LoginActions.loginFailure('INVALID_FORMAT'))
  } else {
    const response = yield call(api.requestLogin, email, password)

    // dispatch successful logins
    if (response.ok) {
      console.log(response)
      const token = path(['data', 'token'], response)
      const accountId = path(['data', 'id'], response)

      setToken(token, accountId)
      yield put(LoginActions.loginSuccess(email))
      yield put(TokenActions.tokenRequest(token, accountId))
    } else {
      console.log(response)
      const message = path(['data', 'responseMessage'], response)

      if (message === 'err_authentication_fail') {
        yield put(LoginActions.loginFailure('INVALID_EMAIL'))
      } else if (message === 'err_invalid_password') {
        yield put(LoginActions.loginFailure('INVALID_PASSWORD'))
      }
    }
  }
}
