import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import { connect } from 'react-redux'

import ExploreDetail from './ExploreDetail'
import AccountActions from '../../Redux/AccountRedux'
import FeedActions from '../../Redux/FeedRedux'

class ExploreList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      follow: 'gray'
    }
  }

  componentDidMount () {
    const { token } = this.props

    this.isAttempting = true
    this.props.requestBestFeeds(token)
  }

  renderExplores () {
    return this.props.items.map(item =>
      <ExploreDetail key={item.episode.id} episode={item.episode} following={item.following} nickname={item.account.nickname} profileImagePath={item.account.profileImagePath} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderExplores()}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    accountId: state.token.id,

    nickname: state.account.nickname,
    profileImagePath: state.account.profileImagePath,
    followerCount: state.account.followerCount,
    followingCount: state.account.followingCount,

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
