import React, { Component } from 'react'
import Video from 'react-native-video'
import { getRealm } from '../Services/RealmFactory'
import RNFS from 'react-native-fs'

export const expirePeriodInDay = 7

const realm = getRealm()

const hashing = (string) => {
  let hash = 0
  let i = 0
  let len = 0
  let chr = null
  if (string.length === 0) return hash
  for (i = 0, len = string.length; i < len; i++) {
    chr = string.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

// this component only support URL Pattern Image
export default class CachableVideo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      videoLoaded: null,
      cacheVideoAvailable: false,
      defaultVideo: '',
      videoPath: null
    }
  }

  componentDidMount () {
    console.tron.log('here')

    let cachedVideo = this.findcachedVideo(this.props.source.uri)
    if (cachedVideo != null) {
      console.tron.log('here3')
      console.tron.log('cached video called : ' + cachedVideo.path)
      RNFS.exists(cachedVideo.path)
      .then((result) => {
        if (result) {
          this.useCacheVideo(cachedVideo)
        } else {
          console.tron.log('file not exist at path : ' + cachedVideo.path)
          console.tron.log('download video called : ' + this.props.source.uri)
          this.downloadAndCacheVideo(this.props.source.uri)
        }
      })
    } else {
      console.tron.log('download video called : ' + this.props.source.uri)
      this.downloadAndCacheVideo(this.props.source.uri)
    }
  }

  useCacheVideo (cachedVideo) {
    this.setState({
      videoLoaded: true,
      videoPath: cachedVideo.path
    })
  }

  findcachedVideo (url) {
    let images = realm.objects('cacheVideo')
      .filtered('id = ' + this.wrapDoubleQueto(hashing(url)))
      .filtered('url = ' + this.wrapDoubleQueto(url))
      .filtered('expireDateTime > $0', new Date())
    if (images.length === 0) {
      return null
    } else {
      return images[0]
    }
  }

  wrapDoubleQueto (string) {
    return '"' + string + '"'
  }

  downloadAndCacheVideo (url) {
    let extension = url.substring(url.lastIndexOf('.') + 1)
    let date = new Date()
    let dateKey = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getUTCDate()
    const path = RNFS.DocumentDirectoryPath + '/' + dateKey + hashing(url) + '.' + extension
    const downloadResult = RNFS.downloadFile({fromUrl: url, toFile: path})
    downloadResult.promise.then((result) => {
      switch (result.statusCode) {
        case 200:
          this.setState({
            videoLoaded: true,
            videoPath: path
          })
          this.cacheVideo(url, path, expirePeriodInDay)
          break
        default:
          this.setState({
            videoLoaded: false,
            videoPath: path
          })
          break
      }
    })
  }

  cacheVideo (url, path, expirePeriodInDay) {
    let expireDateTime = new Date()
    expireDateTime.setDate(expireDateTime.getDate() + expirePeriodInDay)
    let videos = realm.objects('cacheVideo')
      .filtered('id = ' + this.wrapDoubleQueto(hashing(url)))
      .filtered('url = ' + this.wrapDoubleQueto(url))
    realm.write(() => realm.delete(videos))
    realm.write(() => realm.create('cacheVideo', {id: '' + hashing(url), url: url, path: path, expireDateTime: expireDateTime}))
  }

  render () {
    if (this.state.videoLoaded == null) {
      return this.renderdefaultVideo()
    } else if (this.state.videoLoaded === true) {
      return this.renderVideo()
    } else {
      return this.renderFailVideo()
    }
  }

  renderdefaultVideo () {
    return null
  }

  renderVideo () {
    return (
      <Video
        source={{uri: this.state.videoPath}}   // Can be a URL or a local file.
        muted={this.props.muted}
        ref={this.props.videoRef}                             // Store reference
        paused={this.props.paused}                 // Pauses playback entirely.
        resizeMode={this.props.resizeMode}             // Fill the whole screen at aspect ratio.
        repeat={this.props.repeat}                         // Repeat forever.
        playInBackground={this.props.playInBackground}       // Audio continues to play when app entering background.
        playWhenInactive={this.props.playWhenInactive}              // [iOS] Video continues to play when control or notification center are shown.
        progressUpdateInterval={this.props.progressUpdateInterval} // [iOS] Interval to fire onProgress (default to ~250ms)
        style={this.props.style} >
        {this.props.children}
      </Video>
    )
  }

  renderFailVideo () {
    return false
  }

}
