import apisauce from 'apisauce'
import { getToken, getAccountId } from './Auth'

const getTokenHeader = () => {
  const token = getToken()
  return {headers: {'x-auth': token}}
  // Test : errCode 401
  // return {headers: {'x-auth': '$2a$10$9gPasx2g5gTH2NP/jhxu.u2gmior9AE/OH5WvcJpe64QnUFJDPB.O'}}
}

// our "constructor"
const create = (baseURL = 'http://alphaca-staging.ap-northeast-2.elasticbeanstalk.com/') => {
  // console.log(getToken())
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

  const reportEpisode = (episodeId) => {
    console.log('POST reportEpisode api콜 발생')

    return api.post(`/api/episodes/${episodeId}/report`, {}, getTokenHeader())
  }

  const removeEpisode = (episodeId) => {
    console.log('DELETE removeEpisode api콜 발생')

    return api.delete(`/api/episodes/${episodeId}`, {}, getTokenHeader())
  }

  // content
  const postContent = (token, episodeId, fileType, file, thumbnail, message) => {
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

    const thumb = {
      uri: thumbnail,
      type: 'image/jpeg',
      name: 'thumbnail.jpg'
    }

    formData.append('episodeId', episodeId)
    formData.append('type', fileType)
    formData.append('file', photo)
    if (thumbnail !== '') {
      formData.append('thumbnail', thumb)
    }
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
  const getNoties = (token, page) => {
    console.log('GET noties api콜 발생')
    const size = 11

    return api.get(`/api/notifications?size=${size}&page=${page}`, {}, getTokenHeader())
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
    reportEpisode,
    removeEpisode,

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
