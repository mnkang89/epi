// @flow
import React, { Component } from 'react'
import { StatusBar } from 'react-native'
// import { Scene, Router, ActionConst, Actions, Switch } from 'react-native-router-flux'
import { Scene, Router, ActionConst, Actions } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavItems from './NavItems'
import TabIcon from '../Components/common/TabIcon'
import { connect } from 'react-redux'

// episode
import GreetingScreen from '../Containers/Auth/GreetingScreen'

import FeedScreen from '../Containers/FeedScreen'
import NotiScreen from '../Containers/NotiScreen'
import CameraScreen from '../Containers/CameraScreen'
import ExploreScreen from '../Containers/ExploreScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import UserProfileScreen from '../Containers/UserProfileScreen'
import SingleEpisodeScreen from '../Containers/SingleEpisodeScreen'

import ScreenActions from '../Redux/ScreenRedux'
import { isLoggedIn } from '../Services/Auth'

class NavigationRouter extends Component {
  render () {
    return (
      <Router
        sceneStyle={{ backgroundColor: 'transparent' }}>
        <Scene
          key='root'
          navigationBarStyle={Styles.navBar}
          titleStyle={Styles.title} >
          <Scene
            initial={!isLoggedIn()}
            key='Greeting'
            hideNavBar
            hideTabBar
            component={GreetingScreen} />
          <Scene
            initial={isLoggedIn()}
            key='tabBar'
            tabs
            tabBarStyle={{backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: 60, borderTopColor: '#f3f3f3', borderTopWidth: 1}} >
            <Scene
              key='homeTab'
              icon={TabIcon}
              selectedTabIcon='home'
              tabIcon='home'
              onPress={() => {
                this.props.registerScreen('homeTab')
                Actions.homeTab()
              }}
              navigationBarStyle={Styles.navBar}
              leftButtonIconStyle={Styles.leftButton}
              titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}} >
              <Scene
                key='feedScreen'
                panHandlers={null}
                component={FeedScreen}
                renderTitle={NavItems.episodeLogo} />
              <Scene
                hideNavBar
                renderBackButton={NavItems.backButton}
                key='feedTouserProfileScreen'
                component={UserProfileScreen}
                title='프로필' />
            </Scene>
            <Scene
              key='alarmTab'
              icon={TabIcon}
              selectedTabIcon='bell-o'
              tabIcon='bell'
              onPress={() => {
                this.props.registerScreen('alarmTab')
                Actions.alarmTab()
              }}
              navigationBarStyle={Styles.navBar}
              leftButtonIconStyle={Styles.leftButton}
              renderTitle={NavItems.episodeLogo}
              // titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}
              >
              <Scene
                key='notiScreen'
                panHandlers={null}
                component={NotiScreen}
                title='내소식' />
              <Scene
                renderBackButton={NavItems.backButton}
                key='singleEpisodeScreen'
                component={SingleEpisodeScreen}
                title='에피소드' />
              <Scene
                hideNavBar
                renderBackButton={NavItems.backButton}
                key='notiTouserProfileScreen'
                component={UserProfileScreen}
                title='프로필' />
            </Scene>
            <Scene
              key='cameraTab'
              icon={TabIcon}
              selectedTabIcon='camera'
              tabIcon='camera'
              navigationBarStyle={Styles.navBar}
              onPress={() => {
                Actions.cameraScreen({isOpen: true, type: ActionConst.REFRESH})
                StatusBar.setHidden(true)
              }}
              titleStyle={{color: 'white', fontSize: 17}}>
              <Scene
                key='cameraScreen'
                panHandlers={null}
                component={CameraScreen}
                renderTitle={NavItems.episodeLogo}
                hideNavBar
                hideTabBar />
            </Scene>
            <Scene
              key='searchTab'
              icon={TabIcon}
              selectedTabIcon='search'
              tabIcon='search'
              onPress={() => {
                this.props.registerScreen('searchTab')
                Actions.searchTab()
              }}
              leftButtonIconStyle={Styles.leftButton}
              navigationBarStyle={Styles.navBar}
              renderTitle={NavItems.episodeLogo}
              // titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}
              >
              <Scene
                // renderBackButton={NavItems.backButton}
                key='exploreScreen'
                panHandlers={null}
                component={ExploreScreen}
                title='우연한 발견' />
              <Scene
                hideNavBar
                renderBackButton={NavItems.backButton}
                key='searchTouserProfileScreen'
                component={UserProfileScreen}
                title='프로필' />
              <Scene
                renderBackButton={NavItems.backButton}
                key='searchTosingleEpisodeScreen'
                component={SingleEpisodeScreen}
                title='에피소드' />
            </Scene>
            <Scene
              key='profileTab'
              icon={TabIcon}
              selectedTabIcon='user'
              tabIcon='user'
              onPress={() => {
                this.props.registerScreen('profileTab')
                Actions.profileTab()
              }}
              navigationBarStyle={Styles.navBar}
              leftButtonIconStyle={Styles.leftButton}
              titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              <Scene
                key='profileScreen'
                hideNavBar
                panHandlers={null}
                component={ProfileScreen}
                title='내 프로필' />
              <Scene
                hideNavBar
                key='profileTouserProfileScreen'
                component={UserProfileScreen}
                title='프로필' />
            </Scene>
          </Scene>
        </Scene>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    beforeScreen: state.screen.beforeScreen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    registerScreen: (beforeScreen) => dispatch(ScreenActions.screenRegister(beforeScreen))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationRouter)
