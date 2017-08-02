// TODO: *프로필 컴포넌트 따로 만들기

import React, { Component, PropTypes } from 'react'
import { View, Image, ImagePickerIOS, TouchableOpacity, Text } from 'react-native'
import Permissions from 'react-native-permissions'

import ConfirmError from './ConfirmError'
import { Images } from '../../Themes'
import styles from '../../Containers/Styles/FeedScreenStyle'

import CachableImage from '../../Common/CachableImage'
import { getAccountId } from '../../Services/Auth'
import ImageResizer from 'react-native-image-resizer'
import { getRealm } from '../../Services/RealmFactory'

const realm = getRealm()

class ProfileInfo extends Component {

  static propTypes = {
    type: PropTypes.string,         // Type of profileScreen

    token: PropTypes.string,        // Token
    accountId: PropTypes.number,    // My Id
    id: PropTypes.number,           // Other Id

    profileImagePath: PropTypes.string,
    nickname: PropTypes.string,
    following: PropTypes.bool,
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,

    requestProfileImage: PropTypes.func,
    deleteFollow: PropTypes.func,
    postFollow: PropTypes.func,

    openFollow: PropTypes.func,
    getFollowing: PropTypes.func,
    getFollower: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm',

      photoSource: this.props.profileImagePath,
      follow: this.props.following,
      followingCount: this.props.followingCount,
      followerCount: this.props.followerCount,
      photoViewerVisible: false
    }
  }

  componentDidMount () {
    const id = this.props.type === 'me' ? getAccountId() : this.props.id
    let user = realm.objects('user').filtered('id = ' + id)
    // id: { type: 'int', indexed: true },
    // followerCount: {type: 'int', default: 0},
    // followingCount: {type: 'int', default: 0},
    // followStatus: {type: 'bool'}
    if (this.props.type === 'me') {
      if (user.length === 0) {
        realm.write(() => {
          realm.delete(user)
          realm.create('user',
            {
              id: id,
              followStatus: false,
              followingCount: this.props.followingCount,
              followerCount: this.props.followerCount
            }
          )
        })
      } else {
        realm.write(() => {
          let user = Array.from(realm.objects('user').filtered('id = ' + id))[0]

          user.followStatus = false
          user.followingCount = this.props.followingCount
          user.followerCount = this.props.followerCount
        })
      }
    } else {
      if (user.length === 0) {
        realm.write(() => {
          realm.delete(user)
          realm.create('user',
            {
              id: id,
              followStatus: this.props.following,
              followingCount: this.props.followingCount,
              followerCount: this.props.followerCount
            }
          )
        })
      } else {
        realm.write(() => {
          let user = Array.from(realm.objects('user').filtered('id = ' + id))[0]

          user.followStatus = this.props.following
          user.followingCount = this.props.followingCount
          user.followerCount = this.props.followerCount
        })
      }
    }

    realm.objects('user').filtered('id = ' + id).addListener((users, changes) => {
      let user = Array.from(realm.objects('user').filtered('id = ' + id))[0]
      setTimeout(() => {
        this.setState({
          follow: user.followStatus,
          followingCount: user.followingCount,
          followerCount: user.followerCount
        })
      }, 500)
    })
  }

    // id: { type: 'int', indexed: true },
    // followerCount: {type: 'int', default: 0},
    // followingCount: {type: 'int', default: 0},
    // followStatus: {type: 'bool'}

  componentWillReceiveProps (nextProps) {
    this.setState({ photoSource: nextProps.profileImagePath })
  }

  onProfileImagePress () {
    const { token } = this.props
    const accountId = getAccountId()
    // this.props.requestProfileImage('https://facebook.github.io/react/img/logo_og.png', token, accountId)

    Permissions.getPermissionStatus('photo')
      .then(response => {
        // response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        if (response === 'undetermined') {
          Permissions.requestPermission('photo').then(response => {
            if (response === 'authorized') {
              ImagePickerIOS.openSelectDialog(
                { },
                (data) => {
                  console.log('사진선택')
                  ImageResizer.createResizedImage(data, 150, 150, 'JPEG', 100)
                    .then((resizedImageUri) => {
                      console.log('리사이징 성공')
                      this.setState({
                        photoSource: resizedImageUri
                      })
                      this.props.requestProfileImage(resizedImageUri, token, accountId)
                      // setTimeout(() => {
                      //   this.props.requestInfo(null, accountId)
                      // }, 500)
                    }).catch((err) => {
                      console.log('리사이징 실패')
                      console.log(err)
                    })
                },
                () => {
                  console.log('에러')
                }
              )
            }
          })
        } else if (response === 'denied') {
          this.setState({
            alertVisible: true,
            alertTextArray: ['설정에서 ‘사진’ 접근권한을', '허용해주세요.'],
            confirmStyle: 'setting'
          })
        } else if (response === 'authorized') {
          ImagePickerIOS.openSelectDialog(
            { },
            (data) => {
              console.log('사진선택')
              ImageResizer.createResizedImage(data, 150, 150, 'JPEG', 100)
                .then((resizedImageUri) => {
                  console.log('리사이징 성공')
                  this.setState({
                    photoSource: resizedImageUri
                  })
                  this.props.requestProfileImage(resizedImageUri, token, accountId)
                }).catch((err) => {
                  console.log('리사이징 실패')
                  console.log(err)
                })
            },
            () => {
              console.log('에러')
            }
          )
        }
      })
  }

  onSetting () {
    console.log('온세팅')
    this.setState({
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm'
    })
    Permissions.openSettings()
  }

  onDecline () {
    this.setState({
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm'
    })
  }

  onFollowPress () {
    const { token } = this.props
    const id = this.props.id

    if (this.state.follow) {
      this.props.deleteFollow(token, id)
      // this.setState({ follow: false })
      realm.write(() => {
        let user = Array.from(realm.objects('user').filtered('id = ' + id))[0]
        let me = Array.from(realm.objects('user').filtered('id = ' + getAccountId()))[0]

        user.followStatus = false
        user.followerCount = user.followerCount - 1
        me.followingCount = me.followingCount - 1
      })
    } else {
      this.props.postFollow(token, id)
      // this.setState({ follow: true })
      realm.write(() => {
        let user = Array.from(realm.objects('user').filtered('id = ' + id))[0]
        let me = Array.from(realm.objects('user').filtered('id = ' + getAccountId()))[0]

        user.followStatus = true
        user.followerCount = user.followerCount + 1
        me.followingCount = me.followingCount + 1
      })
    }
  }

  onFollowingPress () {
    if (this.props.type === 'me') {
      const { token } = this.props

      this.props.openFollow(true, '팔로잉')
      this.props.getFollowing(token, getAccountId())
    } else {
      const { token, id } = this.props

      this.props.openFollow(true, '팔로잉')
      this.props.getFollowing(token, id)
    }
  }

  onFollowerPress () {
    if (this.props.type === 'me') {
      const { token } = this.props

      this.props.openFollow(true, '팔로워')
      this.props.getFollower(token, getAccountId())
    } else {
      const { token, id } = this.props

      this.props.openFollow(true, '팔로워')
      this.props.getFollower(token, id)
    }
  }

  onOtherProfileImagePress () {
    this.setState({
      photoViewerVisible: true
    })
  }

  _onPressViewerExit () {
    this.setState({
      photoViewerVisible: false
    })
  }

  renderProfileImage () {
    if (this.props.type === 'me') {
      if (this.state.photoSource) {
        const randomTime = new Date().getTime()
        const uri = `${this.state.photoSource}?random_number=${randomTime}`

        return (
          <CachableImage
            style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 9, marginTop: 19}]}
            source={{uri: uri}} />
        )
      } else {
        return (
          <Image
            style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 9, marginTop: 19}]}
            source={Images.profileImage} />
        )
      }
    } else {
      if (this.props.profileImagePath) {
        return (
          <CachableImage
            style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 9, marginTop: 19}]}
            source={{uri: this.props.profileImagePath}} />)
      } else {
        return (
          <Image
            style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 9, marginTop: 19}]}
            source={Images.profileImage} />
        )
      }
    }
  }

  renderFollowButton () {
    if (this.state.follow) {
      return (
        <TouchableOpacity
          onPress={this.onFollowPress.bind(this)}>
          <View style={{width: 68, height: 23, borderWidth: 0.5, borderColor: '#D5D5D5', borderRadius: 20, paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, backgroundColor: 'white'}}>
            <Text style={{color: '#9E9E9E', fontSize: 12, textAlign: 'center'}}>팔로잉</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          onPress={this.onFollowPress.bind(this)}>
          <View style={{width: 68, height: 23, borderRadius: 20, paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, backgroundColor: '#F85032'}}>
            <Text style={{color: '#FFFFFF', fontSize: 12, textAlign: 'center'}}>팔로우</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  renderProfileInfo () {
    if (this.props.type === 'me') {
      return (
        <View style={{alignItems: 'center', backgroundColor: '#FFFFFF', marginBottom: 10}}>
          <View>
            <TouchableOpacity onPress={this.onProfileImagePress.bind(this)}>
              {this.renderProfileImage()}
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#626262', fontSize: 18, fontWeight: 'bold'}}>{this.props.nickname}</Text>
            <View style={{flexDirection: 'row', marginTop: 7, marginBottom: 25.5}}>
              <TouchableOpacity onPress={this.onFollowerPress.bind(this)} >
                <Text style={{color: '#8E8E8E', fontSize: 14}}>팔로워 <Text style={{fontWeight: 'bold'}}>{this.state.followerCount}</Text></Text>
              </TouchableOpacity>
              <View style={{top: 3, marginLeft: 9, marginRight: 9}}>
                <Text style={{color: '#8E8E8E', fontSize: 10}}> | </Text>
              </View>
              <TouchableOpacity onPress={this.onFollowingPress.bind(this)} >
                <Text style={{color: '#8E8E8E', fontSize: 14}}>팔로잉 <Text style={{fontWeight: 'bold'}}>{this.state.followingCount}</Text></Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{alignItems: 'center', backgroundColor: '#FFFFFF', marginBottom: 10}}>
          <View style={{flex: 2, flexDirection: 'row'}}>
            <TouchableOpacity onPress={this.onOtherProfileImagePress.bind(this)}>
              <View style={{flex: 3, alignItems: 'center'}}>{this.renderProfileImage()}</View>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'center'}} >
            <Text style={{color: '#626262', fontSize: 18, fontWeight: 'bold'}}>{this.props.nickname}</Text>
            <View style={{flexDirection: 'row', marginTop: 7, marginBottom: 25.5}}>
              <TouchableOpacity onPress={this.onFollowerPress.bind(this)} >
                <Text style={{color: '#8E8E8E', fontSize: 14}}>팔로워 <Text style={{fontWeight: 'bold'}}>{this.state.followerCount}</Text></Text>
              </TouchableOpacity>
              <View style={{top: 3, marginLeft: 9, marginRight: 9}}>
                <Text style={{color: '#8E8E8E', fontSize: 10}}> | </Text>
              </View>
              <TouchableOpacity onPress={this.onFollowingPress.bind(this)} >
                <Text style={{color: '#8E8E8E', fontSize: 14}}>팔로잉 <Text style={{fontWeight: 'bold'}}>{this.state.followingCount} </Text></Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginBottom: 10}} >
            {this.renderFollowButton()}
          </View>
        </View>
      )
    }
  }

  render () {
    return (
      <View>
        <ConfirmError
          confirmStyle={this.state.confirmStyle}
          visible={this.state.alertVisible}
          TextArray={this.state.alertTextArray}
          onAccept={this.onDecline.bind(this)}
          onSetting={this.onSetting.bind(this)} />
        {this.renderProfileInfo()}
      </View>
    )
  }

}

export default ProfileInfo
