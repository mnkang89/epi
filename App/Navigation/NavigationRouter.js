// @flow
import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { Scene, Router, ActionConst, Actions } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavItems from './NavItems'
import TabIcon from '../Components/common/TabIcon'
import { connect } from 'react-redux'
import { Images } from '../Themes'

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
    const getSceneStyle = () => {
      const style = {
        backgroundColor: 'transparent'
      }
      return style
    }

    return (
      <Router
        getSceneStyle={getSceneStyle} >
        <Scene
          key='root'
          // duration={0}
          navigationBarStyle={Styles.navBar}
          titleStyle={Styles.title} >
          <Scene
            initial={isLoggedIn()}
            key='Greeting'
            hideNavBar
            hideTabBar
            component={GreetingScreen} />
          <Scene
            // duration={0}
            initial={isLoggedIn()}
            key='tabBar'
            type='reset'
            tabs
            tabBarStyle={{backgroundColor: '#FFFFFF', alignItems: 'center', height: 60, borderTopColor: '#f3f3f3', borderTopWidth: 1}} >
            <Scene
              key='homeTab'
              icon={TabIcon}
              selectedTabIcon='home'
              tabIcon='home'
              onPress={() => {
                this.props.tabTouched()
                this.props.registerScreen('homeTab')
                Actions.homeTab()
              }}
              navigationBarStyle={Styles.navBar}
              // leftButtonIconStyle={Styles.leftButton}
              renderTitle={NavItems.episodeLogo}
              titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}} >
              <Scene
                key='feedScreen'
                panHandlers={null}
                component={FeedScreen} />
              <Scene
                renderTitle={NavItems.profileLogo}
                backButtonImage={Images.backButton}
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
                this.props.tabTouched()
                this.props.registerScreen('alarmTab')
                Actions.alarmTab()
              }}
              navigationBarStyle={Styles.navBar}
              renderTitle={NavItems.episodeLogo}
              >
              <Scene
                key='notiScreen'
                panHandlers={null}
                component={NotiScreen}
                title='내소식' />
              <Scene
                backButtonImage={Images.backButton}
                key='singleEpisodeScreen'
                component={SingleEpisodeScreen}
                title='에피소드' />
              <Scene
                renderTitle={NavItems.profileLogo}
                backButtonImage={Images.backButton}
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
                // Actions.modalScreen({hide: false })
                Actions.cameraScreen({isOpen: true, type: ActionConst.PUSH})
                StatusBar.setHidden(true)
              }}
              titleStyle={{color: 'white', fontSize: 17}} />
            <Scene
              key='searchTab'
              icon={TabIcon}
              selectedTabIcon='search'
              tabIcon='search'
              onPress={() => {
                this.props.tabTouched()
                this.props.registerScreen('searchTab')
                Actions.searchTab()
              }}
              // titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}
              // leftButtonIconStyle={Styles.leftButton}
              navigationBarStyle={Styles.navBar}
              renderTitle={NavItems.episodeLogo} >
              <Scene
                key='exploreScreen'
                panHandlers={null}
                component={ExploreScreen}
                title='우연한 발견' />
              <Scene
                renderTitle={NavItems.profileLogo}
                backButtonImage={Images.backButton}
                key='searchTouserProfileScreen'
                component={UserProfileScreen}
                title='프로필' />
              <Scene
                backButtonImage={Images.backButton}
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
                this.props.tabTouched()
                this.props.registerScreen('profileTab')
                Actions.profileTab()
              }}
              renderTitle={NavItems.profileLogo}
              navigationBarStyle={Styles.navBar}
              leftButtonIconStyle={Styles.leftButton}
              titleStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              <Scene
                key='profileScreen'
                panHandlers={null}
                component={ProfileScreen}
                title='내 프로필' />
            </Scene>
          </Scene>
          <Scene
            key='cameraScreen'
            panHandlers={null}
            component={CameraScreen}
            renderTitle={NavItems.episodeLogo}
            direction='vertical'
            hideNavBar
            hideTabBar />
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
    registerScreen: (beforeScreen) => dispatch(ScreenActions.screenRegister(beforeScreen)),
    tabTouched: () => dispatch(ScreenActions.tabTouched())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationRouter)
