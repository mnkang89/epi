// @flow

import {StyleSheet} from 'react-native'
import { Metrics, Colors } from '../../Themes/'

export default StyleSheet.create({
  navButtonLeft: {
    marginLeft: Metrics.baseMargin,
    backgroundColor: Colors.transparent,
    width: Metrics.icons.medium
  },
  episodeLogo: {
    alignSelf: 'center',
    width: 82,
    height: 16
  }
})
