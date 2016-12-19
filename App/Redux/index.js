// @flow

import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    temperature: require('./TemperatureRedux').reducer,
    login: require('./LoginRedux').reducer,
    signup: require('./SignupRedux').reducer,
    token: require('./TokenRedux').reducer,
    account: require('./AccountRedux').reducer,
    episode: require('./EpisodeRedux').reducer,
    content: require('./ContentRedux').reducer,
    comment: require('./CommentRedux').reducer
  })

  return configureStore(rootReducer, rootSaga)
}
