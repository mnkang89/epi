// @flow

// Utility functions
import { Platform } from 'react-native'
import R from 'ramda'

// useful cleaning functions
const nullToEmpty = R.defaultTo('')
const replaceEscapedCRLF = R.replace(/\\n/g)
const nullifyNewlines = R.compose(replaceEscapedCRLF(' '), nullToEmpty)

// Correct Map URIs
export const locationURL = (address: string) => {
  let cleanAddress = nullifyNewlines(address)
  // https://developer.apple.com/library/ios/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
  let url = `http://maps.apple.com/?address=${cleanAddress}`
  // https://developers.google.com/maps/documentation/ios-sdk/urlscheme
  if (Platform.OS === 'android') url = `http://maps.google.com/?q=${cleanAddress}`

  return url
}
export const directionsURL = (address: string) => {
  let cleanAddress = nullifyNewlines(address)
  // https://developer.apple.com/library/ios/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
  let url = `http://maps.apple.com/?daddr=${cleanAddress}&dirflg=d`
  // https://developers.google.com/maps/documentation/ios-sdk/urlscheme
  if (Platform.OS === 'android') url = `http://maps.google.com/?daddr=${cleanAddress}`

  return url
}

export const convert2TimeDiffString = (datetimeStr : string) => {
  if (!datetimeStr || datetimeStr === '') return ''
  let datetime = new Date(datetimeStr)
  let timeDiffInSeconds = new Date() - datetime
  let hourInMillis = 3600000
  let minuteInMillis = 60000
  if (timeDiffInSeconds > 86400000) {
    return datetime.toLocaleDateString()
  } else if (timeDiffInSeconds > hourInMillis) {
    return Math.floor(timeDiffInSeconds / hourInMillis) + '시간전'
  } else if (timeDiffInSeconds > minuteInMillis) {
    return Math.floor(timeDiffInSeconds / minuteInMillis) + '분전'
  } else {
    return timeDiffInSeconds + '초전'
  }
}
