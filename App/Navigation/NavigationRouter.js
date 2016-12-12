// @flow

import React, { Component } from 'react'
import { Scene, Router, ActionConst, Actions } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavItems from './NavItems'
import TabIcon from '../Components/TabIcon'

// episode
import GreetingScreen from '../Containers/GreetingScreen'

import FeedScreen from '../Containers/FeedScreen'
import CommentScreen from '../Containers/CommentScreen'
import UserProfileScreen from '../Containers/UserProfileScreen'
import FollowScreen from '../Containers/FollowScreen'
import FollowerScreen from '../Containers/FollowerScreen'
import AlertScreen from '../Containers/AlertScreen'
import CameraScreen from '../Containers/CameraScreen'
import ExploreScreen from '../Containers/ExploreScreen'
import ProfileScreen from '../Containers/ProfileScreen'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/
/*
*/

class NavigationRouter extends Component {
  render () {
    return (
      <Router
        sceneStyle={{ backgroundColor: 'black' }}>
        <Scene
          initial
          key='Greeting'
          hideNavBar
          hideTabBar
          component={GreetingScreen} />
        <Scene
          key='root'
          navigationBarStyle={Styles.navBar}
          titleStyle={Styles.title}
          leftButtonIconStyle={Styles.leftButton}
          backButtonTextStyle={Styles.backButton}
          rightButtonTextStyle={Styles.rightButton}>
          <Scene
            key='tabBar'
            tabs
            tabBarStyle={{backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: 40}}>
            <Scene
              key='homeTab'
              initial
              icon={TabIcon}
              selectedTabIcon='home'
              tabIcon='home'
              leftButtonIconStyle={Styles.leftButton}
              navigationBarStyle={Styles.navBar}
              titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              <Scene
                initial
                key='feedScreen'
                component={FeedScreen}
                title='episode' />
              <Scene
                key='commentScreen'
                component={CommentScreen}
                title='댓글'
                renderLeftButton={NavItems.chevronButton} />
              <Scene
                key='userProfileScreen'
                component={UserProfileScreen}
                title='프로필' />
              <Scene
                key='followScreen'
                component={FollowScreen}
                title='follow'
                renderLeftButton={NavItems.chevronButton} />
              <Scene
                key='followerScreen'
                component={FollowerScreen}
                title='follower'
                renderLeftButton={NavItems.chevronButton} />
            </Scene>
            <Scene
              key='alarmTab'
              icon={TabIcon}
              selectedTabIcon='bell-o'
              tabIcon='bell'
              navigationBarStyle={Styles.navBar}
              titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              <Scene
                key='alertScreen'
                component={AlertScreen}
                title='내소식' />
            </Scene>
            <Scene
              key='cameraTab'
              icon={TabIcon}
              selectedTabIcon='camera'
              tabIcon='camera'
              navigationBarStyle={Styles.navBar}
              onPress={() => {
                Actions.cameraScreen({isOpen: true, type: ActionConst.REFRESH})
              }}
              titleStyle={{color: 'white', fontSize: 17}}>
              <Scene
                key='cameraScreen'
                component={CameraScreen}
                title='episode'
                hideNavBar
                hideTabBar />
            </Scene>
            <Scene
              key='searchTab'
              icon={TabIcon}
              selectedTabIcon='search'
              tabIcon='search'
              navigationBarStyle={Styles.navBar}
              titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              <Scene
                key='exploreScreen'
                component={ExploreScreen}
                title='우연한 발견' />
            </Scene>
            <Scene
              key='profileTab'
              icon={TabIcon}
              selectedTabIcon='user'
              tabIcon='user'
              navigationBarStyle={Styles.navBar}
              titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              <Scene
                key='profileScreen'
                component={ProfileScreen}
                title='내 프로필' />
            </Scene>
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
