// @flow

import React, { Component } from 'react'
import { View, Image, StatusBar } from 'react-native'
import DebugSettings from '../Config/DebugConfig'
import NavigationRouter from '../Navigation/NavigationRouter'
import { connect } from 'react-redux'

import AccountActions from '../Redux/AccountRedux'
import ScreenActions from '../Redux/ScreenRedux'

import { TabNavigator, StackNavigator, TabBarBottom, NavigationActions, addNavigationHelpers } from 'react-navigation'

import FeedScreen from '../Containers/FeedScreen'
import NotiScreen from '../Containers/NotiScreen'
import CameraScreen from '../Containers/CameraScreen'
import ExploreScreen from '../Containers/ExploreScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import UserProfileScreen from '../Containers/UserProfileScreen'
import SingleEpisodeScreen from '../Containers/SingleEpisodeScreen'
import GreetingScreen from '../Containers/Auth/GreetingScreen'

// Styles
import styles from './Styles/RootContainerStyles'
import { Images } from '../Themes'
import { isLoggedIn } from '../Services/Auth'
import * as NavigationService from '../Services/NavigationService'

const FeedStack = StackNavigator({
  Feed: {
    screen: FeedScreen,
    params: {
      title: 'hi',
      scroll: ''
    }
  },
  UserProfile: {
    screen: UserProfileScreen
  }},
  {
    navigationOptions: {
      title: '',
      headerMode: 'screen',
      headerLeft: (
        <Image
          source={Images.profileLogo}
          style={{
            width: 82,
            height: 16}} />
      ),

      tabBarIcon: ({focused}) => {
        if (focused) {
          return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{width: 22, height: 23}} source={Images.tabHome} />
              <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
                <View style={{width: 37, height: 3, backgroundColor: '#F85032'}} />
              </View>
            </View>
          )
        } else {
          return (
            <Image style={{width: 22, height: 23}} source={Images.tabHome} />
          )
        }
      }
    }
  }
)

const NotiStack = StackNavigator({
  Noti: { screen: NotiScreen },
  UserProfile: { screen: UserProfileScreen },
  SingleEpisode: { screen: SingleEpisodeScreen }},
  {
    navigationOptions: {
      function: '',
      tabBarIcon: ({focused}) => {
        if (focused) {
          return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{width: 22, height: 23}} source={Images.tabAlarm} />
              <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
                <View style={{width: 37, height: 3, backgroundColor: '#F85032'}} />
              </View>
            </View>
          )
        } else {
          return (
            <Image style={{width: 22, height: 23}} source={Images.tabAlarm} />
          )
        }
      }
    }
  }
)

const ExploreStack = StackNavigator({
  Explore: {
    screen: ExploreScreen
  },
  UserProfile: {
    screen: UserProfileScreen
  },
  SingleEpisode: {
    screen: SingleEpisodeScreen
  }},
  {
    navigationOptions: {
      function: '',
      tabBarIcon: ({focused}) => {
        if (focused) {
          return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{width: 22, height: 23}} source={Images.tabFind} />
              <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
                <View style={{width: 37, height: 3, backgroundColor: '#F85032'}} />
              </View>
            </View>
          )
        } else {
          return (
            <Image style={{width: 22, height: 23}} source={Images.tabFind} />
          )
        }
      }
    }
  }
)

const ProfileStack = StackNavigator({
  Profile: {
    screen: ProfileScreen
  },
  UserProfile: {
    screen: UserProfileScreen
  }},
  {
    navigationOptions: {
      function: '',
      tabBarIcon: ({focused}) => {
        if (focused) {
          return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{width: 22, height: 23}} source={Images.tabUser} />
              <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
                <View style={{width: 37, height: 3, backgroundColor: '#F85032'}} />
              </View>
            </View>
          )
        } else {
          return (
            <Image style={{width: 22, height: 23}} source={Images.tabUser} />
          )
        }
      }
    }
  }
)

const Tab = TabNavigator({
  Feed: {
    screen: FeedStack
  },
  Noti: {
    screen: NotiStack
  },
  CameraButton: {
    screen: CameraScreen
  },
  Explore: {
    screen: ExploreStack
  },
  Profile: {
    screen: ProfileStack
  }},
  {
    tabBarComponent: ({jumpToIndex, ...props, navigation}) => {
      return (
        <TabBarBottom
          {...props}
          jumpToIndex={index => {
            // console.log('hihi')
            const { dispatch, state } = props.navigation
            console.log(props.navigation)

            if (index === 2) {
              navigation.navigate('Camera')
              return
            }
            if (state.index === index) {
              if (state.routes[index].index === 0) {
                // dispatch(NavigationActions.setParams({
                //   params: { scroll: state.routes[index].key },
                //   key: 'Init'
                // }))
              } else {
                const stackRouteName = ['Feed', 'Noti', '', 'Explore', 'Profile'][index]

                dispatch(NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: stackRouteName })]
                }))
              }
            } else {
              jumpToIndex(index)
            }
          }} />
      )
    },
    tabBarOptions: {
      activeTintColor: '#e91e63',
      style: {
        backgroundColor: 'white',
        height: 60
      },
      showLabel: false
    },
    lazy: true
  })

const AppNavigator = StackNavigator(
  {
    Login: {
      screen: GreetingScreen
    },
    Home: {
      screen: Tab
    },
    Camera: {
      screen: CameraScreen
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {backgroundColor: 'transparent'},
    initialRouteName: isLoggedIn() ? 'Home' : 'Login'
  }
)

class RootContainer extends Component {
  componentDidMount () {
    NavigationService.setNavigator(this.navigator)
  }

  render () {
    console.disableYellowBox = !DebugSettings.yellowBox
    return (
      <View style={styles.applicationView}>
        <StatusBar
          showHideTransition={'slide'}
          barStyle='dark-content' />
        {/* <NavigationRouter /> */}
        <AppNavigator
          ref={nav => { this.navigator = nav }}
          onNavigationStateChange={(prevState, currentState) => {
            return
          }}
        />
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
    initOtherInfo: () => dispatch(AccountActions.initOtherInfo()),
    feedTabTouched: () => dispatch(ScreenActions.feedTabTouched())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
