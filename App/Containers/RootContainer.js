// @flow

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import DebugSettings from '../Config/DebugConfig'
import NavigationRouter from '../Navigation/NavigationRouter'

// import { TabNavigator } from 'react-navigation'
// import FeedScreen from '../Containers/FeedScreen'
// import ExploreScreen from '../Containers/ExploreScreen'
// import ProfileScreen from '../Containers/ProfileScreen'

// Styles
import styles from './Styles/RootContainerStyles'
// const MyApp = TabNavigator({
//   Feed: {
//     screen: FeedScreen,
//   },
//   Profile3: {
//     screen: ProfileScreen,
//   }
// }, {
//   tabBarOptions: {
//     activeTintColor: '#e91e63',
//   },
// });

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
        {/* <MyApp /> */}
      </View>
    )
  }
}
