// a library to wrap and simplify api calls
import apisauce from 'apisauce'

// our "constructor"
const create = (baseURL = 'http://alphaca-staging.ap-northeast-2.elasticbeanstalk.com/') => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
    },
    // 10 second timeout...
    timeout: 10000
  })

  // Force OpenWeather API Key on all requests
  // api.addRequestTransform((request) => {
  //
  // })

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in __DEV__ and only
  // if we've attached Reactotron to console (it isn't during unit tests).
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

  return {
    // a list of the API functions from step 2
    getCity,
    checkEmail
  }
}

// let's return back our create method as the default.
export default {
  create
}
