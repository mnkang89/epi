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
      const accountId = path(['data', 'id'], response)
      const token = path(['data', 'token'], response)

<<<<<<< d633873fc87efe970bddf5cd8dc6749d10fea996
      setToken(token)
      yield put(LoginActions.loginSuccess(email))
=======
      yield setToken(token)
>>>>>>> chore: BugFix, fixed non-simulataneous following issues in ExploreScreen.js
      yield put(TokenActions.tokenRequest(token, accountId))
      yield put(LoginActions.loginSuccess(email))
      // idRequest는 deprecated
      // yield put(TokenActions.idRequest(accountId))
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
