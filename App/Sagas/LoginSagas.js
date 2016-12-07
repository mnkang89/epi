import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import LoginActions from '../Redux/LoginRedux'
import TokenActions from '../Redux/TokenRedux'

// attempts to login
export function * login (api, action) {
  const { email, password } = action

  if (email === '') {
    // dispatch failure
    yield put(LoginActions.loginFailure('VACANT_EMAIL'))
  } else if (password === '') {
    yield put(LoginActions.loginFailure('VACANT_PASSWORD'))
  } else {
    const response = yield call(api.requestLogin, email, password)

    // dispatch successful logins
    if (response.ok) {
      console.log(response)
      const accountId = path(['data', 'id'], response)
      const token = path(['data', 'auth'], response)

      yield put(LoginActions.loginSuccess(email))
      yield put(TokenActions.tokenRequest(token))
      yield put(TokenActions.idRequest(accountId))
    } else {
      console.log(response)
      const message = path(['data', 'responseMessage'], response)

      if (message === 'err_authentication_fail') {
        yield put(LoginActions.loginFailure('AUTHENTICATION_FAIL'))
      } else if (message === 'err_invalid_password') {
        yield put(LoginActions.loginFailure('INVALID_PASSWORD'))
      }
    }
  }
}
