import {
  NativeModules
} from 'react-native'

export default {
  createThumbnail: (path, outputPath) => {
    return new Promise((resolve, reject) => {
      NativeModules.RNVideoThumbnailManager.getThumbnail(path, (err, thumbnail) => {
        if (err) {
          return reject(err)
        }
        resolve(thumbnail)
      })
    })
  }
}
