// @flow
// EPISODE

import React, { Component } from 'react'
import { View, InteractionManager, Text } from 'react-native'
import UserFeedList from '../Components/common/UserFeedList'

// Styles
import styles from './Styles/FeedScreenStyle'

export default class UserProfileScreen extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {renderPlaceholderOnly: true}
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      this.setState({renderPlaceholderOnly: false})
    })
  }

  render () {
    if (this.state.renderPlaceholderOnly) {
      return this._renderPlaceholderView()
    }

    return (
      <View style={styles.mainContainer}>
        <UserFeedList />
      </View>
    )
  }

  _renderPlaceholderView () {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

}
