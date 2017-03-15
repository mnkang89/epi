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
  ],

  commentDelete: [
    'token',
    'episodeId',
    'contentId',
    'commentId'
  ],
  commentDeleteSuccess: [

  ],
  commentDeleteFailure: [
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
  comments: [],

  commentDeleting: false
})

/* ------------- Reducers ------------- */

export const resetComment = (state: Object) =>
  INITIAL_STATE

export const openComment = (state: Object, { visible }: Object) =>
  state.merge({ visible })

// we're attempting to check posting Comment
export const postComment = (state: Object) =>
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

// we're attempting to deleting Comment
export const deleteComment = (state: Object, { token, episodeId, contentId, commentId }: Object) =>
  state.merge({ commentDeleting: true })

export const deleteCommentSuccess = (state: Object, { response }: Object) =>
  state.merge({ commentDeleting: false })

export const deleteCommentFailure = (state: Object, { error }: Object) =>
  state.merge({ commentDeleting: false })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RESET_COMMENT]: resetComment,

  [Types.OPEN_COMMENT]: openComment,

  [Types.COMMENT_POST]: postComment,
  [Types.COMMENT_POST_SUCCESS]: postCommentSuccess,
  [Types.COMMENT_POST_FAILURE]: postCommentFailure,

  [Types.COMMENT_GET]: getComment,
  [Types.COMMENT_GET_SUCCESS]: getCommentSuccess,
  [Types.COMMENT_GET_FAILURE]: getCommentFailure,

  [Types.COMMENT_DELETE]: deleteComment,
  [Types.COMMENT_DELETE_SUCCESS]: deleteCommentSuccess,
  [Types.COMMENT_DELETE_FAILURE]: deleteCommentFailure
})
