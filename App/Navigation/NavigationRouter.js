// @flow

import React, { Component } from 'react'
import { Scene, Router, Actions as NavigationActions} from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
import NavItems from './NavItems'
import CustomNavBar from '../Components/CustomNavBar'
import TabIcon from '../Components/TabIcon'

// screens identified by the router
import AllComponentsScreen from '../Containers/AllComponentsScreen'
import UsageExamplesScreen from '../Containers/UsageExamplesScreen'
import LoginScreen from '../Containers/LoginScreen'
import ListviewExample from '../Containers/ListviewExample'
import ListviewGridExample from '../Containers/ListviewGridExample'
import ListviewSectionsExample from '../Containers/ListviewSectionsExample'
import MapviewExample from '../Containers/MapviewExample'
import APITestingScreen from '../Containers/APITestingScreen'
import ThemeScreen from '../Containers/ThemeScreen'
import DeviceInfoScreen from '../Containers/DeviceInfoScreen'

//episode
import FeedScreen from '../Containers/FeedScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import CameraScreen from '../Containers/CameraScreen'
import CommentScreen from '../Containers/CommentScreen'
/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene
          key='root'
          navigationBarStyle={Styles.navBar}
          titleStyle={Styles.title}
          leftButtonIconStyle={Styles.leftButton}
          backButtonTextStyle={Styles.backButton}
          rightButtonTextStyle={Styles.rightButton}>
          <Scene
            key="tabBar"
            tabs={true}
            tabBarStyle={{backgroundColor:'#000000', justifyContent:'center', alignItems:'center', alignSelf:'center', height:40}}>
            <Scene
              key="homeTab"
              initial
              icon={TabIcon}
              selectedTabIcon="home"
              tabIcon="home"
              leftButtonIconStyle={Styles.leftButton}
              navigationBarStyle={Styles.navBar}
              titleStyle={{ color:'white', fontSize:17}}>
              <Scene
                initial
                key='feedScreen'
                component={FeedScreen}
                title='episode'/>
              <Scene
                key='commentScreen'
                component={CommentScreen}
                title='댓글'
                renderLeftButton={NavItems.chevronButton} />
            </Scene>
            <Scene
              key="alarmTab"
              icon={TabIcon}
              selectedTabIcon="bell-o"
              tabIcon="bell"
              navigationBarStyle={Styles.navBar}
              titleStyle={{ color:'white', fontSize:17}}>
              <Scene
                key='profileScreen'
                component={ProfileScreen}
                title='episode'/>
            </Scene>
            <Scene
              key="cameraTab"
              icon={TabIcon}
              selectedTabIcon="camera"
              tabIcon="camera"
              navigationBarStyle={Styles.navBar}
              titleStyle={{ color:'white', fontSize:17}}>
              <Scene
                key='cameraScreen'
                component={CameraScreen}
                title='episode'
                hideNavBar={true}
                hideTabBar={true}/>
            </Scene>
            <Scene
              key="searchTab"
              icon={TabIcon}
              selectedTabIcon="search"
              tabIcon="search"
              navigationBarStyle={Styles.navBar}
              titleStyle={{ color:'white', fontSize:17}}>
              <Scene
                key='profileScreen'
                component={ProfileScreen}
                title='episode'/>
            </Scene>
            <Scene
              key="profileTab"
              icon={TabIcon}
              selectedTabIcon="user"
              tabIcon="user"
              navigationBarStyle={Styles.navBar}
              titleStyle={{ color:'white', fontSize:17}}>
              <Scene
                key='profileScreen'
                component={ProfileScreen}
                title='episode'/>
            </Scene>

          </Scene>

        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
