// import { combineReducers } from 'redux'
// import configureStore from './CreateStore'
// import rootSaga from '../Sagas/'
//
// export default () => {
//   /* ------------- Assemble The Reducers ------------- */
//   const rootReducer = combineReducers({
//     github: require('./GithubRedux').reducer,
//     login: require('./LoginRedux').reducer,
//     search: require('./SearchRedux').reducer
//   })
//
//   return configureStore(rootReducer, rootSaga)
// }

// @flow

import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    greeting: require('./GreetingRedux').reducer,
    screen: require('./ScreenRedux').reducer,
    temperature: require('./TemperatureRedux').reducer,
    login: require('./LoginRedux').reducer,
    signup: require('./SignupRedux').reducer,
    token: require('./TokenRedux').reducer,
    account: require('./AccountRedux').reducer,
    episode: require('./EpisodeRedux').reducer,
    content: require('./ContentRedux').reducer,
    comment: require('./CommentRedux').reducer,
    feed: require('./FeedRedux').reducer,
    noti: require('./NotiRedux').reducer,
    cameraScreen: require('./CameraScreenRedux').reducer
  })

  return configureStore(rootReducer, rootSaga)
}
