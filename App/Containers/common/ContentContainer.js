import { connect } from 'react-redux'
import ContentDetail from '../../Components/common/ContentDetail'

import CommentActions from '../../Redux/CommentRedux'
import ContentActions from '../../Redux/ContentRedux'

const mapStateToProps = (state) => {
  return {
    token: state.token.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openComment: (visible) => dispatch(CommentActions.openComment(visible)),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId)),

    postLike: (token, contentId) => dispatch(ContentActions.likePost(token, contentId)),
    deleteLike: (token, contentId) => dispatch(ContentActions.likeDelete(token, contentId))
  }
}

const ContentContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(ContentDetail)

export default ContentContainer
