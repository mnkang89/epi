// @flow
// EPISODE

import React, { Component } from 'react'
import { View } from 'react-native'
import UserEpisodeList from '../Components/common/UserEpisodeList'

// Styles
import styles from './Styles/FeedScreenStyle'

export default class UserProfileScreen extends Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <UserEpisodeList id={this.props.id} />
        <View style={{height: 50}} />
      </View>
    )
  }
}
