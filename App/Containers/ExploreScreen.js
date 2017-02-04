import React, { Component, PropTypes } from 'react'
import {
  View,
  ScrollView,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

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
      refreshing: false
    }
  }

  componentDidMount () {
    const { token } = this.props

    this.props.requestBestFeeds(token)
  }

  componentWillReceiveProps (nextProps) {
    // TODO: 결국엔 스테이트를 false로 바꾸는 것이므로 통일하기.
    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
    } else {
      console.log('아이템다름')
    }
    if (this.state.refreshing) {
      this.setState({refreshing: false})
    }
  }

  onRefresh () {
    const { token } = this.props

    this.setState({refreshing: true})
    this.props.requestBestFeeds(token)
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: 'black', flex: 1}}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />}
          >
            <ExploreList
              token={this.props.token}
              items={this.props.items}
              requestBestFeeds={this.props.requestBestFeeds}
              postFollow={this.props.postFollow}
              deleteFollow={this.props.deleteFollow} />
          </ScrollView>
          <View style={{height: 48.5}} />
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
