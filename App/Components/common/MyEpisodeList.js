import React, { Component } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import EpisodeDetail from './EpisodeDetail'
import styles from '../../Containers/Styles/FeedScreenStyle'
import { Colors } from '../../Themes'
import AccountActions from '../../Redux/AccountRedux'

class MyEpisodeList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      apisodes: [],
      albums: [],
      follow: 'gray'
    }
  }

  componentWillMount () {
    const { token, accountId } = this.props
    const active = false

    this.isAttempting = true
    // attempt to check email - a saga is listening to pick it up from here.
    this.props.requestInfo(token, accountId)
    this.props.requestUserEpisodes(token, active)

    axios.get('https://rallycoding.herokuapp.com/api/music_albums')
      .then(response => this.setState({ albums: response.data }))
  }

  renderEpisodes () {
    /*
    return this.props.episodes.map(episode =>
      <EpisodeDetail key={episode.id} episode={episode} />)
    */
    console.log(this.props.episodes)
    return this.props.episodes.map(episode =>
      <EpisodeDetail key={episode.id} episode={episode} />)
  }

  render () {
    console.log(this.props)
    return (
      <ScrollView>
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

    episodes: state.account.episodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestUserEpisodes: (token, active) => dispatch(AccountActions.userEpisodesRequest(token, active))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyEpisodeList)
