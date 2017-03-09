import { connect } from 'react-redux'
import FollowModal from '../../Components/common/FollowModal'

import AccountActions from '../../Redux/AccountRedux'

const mapStateToProps = (state) => {
  return {
    showType: state.account.showType,
    followVisible: state.account.followVisible
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openFollow: (followVisible, showType) => dispatch(AccountActions.openFollow(followVisible, showType))
  }
}

const FollowModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowModal)

export default FollowModalContainer
