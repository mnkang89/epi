import React, { Component } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import FeedDetail from './FeedDetail'
import styles from '../../Containers/Styles/FeedScreenStyle'
import { Colors } from '../../Themes'
import AccountActions from '../../Redux/AccountRedux'

class MyEpisodeList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: [],
      follow: 'gray'
    }
  }

  componentWillMount () {
    const { token, accountId } = this.props
    this.isAttempting = true
    // attempt to check email - a saga is listening to pick it up from here.
    this.props.requestInfo(token, accountId)

    axios.get('https://rallycoding.herokuapp.com/api/music_albums')
      .then(response => this.setState({ albums: response.data }))
  }

  renderEpisodes () {
    return this.state.albums.map(album =>
      <FeedDetail key={album.title} album={album} />)
  }

  render () {
    console.log(this.props)
    console.log(this.props.numberOfFollowing)
    console.log(this.props.numberOfFollower)
    return (
      <ScrollView>
        <View style={{alignItems: 'center', backgroundColor: '#000000'}}>
          <View style={{flex: 2}}>
            <Image
              style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 14.5, marginTop: 39.5}]}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{color: Colors.snow, fontSize: 25, fontWeight: 'bold'}}>{this.props.nickname}</Text>
            <View style={{flexDirection: 'row', marginTop: 10.5, marginBottom: 25.5}}>
              <TouchableOpacity>
                <Text style={{color: Colors.snow, fontSize: 12}}>팔로워 {this.props.numberOfFollower}</Text>
              </TouchableOpacity>
              <Text style={{color: Colors.snow, fontSize: 12}}> | </Text>
              <TouchableOpacity>
                <Text style={{color: Colors.snow, fontSize: 12}}>팔로잉 {this.props.numberOfFollowing} </Text>
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
    numberOfFollower: state.account.numberOfFollower,
    numberOfFollowing: state.account.numberOfFollowing
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyEpisodeList)
