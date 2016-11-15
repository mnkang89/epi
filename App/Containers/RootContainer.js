// @flow

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import DebugSettings from '../Config/DebugSettings'
import NavigationRouter from '../Navigation/NavigationRouter'

// Styles
import styles from './Styles/RootContainerStyle'

export default class RootContainer extends Component {
  componentDidMount () {
  }

  render () {
    console.disableYellowBox = !DebugSettings.yellowBox
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <NavigationRouter />
      </View>
    )
  }
}
