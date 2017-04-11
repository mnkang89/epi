import {
  NativeModules
} from 'react-native'

export default {
  createResizedVideo: (path, outputPath) => {
    return new Promise((resolve, reject) => {
      NativeModules.VideoResizer.createResizedVideoWithSDAV(path, outputPath, (err, resizedPath) => {
        if (err) {
          return reject(err)
        }
        resolve(resizedPath)
      })
    })
  }
}
