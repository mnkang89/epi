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
  ],

  likePost: [
    'token',
    'contentId'
  ],
  likePostSuccess: [
    'response'
  ],
  likePostFailure: [
    'error'
  ],

  likeDelete: [
    'token',
    'contentId'
  ],
  likeDeleteSuccess: [
    'response'
  ],
  likeDeleteFailure: [
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
  error: null,

  likePosting: false,
  likeDeleting: false
})

/* ------------- Reducers ------------- */

// we're attempting to check posting Content
export const postContent = (state: Object, { token, episodeId, fileType, file }: Object) =>
  state.merge({ contentPosting: true, episodeId, fileType, file })

export const postContentSuccess = (state: Object, { contentId }: Object) =>
  state.merge({ contentPosting: false, error: null, contentId })

export const postContentFailure = (state: Object, { error }: Object) =>
  state.merge({ contentPosting: false, error })

// like POST
export const postLike = (state: Object, { token, contentId }: Object) =>
  state.merge({ likePosting: true })

export const postLikeSuccess = (state: Object, { response }: Object) =>
  state.merge({ likePosting: false })

export const postLikeFailure = (state: Object, { error }: Object) =>
  state.merge({ likePosting: false })

// like DELETE
export const deleteLike = (state: Object, { token, contentId }: Object) =>
  state.merge({ likeDeleting: true })

export const deleteLikeSuccess = (state: Object, { response }: Object) =>
  state.merge({ likeDeleting: false })

export const deleteLikeFailure = (state: Object, { error }: Object) =>
  state.merge({ likeDeleting: false })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_CONTENT_POST]: postContent,
  [Types.USER_CONTENT_POST_SUCCESS]: postContentSuccess,
  [Types.USER_CONTENT_POST_FAILURE]: postContentFailure,

  [Types.LIKE_POST]: postLike,
  [Types.LIKE_POST_SUCCESS]: postLikeSuccess,
  [Types.LIKE_POST_FAILURE]: postLikeFailure,

  [Types.LIKE_DELETE]: deleteLike,
  [Types.LIKE_DELETE_SUCCESS]: deleteLikeSuccess,
  [Types.LIKE_DELETE_FAILURE]: deleteLikeFailure
})
