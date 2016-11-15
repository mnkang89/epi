// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  preview: {
    flex: 4,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
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
