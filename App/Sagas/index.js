
import { takeLatest } from 'redux-saga/effects'
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
import { email, password, nickname, profile, profileModification, signup } from './SignupSagas'
import { account, otherInfo, getActiveUserEpisode, postFollow, deleteFollow, getFollowing, getFollower } from './AccountSagas'
import {
  userEpisodes, userEpisodesWithFalse, otherEpisodes, postEpisode, putEpisode, singleEpisode, newEpisode,
  newEpisodeWithFalse, newOtherEpisode, deactivateEpisode, moreFeeds, moreEpisodes, moreOtherEpisodes } from './EpisodeSagas'
import { postContent, postLike, deleteLike } from './ContentSagas'
import { postComment, getComment, deleteComment } from './CommentSagas'
import { getBestFeeds, moreBestFeeds } from './FeedSagas'
import { getNoties, moreNoties } from './NotiSagas'

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
    // profileModification
    takeLatest(SignupTypes.PROFILE_MODIFICATION, profileModification, api),
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
    // get user episodes
    takeLatest(EpisodeTypes.USER_EPISODES_REQUEST, userEpisodes, api),
    // get user episodes with falses
    takeLatest(EpisodeTypes.USER_EPISODES_WITH_FALSE_REQUEST, userEpisodesWithFalse, api),
    // get other episodes
    takeLatest(EpisodeTypes.OTHER_EPISODES_REQUEST, otherEpisodes, api),
    // get single episode
    takeLatest(EpisodeTypes.SINGLE_EPISODE_REQUEST, singleEpisode, api),
    // get new episode
    takeLatest(EpisodeTypes.NEW_EPISODE_REQUEST, newEpisode, api),
    // get new episodeWithFalse
    takeLatest(EpisodeTypes.NEW_EPISODE_WITH_FALSE_REQUEST, newEpisodeWithFalse, api),
    // get new other episode
    takeLatest(EpisodeTypes.NEW_OTHER_EPISODE_REQUEST, newOtherEpisode, api),
    // get more feeds
    takeLatest(EpisodeTypes.MORE_FEEDS_REQUEST, moreFeeds, api),
    // get more episodes
    takeLatest(EpisodeTypes.MORE_EPISODES_REQUEST, moreEpisodes, api),
    // get more other episodes
    takeLatest(EpisodeTypes.MORE_OTHER_EPISODES_REQUEST, moreOtherEpisodes, api),

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
    // delete comment
    takeLatest(CommentTypes.COMMENT_DELETE, deleteComment, api),

    /* --- Feed --- */
    // get BestFeeds
    takeLatest(FeedTypes.BEST_FEEDS_REQUEST, getBestFeeds, api),
    // get more BestFeeds
    takeLatest(FeedTypes.MORE_BEST_FEEDS_REQUEST, moreBestFeeds, api),

    /* --- Noti --- */
    // get Noties
    takeLatest(NotiTypes.NOTIES_REQUEST, getNoties, api),
    // get more Noties
    takeLatest(NotiTypes.MORE_NOTIES_REQUEST, moreNoties, api)
  ]
}
