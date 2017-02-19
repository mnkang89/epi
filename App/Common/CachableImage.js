import React, { Component } from 'react'
import { Image } from 'react-native'
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
export default class CachableImage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      imageLoaded: null,
      cacheImageVailable: false,
      defaultImage: '',
      imagePath: null
    }
  }

  componentDidMount () {
    let cachedImage = this.findCachedImage(this.props.source.uri)
    if (cachedImage != null) {
      console.tron.log('cached image called : ' + cachedImage.path)
      RNFS.exists(cachedImage.path)
      .then((result) => {
        if (result) {
          this.useCacheImage(cachedImage)
        } else {
          console.tron.log('file not exist at path : ' + cachedImage.path)
          console.tron.log('download image called : ' + this.props.source.uri)
          this.downloadAndCacheImage(this.props.source.uri)
        }
      })
    } else {
      this.downloadAndCacheImage(this.props.source.uri)
    }
  }

  useCacheImage (cachedImage) {
    this.setState({
      imageLoaded: true,
      imagePath: cachedImage.path
    })
  }

  findCachedImage (url) {
    let images = realm.objects('cacheImage')
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

  downloadAndCacheImage (url) {
    let extension = url.substring(url.lastIndexOf('.') + 1)
    let date = new Date()
    let dateKey = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getUTCDate()
    const path = RNFS.DocumentDirectoryPath + '/' + dateKey + hashing(url) + '.' + extension
    const downloadResult = RNFS.downloadFile({fromUrl: url, toFile: path})
    downloadResult.promise.then((result) => {
      switch (result.statusCode) {
        case 200:
          this.setState({
            imageLoaded: true,
            imagePath: path
          })
          this.cacheImage(url, path, expirePeriodInDay)
          break
        default:
          this.setState({
            imageLoaded: false,
            imagePath: path
          })
          break
      }
    })
  }

  cacheImage (url, path, expirePeriodInDay) {
    let expireDateTime = new Date()
    expireDateTime.setDate(expireDateTime.getDate() + expirePeriodInDay)
    let images = realm.objects('cacheImage')
      .filtered('id = ' + this.wrapDoubleQueto(hashing(url)))
      .filtered('url = ' + this.wrapDoubleQueto(url))
    realm.write(() => realm.delete(images))
    realm.write(() => realm.create('cacheImage', {id: '' + hashing(url), url: url, path: path, expireDateTime: expireDateTime}))
  }

  render () {
    if (this.state.imageLoaded == null) {
      return this.renderDefaultImage()
    } else if (this.state.imageLoaded === true) {
      return this.renderImage()
    } else {
      return this.renderFailImage()
    }
  }

  renderDefaultImage () {
    return (
      <Image ref={this.props.ref}
        style={this.props.style}>
        {this.props.children}
      </Image>
    )
  }

  renderImage () {
    return (
      <Image ref={this.props.ref}
        style={this.props.style}
        source={{uri: this.state.imagePath}}>
        {this.props.children}
      </Image>
    )
  }

  renderFailImage () {
    return (
      <Image ref={this.props.ref}
        style={this.props.style}
        source={{uri: this.state.imagePath}}>
        {this.props.children}
      </Image>
    )
  }

}
