import { connect } from 'react-redux'
import CommentList from '../../Components/CommentList'

import CommentActions from '../../Redux/CommentRedux'

const mapStateToProps = (state) => {
  return {
    contentId: state.comment.contentId,
    episodeId: state.comment.episodeId,

    comments: state.comment.comments,
    commentPosting: state.comment.commentPosting,
    commentDeleting: state.comment.commentDeleting
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId)),
    deleteComment: (token, episodeId, contentId, commentId) => dispatch(CommentActions.commentDelete(token, episodeId, contentId, commentId))
  }
}

const CommentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentList)

export default CommentContainer
