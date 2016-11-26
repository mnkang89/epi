import React, { Component } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native'
import axios from 'axios'
import FeedDetail from './FeedDetail'
import styles from '../../Containers/Styles/FeedScreenStyle'
import { Colors } from '../../Themes'

class MyEpisodeList extends Component {
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

  renderEpisodes () {
    return this.state.albums.map(album =>
      <FeedDetail key={album.title} album={album} />)
  }

  render () {
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
            <Text style={{color: Colors.snow, fontSize: 25, fontWeight: 'bold'}}>신촌초보</Text>
            <View style={{flexDirection: 'row', marginTop: 10.5, marginBottom: 25.5}}>
              <TouchableOpacity>
                <Text style={{color: Colors.snow, fontSize: 12}}>팔로워 10 </Text>
              </TouchableOpacity>
              <Text style={{color: Colors.snow, fontSize: 12}}> | </Text>
              <TouchableOpacity>
                <Text style={{color: Colors.snow, fontSize: 12}}>팔로잉 25 </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {this.renderEpisodes()}
      </ScrollView>
    )
  }

}

export default MyEpisodeList
