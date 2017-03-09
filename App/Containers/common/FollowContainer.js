import { connect } from 'react-redux'
import FollowList from '../../Components/FollowList'

import AccountActions from '../../Redux/AccountRedux'

const mapStateToProps = (state) => {
  return {
    follows: state.account.follows
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    postFollow: (token, id) => dispatch(AccountActions.followPost(token, id)),
    deleteFollow: (token, id) => dispatch(AccountActions.followDelete(token, id))
  }
}

const FollowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowList)

export default FollowContainer
