// TODO: *프로필 컴포넌트 따로 만들기

import React, { Component, PropTypes } from 'react'
import { View, Image, ImagePickerIOS, TouchableOpacity, Text } from 'react-native'
import Permissions from 'react-native-permissions'

import ConfirmError from './ConfirmError'
import { Images } from '../../Themes'
import styles from '../../Containers/Styles/FeedScreenStyle'
// import { Actions as NavigationActions } from 'react-native-router-flux'
// import CachableImage from '../../Common/CachableImage'
import { getAccountId } from '../../Services/Auth'

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
      photoViewerVisible: false
    }
  }

  componentDidMount () {
    // console.log(this.props)
  }

  onProfileImagePress () {
    const { token } = this.props
    const accountId = getAccountId()

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
        console.tron.log(this.state.photoSource)
        const randomTime = new Date().getTime()
        const uri = `${this.state.photoSource}?random_number=${randomTime}`

        return (
          <Image
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
          <Image
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
                <Text style={{color: '#8E8E8E', fontSize: 14}}>팔로워 <Text style={{fontWeight: 'bold'}}>{this.props.followerCount}</Text></Text>
              </TouchableOpacity>
              <View style={{top: 3, marginLeft: 9, marginRight: 9}}>
                <Text style={{color: '#8E8E8E', fontSize: 10}}> | </Text>
              </View>
              <TouchableOpacity onPress={this.onFollowingPress.bind(this)} >
                <Text style={{color: '#8E8E8E', fontSize: 14}}>팔로잉 <Text style={{fontWeight: 'bold'}}>{this.props.followingCount}</Text></Text>
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
                <Text style={{color: '#8E8E8E', fontSize: 14}}>팔로워 <Text style={{fontWeight: 'bold'}}>{this.props.followerCount}</Text></Text>
              </TouchableOpacity>
              <View style={{top: 3, marginLeft: 9, marginRight: 9}}>
                <Text style={{color: '#8E8E8E', fontSize: 10}}> | </Text>
              </View>
              <TouchableOpacity onPress={this.onFollowingPress.bind(this)} >
                <Text style={{color: '#8E8E8E', fontSize: 14}}>팔로잉 <Text style={{fontWeight: 'bold'}}>{this.props.followingCount} </Text></Text>
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

// <Modal
//   animationType={'fade'}
//   visible={this.state.photoViewerVisible}>
//   <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'black'}}>
//     <View style={{flex: 1, justifyContent: 'center'}}>
//       <TouchableOpacity onPress={this._onPressViewerExit.bind(this)}>
//         <View style={{left: 10, top: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: 'white'}} />
//       </TouchableOpacity>
//     </View>
//     <View style={{flex: 10, justifyContent: 'center'}}>
//       <CachableImage source={{uri: this.props.profileImagePath}} style={{width: windowSize.width, height: windowSize.height - 200}} />
//     </View>
//     <View style={{flex: 1}} />
//   </View>
// </Modal>
