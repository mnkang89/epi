import React, { Component } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import ExploreDetail from './ExploreDetail'
import AccountActions from '../../Redux/AccountRedux'
import FeedActions from '../../Redux/FeedRedux'

class ExploreList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      follow: 'gray'
    }
  }

  componentWillReceiveProps (nextProps) {
    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
      this.setState({refreshing: false})
    } else {
      console.log('아이템다름')
      console.log(nextProps.items)
      console.log(this.props.items)
      console.log('윌리시브에서 리프레슁 상태 1')
      console.log(this.state.refreshing)
      if (this.state.refreshing) {
        this.setState({refreshing: false})
        console.log('윌리시브에서 리프레슁 상태 2')
        setTimeout(() => {
          console.log(this.state.refreshing)
        }, 100)
      }
    }
  }

  componentDidMount () {
    const { token } = this.props

    this.isAttempting = true
    this.props.requestBestFeeds(token)
  }

  onRefresh () {
    console.log('onRefresh에서 리프레슁 상태')
    console.log(this.state.refreshing)
    const { token } = this.props

    this.setState({refreshing: true})
    this.props.requestBestFeeds(token)
  }

  renderExplores () {
    return this.props.items.map(item =>
      <ExploreDetail
        key={item.episode.id}
        episode={item.episode}
        account={item.account}
        following={item.following} />)
  }

  render () {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />}
      >
        {this.renderExplores()}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    accountId: state.token.id,

    items: state.feed.bestFeeds
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestBestFeeds: (token) => dispatch(FeedActions.bestFeedsRequest(token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreList)
