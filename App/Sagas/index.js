import { takeLatest } from 'redux-saga'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugSettings from '../Config/DebugSettings'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { TemperatureTypes } from '../Redux/TemperatureRedux'

// episode
import { LoginTypes } from '../Redux/LoginRedux'
import { SignupTypes } from '../Redux/SignupRedux'
import { AccountTypes } from '../Redux/AccountRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getTemperature } from './TemperatureSagas'

// episode
import { login } from './LoginSagas'
import { email, password, nickname, profile, signup } from './SignupSagas'
import { account, userEpisodes } from './AccountSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugSettings.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    // some sagas receive extra parameters in addition to an action
    takeLatest(TemperatureTypes.TEMPERATURE_REQUEST, getTemperature, api),

    /* --- LogIn --- */
    takeLatest(LoginTypes.LOGIN_REQUEST, login, api),

    /* --- SignUp --- */
    // email
    takeLatest(SignupTypes.EMAIL_CHECK, email, api),
    // password
    takeLatest(SignupTypes.PASSWORD_REQUEST, password),
    // nickname
    takeLatest(SignupTypes.NICKNAME_CHECK, nickname, api),
    // profile
    takeLatest(SignupTypes.PROFILE_REQUEST, profile, api),
    // signup
    takeLatest(SignupTypes.SIGNUP_REQUEST, signup, api),

    /* --- Token --- */
    // 일단은 따로 saga를 거치지 않고 redux로 바로 던진다.
    // takeLatest(SignupTypes.TOKEN_REQUEST, token, api),

    /* --- Account --- */
    // user info
    takeLatest(AccountTypes.INFO_REQUEST, account, api),
    // user episode
    takeLatest(AccountTypes.USER_EPISODES_REQUEST, userEpisodes, api)
  ]
}
