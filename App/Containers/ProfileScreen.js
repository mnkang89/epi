// @flow
// EPISODE

import React, { Component } from 'react'
import { View } from 'react-native'
import MyEpisodeList from '../Components/common/MyEpisodeList'

// Styles
import styles from './Styles/FeedScreenStyle'

export default class ProfileScreen extends Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <MyEpisodeList />
        <View style={{height: 50}} />
      </View>
    )
  }
}
