// TODO: *프로필 컴포넌트 따로 만들기

import React, { Component, PropTypes } from 'react'
import { View, Image, ImagePickerIOS, TouchableOpacity, Text } from 'react-native'
import Permissions from 'react-native-permissions'

import ConfirmError from './ConfirmError'
import { Colors, Images } from '../../Themes'
import styles from '../../Containers/Styles/FeedScreenStyle'

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
      follow: this.props.following
    }
  }

  componentDidMount () {
    // console.log(this.props)
  }

  onProfileImagePress () {
    const { token, accountId } = this.props

    Permissions.getPermissionStatus('photo')
      .then(response => {
        // response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        if (response === 'undetermined') {
          Permissions.requestPermission('photo').then(response => {
            Permissions.openSettings()
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
              this.setState({
                photoSource: data
              })
              this.props.requestProfileImage(data, token, accountId)
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
      this.setState({ follow: false })
    } else {
      this.props.postFollow(token, id)
      this.setState({ follow: true })
    }
  }

  onFollowingPress () {
    const { token, id } = this.props

    this.props.openFollow(true, '팔로잉')
    this.props.getFollowing(token, id)
  }

  onFollowerPress () {
    const { token, id } = this.props

    this.props.openFollow(true, '팔로워')
    this.props.getFollower(token, id)
  }

  renderProfileImage () {
    if (this.props.type === 'me') {
      if (this.state.photoSource) {
        return (
          <Image
            style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 14.5, marginTop: 39.5}]}
            source={{uri: this.state.photoSource}} />)
      } else {
        return (
          <Image
            style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 14.5, marginTop: 39.5}]}
            source={Images.profileIcon} />
        )
      }
    } else {
      if (this.props.profileImagePath) {
        return (
          <Image
            style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 14.5, marginTop: 39.5}]}
            source={{uri: this.props.profileImagePath}} />)
      } else {
        return (
          <Image
            style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 14.5, marginTop: 39.5}]}
            source={Images.profileIcon} />
        )
      }
    }
  }

  renderFollowButton () {
    if (this.state.follow) {
      return (
        <TouchableOpacity
          onPress={this.onFollowPress.bind(this)}>
          <View style={{borderWidth: 0.5, borderColor: 'rgb(217, 217, 217)', borderRadius: 5, paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, backgroundColor: 'white'}}>
            <Text style={{color: 'black'}}>팔로잉</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          onPress={this.onFollowPress.bind(this)}>
          <View style={{borderWidth: 0.5, borderColor: 'rgb(217, 217, 217)', borderRadius: 5, paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8}}>
            <Text style={{color: 'rgb(217, 217, 217)'}}>팔로우</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }
  /*
  <TouchableOpacity onPress={this.onProfileImagePress.bind(this)}>
    {this.renderProfileImage()}
  </TouchableOpacity>
  */

  renderProfileInfo () {
    if (this.props.type === 'me') {
      console.log('미야미')
      console.log(this.props.nickname)
      console.log(this.props.followerCount)
      console.log(this.props.followingCount)
      return (
        <View style={{alignItems: 'center', backgroundColor: '#000000'}}>
          <View>
            <TouchableOpacity onPress={this.onProfileImagePress.bind(this)}>
              {this.renderProfileImage()}
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: Colors.snow, fontSize: 25, fontWeight: 'bold'}}>{this.props.nickname}</Text>
            <View style={{flexDirection: 'row', marginTop: 10.5, marginBottom: 25.5}}>
              <TouchableOpacity>
                <Text style={{color: Colors.snow, fontSize: 12}}>팔로워 {this.props.followerCount}</Text>
              </TouchableOpacity>
              <Text style={{color: Colors.snow, fontSize: 12}}> | </Text>
              <TouchableOpacity>
                <Text style={{color: Colors.snow, fontSize: 12}}>팔로잉 {this.props.followingCount} </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{alignItems: 'center', backgroundColor: '#000000'}}>
          <View style={{flex: 2}}>
            {this.renderProfileImage()}
          </View>
          <View style={{flex: 1, alignItems: 'center'}} >
            <Text style={{color: Colors.snow, fontSize: 25, fontWeight: 'bold'}}>{this.props.nickname}</Text>
            <View style={{flexDirection: 'row', marginTop: 10.5, marginBottom: 25.5}}>
              <TouchableOpacity onPress={this.onFollowerPress.bind(this)} >
                <Text style={{color: Colors.snow, fontSize: 12}}>팔로워 {this.props.followerCount}</Text>
              </TouchableOpacity>
              <Text style={{color: Colors.snow, fontSize: 12}}> | </Text>
              <TouchableOpacity onPress={this.onFollowingPress.bind(this)} >
                <Text style={{color: Colors.snow, fontSize: 12}}>팔로잉 {this.props.followingCount} </Text>
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
