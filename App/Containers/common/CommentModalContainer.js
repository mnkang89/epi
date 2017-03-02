import { connect } from 'react-redux'
import CommentModal from '../../Components/common/CommentModal'

import CommentActions from '../../Redux/CommentRedux'

const mapStateToProps = (state) => {
  return {
    contentId: state.comment.contentId,
    episodeId: state.comment.episodeId,

    visible: state.comment.visible,

    comments: state.comment.comments,
    commentPosting: state.comment.commentPosting,
    commentDeleting: state.comment.commentDeleting
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetCommentModal: () => dispatch(CommentActions.resetComment()),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId)),
    postComment: (token, episodeId, contentId, message) => dispatch(CommentActions.commentPost(token, episodeId, contentId, message)),
    deleteComment: (token, episodeId, contentId, commentId) => dispatch(CommentActions.commentDelete(token, episodeId, contentId, commentId))
  }
}

const CommentModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentModal)

export default CommentModalContainer
