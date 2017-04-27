// // a library to wrap and simplify api calls
// import apisauce from 'apisauce'
//
// // our "constructor"
// const create = (baseURL = 'https://api.github.com/') => {
//   // ------
//   // STEP 1
//   // ------
//   //
//   // Create and configure an apisauce-based api object.
//   //
//   const api = apisauce.create({
//     // base URL is read from the "constructor"
//     baseURL,
//     // here are some default headers
//     headers: {
//       'Cache-Control': 'no-cache'
//     },
//     // 10 second timeout...
//     timeout: 10000
//   })
//
//   // Wrap api's addMonitor to allow the calling code to attach
//   // additional monitors in the future.  But only in __DEV__ and only
//   // if we've attached Reactotron to console (it isn't during unit tests).
//   if (__DEV__ && console.tron) {
//     api.addMonitor(console.tron.apisauce)
//   }
//
//   // ------
//   // STEP 2
//   // ------
//   //
//   // Define some functions that call the api.  The goal is to provide
//   // a thin wrapper of the api layer providing nicer feeling functions
//   // rather than "get", "post" and friends.
//   //
//   // I generally don't like wrapping the output at this level because
//   // sometimes specific actions need to be take on `403` or `401`, etc.
//   //
//   // Since we can't hide from that, we embrace it by getting out of the
//   // way at this level.
//   //
//   const getRoot = () => api.get('')
//   const getRate = () => api.get('rate_limit')
//   const getUser = (username) => api.get('search/users', {q: username})
//
//   // ------
//   // STEP 3
//   // ------
//   //
//   // Return back a collection of functions that we would consider our
//   // interface.  Most of the time it'll be just the list of all the
//   // methods in step 2.
//   //
//   // Notice we're not returning back the `api` created in step 1?  That's
//   // because it is scoped privately.  This is one way to create truly
//   // private scoped goodies in JavaScript.
//   //
//   return {
//     // a list of the API functions from step 2
//     getRoot,
//     getRate,
//     getUser
//   }
// }
//
// // let's return back our create method as the default.
// export default {
//   create
// }
//
//

// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import { getToken, getAccountId } from './Auth'

const getTokenHeader = () => {
  const token = getToken()
  return {headers: {'x-auth': token}}
}

// our "constructor"
const create = (baseURL = 'http://alphaca-staging.ap-northeast-2.elasticbeanstalk.com/') => {
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
    },
    // 10 second timeout...
    timeout: 10000
  })

  if (__DEV__ && console.tron) {
    console.tron.log('Hello, I\'m an example of how to log via Reactotron.')
    api.addMonitor(console.tron.apisauce)
  }

  // SignUp
  const checkEmail = (email) => {
    const formData = new FormData()

    formData.append('email', email)

    return api.post('api/accounts/is-exist-email', formData)
  }

  const requestSignup = (email, password) => {
    const formData = new FormData()

    formData.append('email', email)
    formData.append('password', password)

    return api.post(`/api/accounts`, formData)
  }

  const requestNickname = (nickname, token, accountId) => {
    const formData = new FormData()

    formData.append('accountId', accountId)
    formData.append('nickname', nickname)

    return api.post(`/api/accounts/${accountId}/nickname`, formData, getTokenHeader())
  }

  const requestPhoto = (photoSource, token, accountId) => {
    const formData = new FormData()
    console.log(photoSource)
    console.log(accountId)
    const photo = {
      uri: photoSource,
      type: 'image/jpeg',
      name: 'photo.jpg'
    }

    formData.append('file', photo)

    return api.post(`/api/accounts/${accountId}/profile-image`, formData, getTokenHeader())
  }

  // Login
  const requestLogin = (email, password) => {
    const formData = new FormData()

    formData.append('email', email)
    formData.append('password', password)

    return api.post(`/api/accounts/login`, { email: email, password: password }, getTokenHeader())
  }

  // Account
  const requestAccount = (token, accountId) => {
    console.log('POST userAccount api콜 발생')
    console.log(accountId)

    return api.get(`/api/accounts/${accountId}/summary`, {}, getTokenHeader())
  }

  const requestOtherInfo = (token, accountId) => {
    return api.get(`/api/accounts/${accountId}/summary`, {}, getTokenHeader())
  }

  const checkUserEpisode = (token, active) => {
    console.log('GET userEpisode api콜 발생')
    const formData = new FormData()

    formData.append('active', active)

    return api.get(`/api/episodes`, { active: active }, getTokenHeader())
  }

  const requestUserFeeds = (token, accountId, withFollowing) => {
    console.log('GET userEpisode api콜 발생')
    const formData = new FormData()

    formData.append('accountId', accountId)
    formData.append('withFollowing', withFollowing)

    console.tron.log(getTokenHeader())

    return api.get(`/api/feeds?withFollowing=${withFollowing}&size=6`, {}, getTokenHeader())
  }

  const requestOtherFeeds = (token, accountId, withFollowing) => {
    console.log('GET otherEpisode api콜 발생')
    // const formData = new FormData()

    // formData.append('accountId', accountId)
    // formData.append('withFollowing', active)

    return api.get(`/api/feeds?accountId=${accountId}&withFollowing=${withFollowing}&size=6`, {}, getTokenHeader())
  }

  const requestMoreFeeds = (token, accountId, withFollowing, before) => {
    const formData = new FormData()

    formData.append('accountId', accountId)
    formData.append('withFollowing', withFollowing)
    formData.append('before', before)

    console.tron.log(getTokenHeader())

    return api.get(`/api/feeds?withFollowing=${withFollowing}&before=${before}&size=6`, {}, getTokenHeader())
  }

  const requestMoreOtherFeeds = (token, accountId, withFollowing, before) => {
    const formData = new FormData()

    formData.append('accountId', accountId)
    formData.append('withFollowing', withFollowing)
    formData.append('before', before)

    console.tron.log(getTokenHeader())

    return api.get(`/api/feeds?accountId=${accountId}&withFollowing=${withFollowing}&before=${before}&size=6`, {}, getTokenHeader())
  }

  const postFollow = (token, id) => {
    console.log('POST account/follow api콜 발생')
    const formData = new FormData()

    formData.append('id', id)

    return api.post(`/api/accounts/follow`, formData, getTokenHeader())
  }

  const deleteFollow = (token, id) => {
    console.log('DELETE account/follow api콜 발생')

    return api.delete(`/api/accounts/follow?id=${id}`, {}, getTokenHeader())
  }

  const getFollowing = (token, id) => {
    console.log('GET account/following api콜 발생')

    return api.get(`/api/accounts/${id}/following`, {}, getTokenHeader())
  }

  const getFollower = (token, id) => {
    console.log('GET account/follower api콜 발생')

    return api.get(`/api/accounts/${id}/follower`, {}, getTokenHeader())
  }

  // episode
  const postEpisode = (token) => {
    console.log('POST episode api콜 발생')

    return api.post(`/api/episodes`, {}, getTokenHeader())
  }

  const putEpisode = (token, episodeId, active) => {
    console.log('PUT episode api콜 발생')
    console.log(token)
    console.log(episodeId)
    console.log(active)
    const formData = new FormData()

    formData.append('id', episodeId)
    formData.append('active', active)

    return api.put(`/api/episodes/${episodeId}?active=${active}`, {}, getTokenHeader())
  }

  const requestSingleEpisode = (token, episodeId) => {
    console.log('GET singleEpisode api콜 발생')
    const formData = new FormData()

    formData.append('episodeId', episodeId)

    return api.get(`/api/episodes/${episodeId}`, {}, getTokenHeader())
  }

  // content
  const postContent = (token, episodeId, fileType, file, message) => {
    console.log('POST content api콜 발생')
    console.tron.log(fileType)
    const formData = new FormData()
    const savedForm = fileType === 'Image' ? 'image/jpeg' : 'video/mov'
    const savedName = fileType === 'Image' ? 'photo.jpg' : 'video.mov'

    const photo = {
      uri: file,
      type: savedForm,
      name: savedName
    }

    formData.append('episodeId', episodeId)
    formData.append('type', fileType)
    formData.append('file', photo)
    if (message !== null) {
      formData.append('message', message)
    }

    console.tron.log(formData)

    return api.post(`/api/contents`, formData, getTokenHeader())
  }

  const postLike = (token, episodeId) => {
    console.log('POST episode/like api콜 발생')
    // const formData = new FormData()
    // formData.append('contentId', contentId)

    // return api.post(`/api/contents/like`, formData, getTokenHeader())
    return api.post(`/api/episodes/${episodeId}/like`, {}, getTokenHeader())
  }

  const deleteLike = (token, episodeId) => {
    console.log('DELETE episode/like api콜 발생')
    // const formData = new FormData()
    // formData.append('contentId', contentId)

    // return api.delete(`/api/contents/like`, { data: {formData} })
    return api.delete(`/api/episodes/${episodeId}/like`, {}, getTokenHeader())
  }

  // comment
  const postComment = (token, contentId, message) => {
    console.log('POST comment api콜 발생')
    const formData = new FormData()

    formData.append('contentId', contentId)
    formData.append('message', message)

    return api.post(`/api/comments`, formData, getTokenHeader())
  }

  const getComment = (token, episodeId) => {
    console.log(episodeId)
    console.log('GET comment api콜 발생')

    return api.get(`/api/comments?owner=episode&ownerId=${episodeId}`, {}, getTokenHeader())
  }

  const deleteComment = (commentId) => {
    console.log('DELETE comment api콜 발생')

    return api.delete(`/api/comments?commentId=${commentId}`, {}, getTokenHeader())
  }

  // feeds
  const getBestFeeds = (token) => {
    console.tron.log('GET bestFeeds api콜 발생')
    console.tron.log(getTokenHeader())
    return api.get(`/api/feeds/best?size=6`, {}, getTokenHeader())
  }

  const requestMoreBestFeeds = (token, accountId, before) => {
    console.tron.log(getTokenHeader())

    return api.get(`/api/feeds/best?before=${before}&size=6`, {}, getTokenHeader())
  }

  // noties
  const getNoties = (token) => {
    console.log('GET noties api콜 발생')

    return api.get(`/api/notifications`, {}, getTokenHeader())
  }

  const registerPushToken = (os, token) => {
    const accountId = getAccountId()
    const formData = new FormData()

    formData.append('os', os)
    formData.append('token', token)

    return api.post(`/api/accounts/${accountId}/register-push-notification`, formData, getTokenHeader())
  }

  return {
    // a list of the API functions from step 2
    checkEmail,
    requestSignup,
    requestNickname,
    requestPhoto,

    requestLogin,

    requestAccount,
    requestOtherInfo,

    checkUserEpisode,
    requestUserFeeds,
    requestOtherFeeds,
    requestMoreFeeds,
    requestMoreOtherFeeds,

    postFollow,
    deleteFollow,
    getFollowing,
    getFollower,

    postEpisode,
    putEpisode,
    requestSingleEpisode,

    postContent,
    postLike,
    deleteLike,

    postComment,
    getComment,
    deleteComment,

    getBestFeeds,
    requestMoreBestFeeds,

    getNoties,
    registerPushToken
  }
}

// let's return back our create method as the default.
export default {
  create
}
