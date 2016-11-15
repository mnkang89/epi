import React, { Component } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import axios from 'axios'
import FeedDetail from './FeedDetail'
import styles from '../../Containers/Styles/FeedScreenStyle'
import { Colors } from '../../Themes'

class UserFeedList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: [],
      follow: 'gray'
    }
  }

  componentWillMount () {
    axios.get('https://rallycoding.herokuapp.com/api/music_albums')
      .then(response => this.setState({ albums: response.data }))
  }

  renderFeeds () {
    return this.state.albums.map(album =>
      <FeedDetail key={album.title} album={album} />)
  }

  render () {
    return (
      <ScrollView>
        <View style={{alignItems: 'center', backgroundColor: '#000000'}}>
          <View style={{flex: 2}}>
            <Image
              style={styles.image}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{color: Colors.snow}}>신촌초보</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => NavigationActions.followerScreen({type: 'reset'})}>
                <Text style={{color: Colors.snow}}>팔로워 10 </Text>
              </TouchableOpacity>
              <Text style={{color: Colors.snow}}> | </Text>
              <TouchableOpacity onPress={() => NavigationActions.followScreen({type: 'reset'})}>
                <Text style={{color: Colors.snow}}>팔로잉 25 </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                width: 70,
                marginTop: 5,
                marginBottom: 10,
                paddingTop: 5,
                paddingBottom: 5,
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 50,
                backgroundColor: this.state.follow}}
              onPress={() => {
                if (this.state.follow === 'gray') {
                  this.setState({follow: '#296CA3'})
                } else {
                  this.setState({follow: 'gray'})
                }
              }}>
              <Text style={{color: 'white'}}>+팔로우</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.renderFeeds()}
      </ScrollView>
    )
  }

}

export default UserFeedList
