// import PushNotification from 'react-native-push-notification'
//
// // https://github.com/zo0r/react-native-push-notification
// PushNotification.configure({
//
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: (token) => {
//     if (__DEV__) console.log('TOKEN:', token)
//   },
//
//   // (required) Called when a remote or local notification is opened or received
//   onNotification: (notification) => {
//     if (__DEV__) console.log('NOTIFICATION:', notification)
//   },
//
//   // ANDROID ONLY: (optional) GCM Sender ID.
//   senderID: 'YOUR GCM SENDER ID',
//
//   // IOS ONLY (optional): default: all - Permissions to register.
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true
//   },
//
//   // Should the initial notification be popped automatically
//   // default: true
//   // Leave this off unless you have good reason.
//   popInitialNotification: false,
//
//   /**
//     * IOS ONLY: (optional) default: true
//     * - Specified if permissions will requested or not,
//     * - if not, you must call PushNotificationsHandler.requestPermissions() later
//     * This example app shows how to best call requestPermissions() later.
//     */
//   requestPermissions: false
// })

// episode
//
//
import PushNotification from 'react-native-push-notification'
import Api from '../Services/Api'
import { getRealm } from '../Services/RealmFactory'
// https://github.com/zo0r/react-native-push-notification

const RegisterNotification = () => {
  PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: (token) => {
      const api = Api.create()
      if (isAlreadyRegistredToken(token)) {
        console.log('token registered')
      } else {
        api.registerPushToken(token.os, token.token)
            .then((res) => {
              console.log('push token api call success')
              if (res.ok) {
                const realm = getRealm()
                realm.write(() => {
                  const tokens = realm.objects('pushToken')
                  realm.delete(tokens)
                  realm.create('pushToken', {token: token.token})
                })
                console.log('push token store to realm')
              }
            })
      }
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: (notification) => {
      console.log('NOTIFICATION:', notification)
    },

    // ANDROID ONLY: (optional) GCM Sender ID.
    senderID: 'YOUR GCM SENDER ID',

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    // Leave this off unless you have good reason.
    popInitialNotification: true,

    /**
      * IOS ONLY: (optional) default: true
      * - Specified if permissions will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      * This example app shows how to best call requestPermissions() later.
      */
    requestPermissions: true
  })
}

const isAlreadyRegistredToken = (token) => {
  const realm = getRealm()
  const tokens = realm.objects('pushToken').filtered('token == $0', '' + token)
  if (tokens.length > 0) return true
  else return false
}
export default RegisterNotification
