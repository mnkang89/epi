// @flow

// Utility functions
import { Platform } from 'react-native'
import R from 'ramda'
import _ from 'lodash'

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
  // let secondInMillis = 1000
  if (timeDiffInSeconds > 86400000) {
    return datetime.toLocaleDateString()
  } else if (timeDiffInSeconds > hourInMillis) {
    return Math.floor(timeDiffInSeconds / hourInMillis) + '시간 전'
  } else if (timeDiffInSeconds > minuteInMillis) {
    return Math.floor(timeDiffInSeconds / minuteInMillis) + '분 전'
  } else {
    return '방금'
  }
}

export const getObjectDiff = (obj1, obj2) => {
  const diff = Object.keys(obj1).reduce((result, key) => {
    if (!obj2.hasOwnProperty(key)) {
      result.push(key)
    } else if (_.isEqual(obj1[key], obj2[key])) {
      const resultKeyIndex = result.indexOf(key)
      result.splice(resultKeyIndex, 1)
    }
    return result
  }, Object.keys(obj2))

  return diff
}

export const getArrayDiff = (arr1, arr2) => {
  const result = _.differenceWith(arr1, arr2, _.isEqual)

  return result
}

export const removeFromArray = (...forDeletion) => {
  return this.filter(item => !forDeletion.includes(item))
}
