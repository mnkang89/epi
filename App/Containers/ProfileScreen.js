// @flow
// EPISODE

import React, { Component } from 'react';
import { ScrollView, Text, Image, View } from 'react-native';
import { Actions as NavigationActions } from 'react-native-router-flux';
import { Images } from '../Themes';
import RoundedButton from '../Components/RoundedButton';
import AlbumList from '../Components/common/AlbumList';
import { Colors, Metrics } from '../Themes'

// Styles
import styles from './Styles/FeedScreenStyle'

export default class ProfileScreen extends Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{flex:3, alignItems: 'center', backgroundColor: '#000000'}}>
          <View style={{flex:2}}>
            <Image
              style={styles.image}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
            <View style={styles.badge} />
          </View>
          <View style={{ flex:1 }}>
            <View style={{alignItems: 'center'}}>
              <Text style={{ color: Colors.snow}}>신촌초보</Text>
            </View>
            <Text style={{ color: Colors.snow}}>팔로워 10 | 팔로잉 25</Text>
          </View>
        </View>

        <View style={{flex:8}}>
          <AlbumList />
        </View>
      </View>
    )
  }
}
