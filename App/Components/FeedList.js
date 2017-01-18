import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import _ from 'lodash'

import EpisodeDetail from './common/EpisodeDetail'

// refreshControl을 윗단으로 옮기기엔 피드스크린도 willReceive를 사용하는 상황 -> 커멘트를 컴포넌트화하기
class FeedList extends Component {

  static propTypes = {
    token: PropTypes.string,
    accountId: PropTypes.number,
    items: PropTypes.array.isRequired,

    requestUserEpisodes: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
    } else {
      console.log('아이템다름')
      if (this.state.refreshing) {
        this.setState({refreshing: false})
        setTimeout(() => {
          console.log(this.state.refreshing)
        }, 100)
      }
    }
  }

  onRefresh () {
    const { token, accountId } = this.props
    const withFollowing = true

    this.setState({refreshing: true})
    this.props.requestUserEpisodes(token, accountId, withFollowing)
  }

  renderEpisodes () {
    return this.props.items.map(item =>
      <EpisodeDetail
        key={item.episode.id}
        episode={item.episode}
        account={item.account} />
    )
  }

  renderFeeds () {
    if (this.props.items.length === 0) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />}
          >
          <View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
              <Text style={{fontSize: 60, fontWeight: 'bold', color: 'white'}}>안녕하세요!</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 80}}>
              <Text style={{fontSize: 16, color: 'white'}}>다른 사람들의 에피소드를 구경하고</Text>
              <Text style={{fontSize: 16, color: 'white'}}>팔로우 해보세요!</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 18}}>
              <TouchableOpacity onPress={NavigationActions.searchTab}>
                <View style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 7, paddingRight: 7, borderRadius: 4, borderWidth: 1, borderColor: 'white'}}>
                  <Text style={{fontSize: 16, color: 'white'}}>에피소드 탐색</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )
    } else {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />}
          >
          {this.renderEpisodes()}
        </ScrollView>
      )
    }
  }

  render () {
    return (
      <View>
        {this.renderFeeds()}
      </View>
    )
  }

}

export default FeedList
