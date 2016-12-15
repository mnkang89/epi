import { takeLatest } from 'redux-saga'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugSettings from '../Config/DebugSettings'

/* ------------- Types ------------- */

import { LoginTypes } from '../Redux/LoginRedux'
import { SignupTypes } from '../Redux/SignupRedux'
import { AccountTypes } from '../Redux/AccountRedux'
import { EpisodeTypes } from '../Redux/EpisodeRedux'
import { ContentTypes } from '../Redux/ContentRedux'

/* ------------- Sagas ------------- */
// episode
import { login } from './LoginSagas'
import { email, password, nickname, profile, signup } from './SignupSagas'
import { account, userEpisodes, checkUserEpisode } from './AccountSagas'
import { postEpisode } from './EpisodeSagas'
import { postContent } from './ContentSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugSettings.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas receive extra parameters in addition to an action
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
    takeLatest(AccountTypes.USER_EPISODES_REQUEST, userEpisodes, api),
    // check user episode
    takeLatest(AccountTypes.USER_EPISODE_CHECK, checkUserEpisode, api),

    /* --- Episode --- */
    // post epissode
    takeLatest(EpisodeTypes.USER_EPISODE_POST, postEpisode, api),

    /* --- Content --- */
    // post content
    takeLatest(ContentTypes.USER_CONTENT_POST, postContent, api)
  ]
}
