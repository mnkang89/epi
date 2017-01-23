// a library to wrap and simplify api calls
import apisauce from 'apisauce'

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

  const getCity = (city) => api.get('weather', {q: city})

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
    api.setHeader('x-auth', token)

    return api.post(`/api/accounts/${accountId}/nickname`, formData)
  }

  const requestPhoto = (photoSource, token, accountId) => {
    const formData = new FormData()
    console.log(photoSource)
    const photo = {
      uri: photoSource,
      type: 'image/jpeg',
      name: 'photo.jpg'
    }

    formData.append('file', photo)
    api.setHeader('x-auth', token)

    return api.post(`/api/accounts/${accountId}/profile-image`, formData)
  }

  // Login
  const requestLogin = (email, password) => {
    const formData = new FormData()

    formData.append('email', email)
    formData.append('password', password)

    return api.post(`/api/accounts/login`, { email: email, password: password })
  }

  // Account
  const requestAccount = (token, accountId) => {
    // console.log('POST userAccount api콜 발생')
    api.setHeader('x-auth', token)

    return api.get(`/api/accounts/${accountId}/summary`)
  }

  const requestOtherInfo = (token, accountId) => {
    api.setHeader('x-auth', token)

    return api.get(`/api/accounts/${accountId}/summary`)
  }

  const checkUserEpisode = (token, active) => {
    console.log('GET userEpisode api콜 발생')
    const formData = new FormData()

    formData.append('active', active)
    api.setHeader('x-auth', token)

    return api.get(`/api/episodes`, { active: active })
  }

  const requestUserFeeds = (token, accountId, withFollowing) => {
    console.log('GET userEpisode api콜 발생')
    const formData = new FormData()

    formData.append('accountId', accountId)
    formData.append('withFollowing', withFollowing)
    api.setHeader('x-auth', token)

    return api.get(`/api/feeds?withFollowing=${withFollowing}&size=7`)
  }

  const requestOtherFeeds = (token, accountId, active) => {
    console.log('GET otherEpisode api콜 발생')
    console.log(accountId)
    console.log(active)
    const formData = new FormData()

    formData.append('accountId', accountId)
    formData.append('withFollowing', active)
    api.setHeader('x-auth', token)

    return api.get(`/api/feeds?accountId=${accountId}&withFollowing=${active}&size=7`)
  }

  const postFollow = (token, id) => {
    console.log('POST account/follow api콜 발생')
    const formData = new FormData()

    formData.append('id', id)
    api.setHeader('x-auth', token)

    return api.post(`/api/accounts/follow`, formData)
  }

  const deleteFollow = (token, id) => {
    console.log('DELETE account/follow api콜 발생')

    api.setHeader('x-auth', token)

    return api.delete(`/api/accounts/follow?id=${id}`)
    // return api.delete(`/api/accounts/${accountId}/follow`, formData)
  }

  // episode
  const postEpisode = (token) => {
    console.log('POST episode api콜 발생')
    api.setHeader('x-auth', token)

    return api.post(`/api/episodes`)
  }

  const putEpisode = (token, episodeId, active) => {
    console.log('PUT episode api콜 발생')
    console.log(token)
    console.log(episodeId)
    console.log(active)
    const formData = new FormData()

    formData.append('id', episodeId)
    formData.append('active', active)
    api.setHeader('x-auth', token)

    return api.put(`/api/episodes/${episodeId}?active=${active}`)
  }

  const requestSingleEpisode = (token, episodeId) => {
    console.log('GET singleEpisode api콜 발생')
    const formData = new FormData()

    formData.append('episodeId', episodeId)
    api.setHeader('x-auth', token)

    return api.get(`/api/episodes/${episodeId}`)
  }

  // content
  const postContent = (token, episodeId, fileType, file, message) => {
    console.log('POST content api콜 발생')
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
    formData.append('message', message)
    api.setHeader('x-auth', token)

    return api.post(`/api/contents`, formData)
  }

  const postLike = (token, contentId) => {
    console.log('POST content/like api콜 발생')
    const formData = new FormData()

    formData.append('contentId', contentId)
    api.setHeader('x-auth', token)

    return api.post(`/api/contents/like`, formData)
  }

  const deleteLike = (token, contentId) => {
    console.log('DELETE content/like api콜 발생')
    const formData = new FormData()

    formData.append('contentId', contentId)
    api.setHeader('x-auth', token)
    console.log(contentId)

    return api.delete(`/api/contents/like?contentId=${contentId}`)
    // return api.delete(`/api/contents/like`, { data: {formData} })
  }

  // comment
  const postComment = (token, contentId, message) => {
    console.log('POST comment api콜 발생')
    const formData = new FormData()

    formData.append('contentId', contentId)
    formData.append('message', message)
    api.setHeader('x-auth', token)

    return api.post(`/api/comments`, formData)
  }

  const getComment = (token, episodeId) => {
    console.log(episodeId)
    console.log('GET comment api콜 발생')
    api.setHeader('x-auth', token)

    return api.get(`/api/comments?owner=episode&ownerId=${episodeId}`)
  }

  // feeds
  const getBestFeeds = (token) => {
    console.log('GET bestFeeds api콜 발생')
    api.setHeader('x-auth', token)

    return api.get(`/api/feeds/best?size=5`)
  }

  // noties
  const getNoties = (token) => {
    console.log('GET noties api콜 발생')
    api.setHeader('x-auth', token)

    return api.get(`/api/notifications`)
  }

  return {
    // a list of the API functions from step 2
    getCity,

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

    postFollow,
    deleteFollow,

    postEpisode,
    putEpisode,
    requestSingleEpisode,

    postContent,
    postLike,
    deleteLike,

    postComment,
    getComment,

    getBestFeeds,

    getNoties
  }
}

// let's return back our create method as the default.
export default {
  create
}
