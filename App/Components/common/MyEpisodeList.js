import React, { Component } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import { Colors } from '../../Themes'
import EpisodeDetail from './EpisodeDetail'
import styles from '../../Containers/Styles/FeedScreenStyle'

import AccountActions from '../../Redux/AccountRedux'
import EpisodeActions from '../../Redux/EpisodeRedux'

class MyEpisodeList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      apisodes: [],
      follow: 'gray'
    }
  }

  componentDidMount () {
    /*
      const { token, accountId } = this.props
      const active = false

      this.isAttempting = true
      // attempt to check email - a saga is listening to pick it up from here.
      this.props.requestInfo(token, accountId)
      this.props.requestUserEpisodes(token, accountId, active)
    */
  }

  onProfileImagePress () {
    //
  }

  renderEpisodes () {
    return this.props.items.map(item =>
      <EpisodeDetail key={item.episode.id} episode={item.episode} />)
  }

  renderProfileInfo () {
    return (
      <View style={{alignItems: 'center', backgroundColor: '#000000'}}>
        <View style={{flex: 2}}>
          <TouchableOpacity onPress={this.onProfileImagePress()}>
            <Image
              style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 14.5, marginTop: 39.5}]}
              source={{uri: this.props.profileImagePath}} />
          </TouchableOpacity>
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
    accountId: state.token.id,

    nickname: state.account.nickname,
    profileImagePath: state.account.profileImagePath,
    followerCount: state.account.followerCount,
    followingCount: state.account.followingCount,

    items: state.episode.episodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestUserEpisodes: (token, accountId, active) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, active))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyEpisodeList)
