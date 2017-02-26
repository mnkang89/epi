// @flow

import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import styles from './Styles/NavItemsStyle'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Metrics, Images } from '../Themes'

const openDrawer = () => {
  NavigationActions.refresh({
    key: 'drawer',
    open: true
  })
}

export default {
  episodeLogo () {
    return (
      <View style={{
        paddingTop: 13
      }}>
        <Image source={Images.episodeLogo} style={styles.episodeLogo} />
      </View>
    )
  },

  backButton () {
    return (
      <TouchableOpacity onPress={NavigationActions.pop}>
        <Image source={Images.backButton} style={{width: 11, height: 19}} />
      </TouchableOpacity>
    )
  },

  hamburgerButton () {
    return (
      <TouchableOpacity onPress={openDrawer}>
        <Icon name='bars'
          size={Metrics.icons.medium}
          color={Colors.snow}
          style={styles.navButtonLeft}
        />
      </TouchableOpacity>
    )
  },

  cameraButton () {
    return (
      <TouchableOpacity onPress={() => {}}>
        <Icon name='camera'
          size={22}
          color={Colors.snow}
          style={styles.navButtonLeft}
        />
      </TouchableOpacity>
    )
  },

  profileButton () {
    return (
      <TouchableOpacity onPress={() => NavigationActions.profileScreen({ type: 'reset' })}>
        <Icon name='user'
          size={22}
          color={Colors.snow}
          style={styles.navButtonLeft}
        />
      </TouchableOpacity>
    )
  },

  settingButton () {
    return (
      <TouchableOpacity onPress={() => {}}>
        <Icon name='cog'
          size={22}
          color={Colors.snow}
          style={styles.navButtonLeft}
        />
      </TouchableOpacity>
    )
  },

  homeButton () {
    return (
      <TouchableOpacity onPress={() => NavigationActions.feedScreen({ type: 'reset' })}>
        <Icon name='home'
          size={22}
          color={Colors.snow}
          style={styles.navButtonLeft}
        />
      </TouchableOpacity>
    )
  },

  chevronButton () {
    return (
      <TouchableOpacity onPress={() => NavigationActions.feedScreen({type: 'reset'})}>
        <Icon
          name='chevron-down'
          size={20}
          color={Colors.snow}
          style={styles.navButtonLeft}
        />
      </TouchableOpacity>
    )
  }

}
