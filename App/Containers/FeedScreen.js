// @flow
// EPISODE

import React, { Component } from 'react';
import { ScrollView, Text, Image, View } from 'react-native';
import { Actions as NavigationActions } from 'react-native-router-flux';
import { Images } from '../Themes';
import RoundedButton from '../Components/RoundedButton';
import AlbumList from '../Components/common/AlbumList';

// Styles
import styles from './Styles/FeedScreenStyle'

export default class FeedScreen extends Component {

  render () {
    return (
      <View style={styles.mainContainer}>
        <AlbumList />
      </View>
    )
  }
}
