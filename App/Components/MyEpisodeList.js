// TODO: *프로필 컴포넌트 따로 만들고 에피소드 리스트 리팩토링해서 재활용성 높이기

import React, { Component, PropTypes } from 'react'
import { ScrollView, View, Image, ImagePickerIOS, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import Permissions from 'react-native-permissions'

import { Colors, Images } from '../Themes'
import styles from '../Containers/Styles/FeedScreenStyle'

import ConfirmError from './common/ConfirmError'
import EpisodeDetail from './common/EpisodeDetail'

import SignupActions from '../Redux/SignupRedux'

class MyEpisodeList extends Component {

  static propTypes = {
    token: PropTypes.string,
    accountId: PropTypes.number,

    profileImagePath: PropTypes.string,
    nickname: PropTypes.string,
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,

    items: PropTypes.array,
    account: PropTypes.object,

    requestProfileImage: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm',

      photoSource: this.props.profileImagePath
    }
  }

  componentDidMount () {
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
          // 사진 라이브러리 가서 사진 가저오는 로직
          // openSelectDialog
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

  onDecline () {
    this.setState({
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm'
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

  renderProfileImage () {
    if (this.state.photoSource) {
      return (
        <Image
          style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 14.5, marginTop: 39.5}]}
          source={{uri: this.state.photoSource}} />)
    } else {
      return (<Image source={Images.profileIcon} style={{alignSelf: 'center'}} />)
    }
  }

  renderProfileInfo () {
    return (
      <View style={{alignItems: 'center', backgroundColor: '#000000'}}>
        <View style={{flex: 2}}>
          <TouchableOpacity onPress={this.onProfileImagePress.bind(this)}>
            {this.renderProfileImage()}
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
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
  }

  renderEpisodes () {
    return this.props.items.map(item =>
      <EpisodeDetail key={item.episode.id} episode={item.episode} account={this.props.account} />)
  }

  render () {
    return (
      <ScrollView>
        <ConfirmError
          confirmStyle={this.state.confirmStyle}
          visible={this.state.alertVisible}
          TextArray={this.state.alertTextArray}
          onAccept={this.onDecline.bind(this)}
          onSetting={this.onSetting.bind(this)} />
        {this.renderProfileInfo()}
        {this.renderEpisodes()}
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    accountId: state.token.id,

    nickname: state.account.nickname,
    profileImagePath: state.account.profileImagePath,
    followerCount: state.account.followerCount,
    followingCount: state.account.followingCount,

    account: state.account,
    items: state.episode.episodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestProfileImage: (photoSource, token, accountId) => dispatch(SignupActions.profileRequest(photoSource, token, accountId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyEpisodeList)
