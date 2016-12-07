import { put, call } from 'redux-saga/effects'
import { path } from 'ramda'
import SignupActions from '../Redux/SignupRedux'
import TokenActions from '../Redux/TokenRedux'

// attempts to check email
export function * email (api, action) {
  const { email } = action
  if (email === '') {
    // dispatch failure
    yield put(SignupActions.emailFailure('VACANT'))
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
  if (password === passwordCheck) {
    // password matched
    yield put(SignupActions.passwordSuccess(password))
    yield put(SignupActions.signupRequest(email, password))
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

// attempts to signup
export function * signup (api, action) {
  const { email, password } = action
  const response = yield call(api.requestSignup, email, password)

  // dispatch successful email checking
  if (response.ok) {
    console.log(response)
    const token = path(['data', 'token'], response)
    const accountId = path(['data', 'id'], response)

    yield put(SignupActions.signupSuccess(email, password))
    yield put(TokenActions.tokenRequest(token))
    yield put(TokenActions.idRequest(accountId))

    /*
    if (responseStatus === 'ok') {
    } else {
      const responseMessage = path(['data', 'responseMessage'], response)
      console.log(responseMessage)
      yield put(SignupActions.signupFailure('WRONG'))
    }
    */
  } else {
    console.log(response)
    const responseMessage = path(['data', 'responseMessage'], response)
    console.log(responseMessage)
    yield put(SignupActions.signupFailure('WRONG'))
  }
}
