import { connect } from 'react-redux'
import CommentModal from '../../Components/common/CommentModal'

import CommentActions from '../../Redux/CommentRedux'

const mapStateToProps = (state) => {
  return {
    contentId: state.comment.contentId,
    episodeId: state.comment.episodeId
    // visible: state.comment.visible
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetCommentModal: () => dispatch(CommentActions.resetComment()),
    postComment: (token, episodeId, contentId, message) => dispatch(CommentActions.commentPost(token, episodeId, contentId, message))
  }
}

const CommentModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentModal)

export default CommentModalContainer
