// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userContentPost: [
    'token',
    'episodeId',
    'fileType',
    'file'
  ],
  userContentPostSuccess: [
    'contentId'
  ],
  userContentPostFailure: [
    'error'
  ]
})

export const ContentTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  episodeId: null,
  fileType: null,
  file: null,
  contentId: null,
  contentPosting: false,
  error: null
})

/* ------------- Reducers ------------- */

// we're attempting to check posting Content
export const postContent = (state: Object, { token, episodeId, fileType, file }: Object) =>
  state.merge({ contentPosting: true, episodeId, fileType, file })

// we've successfully posting Content
export const postContentSuccess = (state: Object, { contentId }: Object) =>
  state.merge({ contentPosting: false, error: null, contentId })

// we've had a problem posting Content
export const postContentFailure = (state: Object, { error }: Object) =>
  state.merge({ contentPosting: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_CONTENT_POST]: postContent,
  [Types.USER_CONTENT_POST_SUCCESS]: postContentSuccess,
  [Types.USER_CONTENT_POST_FAILURE]: postContentFailure
})
