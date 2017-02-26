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
    marginTop: 13,
    width: 85,
    height: 15
  }
})
