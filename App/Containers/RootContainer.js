// @flow

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import DebugSettings from '../Config/DebugConfig'
import NavigationRouter from '../Navigation/NavigationRouter'
import { connect } from 'react-redux'

import AccountActions from '../Redux/AccountRedux'

import { TabNavigator, StackNavigator } from 'react-navigation'
import FeedScreen from '../Containers/FeedScreen'
import NotiScreen from '../Containers/NotiScreen'
import ExploreScreen from '../Containers/ExploreScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import UserProfileScreen from '../Containers/UserProfileScreen'

// Styles
import styles from './Styles/RootContainerStyles'

const FeedStack = StackNavigator({
    Feed: {
      screen: FeedScreen
    },
    UserProfile: {
      screen: UserProfileScreen
    }
  },
)

const NotiStack = StackNavigator({
    Noti: {
      screen: NotiScreen
    },
    UserProfile: {
      screen: UserProfileScreen
    }
  },
)

const ExploreStack = StackNavigator({
    Explore: {
      screen: ExploreScreen
    },
    UserProfile: {
      screen: UserProfileScreen
    }
  },
)

const ProfileStack = StackNavigator({
    Profile: {
      screen: ProfileScreen
    },
    UserProfile: {
      screen: UserProfileScreen
    }
  },
)

const MyApp = TabNavigator({
  Feed: {
    screen: FeedStack
  },
  Noti: {
    screen: NotiStack
  },
  Explore: {
    screen: ExploreStack
  },
  Profile: {
    screen: ProfileStack
  }},
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
      lazy: true
    }
  })

class RootContainer extends Component {
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

const mapStateToProps = (state) => {
  return {
    profileModified: state.signup.modified,

    newEpisodeRequesting: state.episode.newEpisodeRequesting,
    items: state.episode.episodes,

    // trigger: state.screen.trigger,
    beforeScreen: state.screen.beforeScreen,
    pastScreen: state.screen.pastScreen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initOtherInfo: () => dispatch(AccountActions.initOtherInfo())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
