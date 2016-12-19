// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  resetComment: [
  ],
  openComment: [
    'visible'
  ],

  commentPost: [
    'token',
    'episodeId',
    'contentId',
    'message'
  ],
  commentPostSuccess: [

  ],
  commentPostFailure: [
    'error'
  ],

  commentGet: [
    'token',
    'episodeId',
    'contentId'
  ],
  commentGetSuccess: [
    'comments'
  ],
  commentGetFailure: [
    'error'
  ]
})

export const CommentTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  commentPosting: false,
  visible: false,
  episodeId: null,
  contentId: null,
  error: null,

  commentsRequesting: false,
  comments: []
})

/* ------------- Reducers ------------- */

export const resetComment = (state: Object) =>
  INITIAL_STATE

export const openComment = (state: Object, { visible }: Object) =>
  state.merge({ visible })

// we're attempting to check posting Comment
export const postComment = (state: Object, { token }: Object) =>
  state.merge({ commentPosting: true })

export const postCommentSuccess = (state: Object) =>
  state.merge({ commentPosting: false, error: null })

export const postCommentFailure = (state: Object, { error }: Object) =>
  state.merge({ conmmentPosting: false, error })

// we're attempting to getting Comment
export const getComment = (state: Object, { episodeId, contentId }: Object) =>
  state.merge({ commentsRequesting: true, episodeId, contentId })

export const getCommentSuccess = (state: Object, { comments }: Object) =>
  state.merge({ commentsRequesting: false, error: null, comments })

export const getCommentFailure = (state: Object, { error }: Object) =>
  state.merge({ commentsRequesting: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RESET_COMMENT]: resetComment,

  [Types.OPEN_COMMENT]: openComment,

  [Types.COMMENT_POST]: postComment,
  [Types.COMMENT_POST_SUCCESS]: postCommentSuccess,
  [Types.COMMENT_POST_FAILURE]: postCommentFailure,

  [Types.COMMENT_GET]: getComment,
  [Types.COMMENT_GET_SUCCESS]: getCommentSuccess,
  [Types.COMMENT_GET_FAILURE]: getCommentFailure
})
