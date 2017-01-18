import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'

import EpisodeDetail from './common/EpisodeDetail'

class FeedList extends Component {

  static propTypes = {
    items: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
    }
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
      )
    } else {
      return (
        <View>
          {this.renderEpisodes()}
        </View>
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
