import { connect } from 'react-redux'
import FollowModal from '../../Components/common/FollowModal'

import AccountActions from '../../Redux/AccountRedux'

const mapStateToProps = (state) => {
  return {
    showType: state.account.showType,
    followVisible: state.account.followVisible,
    follows: state.account.follows
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openFollow: (followVisible, showType) => dispatch(AccountActions.openFollow(followVisible, showType)),
    postFollow: (token, id) => dispatch(AccountActions.followPost(token, id)),
    deleteFollow: (token, id) => dispatch(AccountActions.followDelete(token, id))
  }
}

const FollowModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowModal)

export default FollowModalContainer
