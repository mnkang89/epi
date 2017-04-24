// @flow

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import DebugSettings from '../Config/DebugConfig'
import NavigationRouter from '../Navigation/NavigationRouter'

// Styles
import styles from './Styles/RootContainerStyles'

export default class RootContainer extends Component {
  componentDidMount () {
  }

  render () {
    console.tron.log('root container')
    console.disableYellowBox = !DebugSettings.yellowBox
    return (
      <View style={styles.applicationView}>
        <StatusBar
          showHideTransition={'slide'}
          barStyle='dark-content' />
        <NavigationRouter />
      </View>
    )
  }
}
