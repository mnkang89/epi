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
import { CommentTypes } from '../Redux/CommentRedux'
import { FeedTypes } from '../Redux/FeedRedux'

/* ------------- Sagas ------------- */
// episode
import { login } from './LoginSagas'
import { email, password, nickname, profile, signup } from './SignupSagas'
import { account, otherInfo, checkUserEpisode, postFollow, deleteFollow } from './AccountSagas'
import { userEpisodes, otherEpisodes, postEpisode, putEpisode } from './EpisodeSagas'
import { postContent, postLike, deleteLike } from './ContentSagas'
import { postComment, getComment } from './CommentSagas'
import { getBestFeeds } from './FeedSagas'

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
    // other info
    takeLatest(AccountTypes.OTHER_INFO_REQUEST, otherInfo, api),
    // check user episode
    takeLatest(AccountTypes.USER_EPISODE_CHECK, checkUserEpisode, api),
    // post follow
    takeLatest(AccountTypes.FOLLOW_POST, postFollow, api),
    // delete follow
    takeLatest(AccountTypes.FOLLOW_DELETE, deleteFollow, api),

    /* --- Episode --- */
    // post episode
    takeLatest(EpisodeTypes.USER_EPISODE_POST, postEpisode, api),
    // put episode
    takeLatest(EpisodeTypes.USER_EPISODE_PUT, putEpisode, api),
    // get user episode
    takeLatest(EpisodeTypes.USER_EPISODES_REQUEST, userEpisodes, api),
    // get other episode
    takeLatest(EpisodeTypes.OTHER_EPISODES_REQUEST, otherEpisodes, api),

    /* --- Content --- */
    // post content
    takeLatest(ContentTypes.USER_CONTENT_POST, postContent, api),
    // post like
    takeLatest(ContentTypes.LIKE_POST, postLike, api),
    // delete like
    takeLatest(ContentTypes.LIKE_DELETE, deleteLike, api),

    /* --- Comment --- */
    // post comment
    takeLatest(CommentTypes.COMMENT_POST, postComment, api),
    // get comment
    takeLatest(CommentTypes.COMMENT_GET, getComment, api),

    /* --- Feed --- */
    // get BestFeeds
    takeLatest(FeedTypes.BEST_FEEDS_REQUEST, getBestFeeds, api)
  ]
}
