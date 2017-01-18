import React, { Component, PropTypes } from 'react'
import {
  View
} from 'react-native'
import { connect } from 'react-redux'

import ExploreList from '../Components/ExploreList'
import styles from './Styles/FeedScreenStyle'

import FeedActions from '../Redux/FeedRedux'
import AccountActions from '../Redux/AccountRedux'

class ExploreScreen extends Component {

  static propTypes = {
    token: PropTypes.string,
    items: PropTypes.array.isRequired,

    requestBestFeeds: PropTypes.func,
    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    const { token } = this.props

    this.isAttempting = true
    this.props.requestBestFeeds(token)
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: 'black', flex: 1}}>
          <ExploreList
            token={this.props.token}
            items={this.props.items}
            requestBestFeeds={this.props.requestBestFeeds}
            postFollow={this.props.postFollow}
            deleteFollow={this.props.deleteFollow}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    items: state.feed.bestFeeds
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestBestFeeds: (token) => dispatch(FeedActions.bestFeedsRequest(token)),

    postFollow: (token, id) => dispatch(AccountActions.followPost(token, id)),
    deleteFollow: (token, id) => dispatch(AccountActions.followDelete(token, id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen)
