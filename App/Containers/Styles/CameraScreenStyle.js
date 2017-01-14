// @flow

import {
  Dimensions,
  StyleSheet
} from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  preview: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 1
  },
  captureButton: {
    backgroundColor: '#d3d3d3',
    borderRadius: 50,
    width: 70,
    height: 70
  },
  categoryTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20
  },
  categoryText: {
    color: '#d3d3d3'
  }
})
