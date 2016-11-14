// @flow

import {
  StyleSheet,
  Dimensions
 } from 'react-native'
import { Metrics, ApplicationStyles } from '../../Themes/'

const windowSize = Dimensions.get('window');

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  image: {
      height:100,
      width: 100,
      borderRadius: 50
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 50,
    width: 20,
    height: 20,
    left: 80,
    top: 0,
  },
  logo: {
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  centered: {
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  sendContainer: {
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  sendLabel: {
    color: '#ffffff',
    fontSize: 15
  },
  input: {
    width: windowSize.width - 70,
    color: '#555555',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    borderColor: '#6E5BAA',
    borderWidth: 1,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  }

})
