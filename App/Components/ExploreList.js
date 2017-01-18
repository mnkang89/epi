import React, { Component, PropTypes } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import _ from 'lodash'

import ExploreDetail from './ExploreDetail'

/*
  1) TODO: 스크롤뷰 스크린단으로 이동하기,
  2) TODO: 리프레쉬 컨트롤 스크린단으로 이동하기
*/

class ExploreList extends Component {

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

  componentWillReceiveProps (nextProps) {
    // TODO: 결국엔 스테이트를 false로 바꾸는 것이므로 통일하기.
    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
      this.setState({refreshing: false})
    } else {
      console.log('아이템다름')
      if (this.state.refreshing) {
        this.setState({refreshing: false})
      }
    }
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
        token={this.props.token}
        following={item.following}
        episode={item.episode}
        account={item.account}
        postFollow={this.props.postFollow}
        deleteFollow={this.props.deleteFollow} />
    )
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

export default ExploreList
