import { takeLatest } from 'redux-saga'
import API from '../Services/Api'
// import DebugSettings from '../Config/DebugSettings'

/* ------------- Types ------------- */

import { LoginTypes } from '../Redux/LoginRedux'
import { SignupTypes } from '../Redux/SignupRedux'
import { AccountTypes } from '../Redux/AccountRedux'
import { EpisodeTypes } from '../Redux/EpisodeRedux'
import { ContentTypes } from '../Redux/ContentRedux'
import { CommentTypes } from '../Redux/CommentRedux'
import { FeedTypes } from '../Redux/FeedRedux'
import { NotiTypes } from '../Redux/NotiRedux'
import { CameraScreenTypes } from '../Redux/CameraScreenRedux'

/* ------------- Sagas ------------- */
// episode
import { login } from './LoginSagas'
import { email, password, nickname, profile, signup } from './SignupSagas'
import { account, otherInfo, getActiveUserEpisode, postFollow, deleteFollow, getFollowing, getFollower } from './AccountSagas'
import { userEpisodes, userEpisodesWithFalse, otherEpisodes, postEpisode, putEpisode, singleEpisode, newEpisode, deactivateEpisode } from './EpisodeSagas'
import { postContent, postLike, deleteLike } from './ContentSagas'
import { postComment, getComment } from './CommentSagas'
import { getBestFeeds } from './FeedSagas'
import { getNoties } from './NotiSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = API.create()

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
    // post follow
    takeLatest(AccountTypes.FOLLOW_POST, postFollow, api),
    // delete follow
    takeLatest(AccountTypes.FOLLOW_DELETE, deleteFollow, api),
    // get following
    takeLatest(AccountTypes.GET_FOLLOWING, getFollowing, api),
    // get follower
    takeLatest(AccountTypes.GET_FOLLOWER, getFollower, api),

    /* --- CameraScreen --- */
    // check user episode
    takeLatest(CameraScreenTypes.GET_ACTIVE_EPISODE, getActiveUserEpisode, api),
    // post content
    takeLatest(CameraScreenTypes.POST_CONTENT, postContent, api),
    // deactive episode
    takeLatest(CameraScreenTypes.DEACTIVE_EPISODE, deactivateEpisode, api),
    /* --- Episode --- */
    // post episode
    takeLatest(EpisodeTypes.USER_EPISODE_POST, postEpisode, api),
    // put episode
    takeLatest(EpisodeTypes.USER_EPISODE_PUT, putEpisode, api),
    // get user episode
    takeLatest(EpisodeTypes.USER_EPISODES_REQUEST, userEpisodes, api),
    // get user episode with falses
    takeLatest(EpisodeTypes.USER_EPISODES_WITH_FALSE_REQUEST, userEpisodesWithFalse, api),
    // get other episode
    takeLatest(EpisodeTypes.OTHER_EPISODES_REQUEST, otherEpisodes, api),
    // get single episode
    takeLatest(EpisodeTypes.SINGLE_EPISODE_REQUEST, singleEpisode, api),
    // get new episode
    takeLatest(EpisodeTypes.NEW_EPISODE_REQUEST, newEpisode, api),

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
    takeLatest(FeedTypes.BEST_FEEDS_REQUEST, getBestFeeds, api),

    /* --- Noti --- */
    // get Noties
    takeLatest(NotiTypes.NOTIES_REQUEST, getNoties, api)
  ]
}
