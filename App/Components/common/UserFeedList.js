import React, { Component } from 'react'
import { Modal, ScrollView, View, Image, TouchableOpacity, Text } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import FeedDetail from './FeedDetail'
import FollowerList from './FollowerList'
import FollowingList from './FollowList'
import styles from '../../Containers/Styles/FeedScreenStyle'
import { Colors, Images } from '../../Themes'

class UserFeedList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: [],
      follow: false,
      modalVisible: false,
      followState: ''
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

  setModalVisible () {
    this.setState({
      modalVisible: false
    })
  }

  followerPress () {
    this.setState({
      modalVisible: true,
      followState: '팔로워'
    })
  }

  followingPress () {
    this.setState({
      modalVisible: true,
      followState: '팔로잉'
    })
  }

  renderFollowComponent () {
    if (this.state.followState === '팔로워') {
      console.log('팔로워')
      return (
        <FollowerList />
      )
    } else {
      console.log('팔로잉')
      return (
        <FollowingList />
      )
    }
  }

  renderFollow () {
    if (this.state.follow) {
      return (
        <Image
          style={{width: 55.05, height: 27.9}}
          source={Images.fllwingBtn}
        />
      )
    } else {
      return (
        <Image
          style={{width: 55.05, height: 27.9}}
          source={Images.fllwBtn}
        />
      )
    }
  }

  render () {
    return (
      <ScrollView>
        <View style={{alignItems: 'center', backgroundColor: '#000000'}}>
          <View style={{flex: 2}}>
            <Image
              style={[styles.image, {borderWidth: 0.5, borderColor: 'white', marginBottom: 14.5, marginTop: 39.5}]}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{color: Colors.snow, fontSize: 25, fontWeight: 'bold'}}>신촌초보</Text>
            <View style={{flexDirection: 'row', marginTop: 10.5}}>
              <TouchableOpacity onPress={() => this.followerPress()}>
                <Text style={{color: Colors.snow, fontSize: 12}}>팔로워 10 </Text>
              </TouchableOpacity>
              <Text style={{color: Colors.snow, fontSize: 12}}> | </Text>
              <TouchableOpacity onPress={() => this.followingPress()}>
                <Text style={{color: Colors.snow, fontSize: 12}}>팔로잉 25 </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{marginTop: 15}}
              onPress={() => {
                this.setState({follow: !this.state.follow})
              }}>
              {this.renderFollow()}
            </TouchableOpacity>
          </View>
        </View>
        {this.renderFeeds()}
        <Modal
          animationType={'slide'}
          transparent
          visible={this.state.modalVisible}>
          <View style={styles2.containerStyle}>
            <View style={{backgroundColor: 'white', flex: 1, marginTop: 151, borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
              <View style={{flexDirection: 'row', height: 42.5, marginRight: 4.5, marginLeft: 4.5, borderBottomWidth: 0.5, borderBottomColor: 'rgb(204, 204, 204)'}}>
                <TouchableOpacity
                  onPress={() => {
                    console.log(this.state.modalVisible)
                    this.setModalVisible()
                    console.log(this.state.modalVisible)
                  }}
                  style={{paddingTop: 10, paddingLeft: 16}}>
                  <Icon
                    name='chevron-down'
                    size={16}
                    style={{width: 16, height: 16, alignSelf: 'center', fontWeight: '300'}}
                  />
                </TouchableOpacity>
                <Text style={{left: 140, marginTop: 10, fontSize: 17, fontWeight: 'bold'}}>{this.state.followState}</Text>
              </View>
              {this.renderFollowComponent()}
            </View>
          </View>
        </Modal>
      </ScrollView>
    )
  }

}

const styles2 = {
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  },
  textContainer: {
    marginLeft: 6,
    marginRight: 6,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center'
  },
  sendContainer: {
    marginTop: 5,
    marginBottom: 5,
    width: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  sendButton: {
    fontSize: 13,
    color: 'white'
  }
}

export default UserFeedList
