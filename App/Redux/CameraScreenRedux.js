// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import Camera from 'react-native-camera'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initialize: [],
  setPermission: [
    'permission'
  ],
  changeCameraType: [],
  backToHome: [],
  backToReadyToTakeContent: [],
  takeContent: [
    'contentType',
    'contentPath'
  ],
  registerContentText: [
    'message'
  ],
  toggleMessageWriteAble: [],
  postContent: [
    'contentType',
    'contentPath',
    'thumbnailPath',
    'message'
  ],
  endCameraScreen: [],
  failToPostContent: [],
  getActiveEpisode: [],
  setActiveEpisode: [
    'activeEpisodeId'
  ],
  deactiveEpisode: [
    'activeEpisodeId'
  ]
})

export default Creators
export const CameraScreenTypes = Types
/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  permission: false,
  cameraType: Camera.constants.Type.back,
  isContentTaken: false,
  contentPath: null,
  contentType: null,
  postImage: null,
  endScreen: false,
  activeEpisodeId: null,
  message: null,
  messageWritable: false
})

export const initialize = (state: Object) => {
  return state.merge({
    isContentTaken: false,
    contentPath: null,
    contentType: null,
    postImage: null,
    endScreen: false,
    activeEpisodeId: null,
    message: null,
    messageWritable: false
  })
}

export const setPermission = (state: Object, { permission } : Object) => {
  return state.merge({ permission: permission })
}

export const changeCameraType = (state: Object) => {
  if (state.cameraType === Camera.constants.Type.back) {
    return state.merge({cameraType: Camera.constants.Type.front})
  } else {
    return state.merge({cameraType: Camera.constants.Type.back})
  }
}
export const backToHome = (state: Object) => {
  return state.merge({ endScreen: true })
}

export const backToReadyToTakeContent = (state : Object) =>
  state.merge({
    isContentTaken: false,
    contentPath: null,
    contentType: null,
    message: null,
    messageWritable: false
  })

export const takeContent = (state : Object, { contentType, contentPath } : Object) =>
  state.merge({
    isContentTaken: true,
    contentPath: contentPath,
    contentType: contentType
  })

export const registerContentText = (state : Object, { message } : Object) => {
  return state.merge({
    message: message
  })
}

export const toggleMessageWriteAble = (state : Object) => {
  return state.merge({
    messageWritable: !state.messageWritable
  })
}

export const postContent = (state : Object, { contentType, contentPath, thumbnailPath, message }) => {
  return state.merge({ postImage: true })
}

export const endCameraScreen = (state : Object) => {
  return state.merge({ endScreen: true })
}

export const failToPostConent = (state : Object) => {
  return state
}

export const getActiveEpisode = (state : Object) => {
  return state
}

export const setActiveEpisode = (state : Object, { activeEpisodeId } :Object) => {
  return state.merge({ activeEpisodeId: activeEpisodeId })
}

export const deactiveEpisode = (state : Object, { activeEpsidoeId } :Object) => {
  return state
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INITIALIZE]: initialize,
  [Types.SET_PERMISSION]: setPermission,
  [Types.CHANGE_CAMERA_TYPE]: changeCameraType,
  [Types.BACK_TO_HOME]: backToHome,
  [Types.TAKE_CONTENT]: takeContent,
  [Types.BACK_TO_READY_TO_TAKE_CONTENT]: backToReadyToTakeContent,
  [Types.REGISTER_CONTENT_TEXT]: registerContentText,
  [Types.TOGGLE_MESSAGE_WRITE_ABLE]: toggleMessageWriteAble,
  [Types.POST_CONTENT]: postContent,
  [Types.END_CAMERA_SCREEN]: endCameraScreen,
  [Types.FAIL_TO_POST_CONTENT]: failToPostConent,
  [Types.GET_ACTIVE_EPISODE]: getActiveEpisode,
  [Types.SET_ACTIVE_EPISODE]: setActiveEpisode,
  [Types.DEACTIVE_EPISODE]: deactiveEpisode
})
