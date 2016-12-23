import React, { Component } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import { Colors } from '../../Themes'
import EpisodeDetail from './EpisodeDetail'
import styles from '../../Containers/Styles/FeedScreenStyle'

import AccountActions from '../../Redux/AccountRedux'
import EpisodeActions from '../../Redux/EpisodeRedux'

class UserEpisodeList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      episodes: [],
      follow: 'gray'
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('fetch성공')
    console.log(this.props)
  }

  componentWillMount () {
    console.log(this.props)
    const { token, id } = this.props
    const active = false

    this.isAttempting = true

    this.props.requestOtherInfo(token, id)
    this.props.requestOtherEpisodes(token, id, active)
  }

  renderEpisodes () {
    return this.props.items.map(item =>
      <EpisodeDetail key={item.episode.id} episode={item.episode} />)
  }

  renderProfileInfo () {
    return (
      <View style={{alignItems: 'center', backgroundColor: '#000000'}}>
        <View style={{flex: 2}}>
          <Image
            style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 14.5, marginTop: 39.5}]}
            source={{uri: this.props.profileImagePath}}
          />
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{color: Colors.snow, fontSize: 25, fontWeight: 'bold'}}>{this.props.nickname}</Text>
          <View style={{flexDirection: 'row', marginTop: 10.5, marginBottom: 25.5}}>
            <TouchableOpacity>
              <Text style={{color: Colors.snow, fontSize: 12}}>팔로워 {this.props.followerCount}</Text>
            </TouchableOpacity>
            <Text style={{color: Colors.snow, fontSize: 12}}> | </Text>
            <TouchableOpacity>
              <Text style={{color: Colors.snow, fontSize: 12}}>팔로잉 {this.props.followingCount} </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  render () {
    return (
      <ScrollView>
        {this.renderProfileInfo()}
        {this.renderEpisodes()}
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,

    nickname: state.account.otherNickname,
    profileImagePath: state.account.otherProfileImagePath,
    followerCount: state.account.otherFollowerCount,
    followingCount: state.account.otherFollowingCount,

    items: state.episode.otherEpisodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestOtherInfo: (token, accountId) => dispatch(AccountActions.otherInfoRequest(token, accountId)),
    requestOtherEpisodes: (token, accountId, active) => dispatch(EpisodeActions.otherEpisodesRequest(token, accountId, active))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEpisodeList)
