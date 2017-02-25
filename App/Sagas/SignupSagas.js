import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import SignupActions from '../Redux/SignupRedux'
import TokenActions from '../Redux/TokenRedux'
// import ScreenActions from '../Redux/ScreenRedux'
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

let invalidateNickname = (nickname) => {
  const re = /[^(가-힣a-zA-Z0-9)]/
  return re.test(nickname)
}

// attempts to check email
export function * email (api, action) {
  const { email } = action

  if (email === '') {
    // dispatch failure
    yield put(SignupActions.emailFailure('VACANT'))
  } else if (!validateEmail(email)) {
    yield put(SignupActions.emailFailure('INVALID_FORMAT'))
  } else {
    const response = yield call(api.checkEmail, email)

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
    }
  }
}

// attempts to check nickname
export function * password (action) {
  const { email, password, passwordCheck } = action

  if (password === '') {
    yield put(SignupActions.passwordFailure('VACANT'))
  } else if (password === passwordCheck) {
    if (!validatePassword(password)) {
      // password format check
      yield put(SignupActions.passwordFailure('INVALID_FORMAT'))
    } else {
      // password matched
      yield put(SignupActions.passwordSuccess(password))
      yield put(SignupActions.signupRequest(email, password))
    }
  } else {
    // password not matched
    yield put(SignupActions.passwordFailure('NOT_MATCH'))
  }
}

export function * nickname (api, action) {
  const { nickname, token, accountId } = action

  if (nickname === '') {
    // dispatch failure
    yield put(SignupActions.nicknameFailure('VACANT'))
  } else if (invalidateNickname(nickname)) {
    // dispatch failure
    yield put(SignupActions.nicknameFailure('INVALID_FORMAT'))
  } else {
    const response = yield call(api.requestNickname, nickname, token, accountId)

    // dispatch successful nickname request
    if (response.ok) {
      console.log(response)
      yield put(SignupActions.nicknameSuccess(nickname))
    } else {
      console.log(response)
      const message = path(['data', 'responseMessage'], response)
      // TODO: 에러 케이스 다루기, invalid, duplicated
      if (message === 'err_invalid_nickname') {
        yield put(SignupActions.nicknameFailure('INVALID'))
      } else if (message === 'err_duplicated_nickname') {
        yield put(SignupActions.nicknameFailure('DUPLICATED'))
      } else if (message === 'err_token_not_found') {
        yield put(SignupActions.nicknameFailure('TOKEN_ERROR'))
      }
    }
  }
}

export function * profile (api, action) {
  const { photoSource, token, accountId } = action

  if (photoSource === '') {
    // dispatch failure
    yield put(SignupActions.profileFailure('NO_PHOTO'))
  } else {
    const response = yield call(api.requestPhoto, photoSource, token, accountId)

    // dispatch successful profile request
    if (response.ok) {
      console.log(response)
      yield put(SignupActions.profileSuccess(photoSource))
    } else {
      console.log(response)
      yield put(SignupActions.profileFailure('UPLOAD_FAIL'))
    }
  }
}

// attempts to signup
export function * signup (api, action) {
  const { email, password } = action
  const response = yield call(api.requestSignup, email, password)

  // dispatch successful email checking
  if (response.ok) {
    console.log(response)
    const token = path(['data', 'token'], response)
    const accountId = path(['data', 'id'], response)

    setToken(token, accountId)
    // yield put(ScreenActions.isFirstLogin(true))
    yield put(SignupActions.signupSuccess(email, password))
    yield put(TokenActions.tokenRequest(token, accountId))
  } else {
    console.log(response)
    const responseMessage = path(['data', 'responseMessage'], response)
    console.log(responseMessage)
    yield put(SignupActions.signupFailure('WRONG'))
  }
}
