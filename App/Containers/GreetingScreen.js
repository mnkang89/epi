// @flow
// EPISODE

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput
} from 'react-native'
import Video from 'react-native-video'
import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
// import styles from './Styles/FeedScreenStyle'
import { Images, Videos } from '../Themes'

class GreetingScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      first: true,
      signUp: false,
      signIn: false,
      email: false,
      password: false,
      nickname: false,
      emailPassword: false,
      lostPassword: false
    }
  }

  conditionalRender () {
    if (this.state.first) {
      return (
        <View style={{marginTop: 433}}>
          <View style={{marginLeft: 22.5, marginRight: 72, backgroundColor: 'rgba(0,0,0,0)'}}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 72}}>episode</Text>
          </View>
          <TouchableOpacity
            style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 32, marginLeft: 22.5, marginRight: 22.5}}
            onPress={
              () => {
                this.setState({
                  first: false,
                  signUp: true,
                  signIn: false,
                  email: true,
                  password: false
                })
              }
            } >
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginTop: 20, marginLeft: 162.7, marginRight: 162.5}}
            onPress={() => {
              this.setState({
                first: false,
                signUp: false,
                signIn: true,
                email: false,
                password: false,
                emailPassword: true
              })
            }
          } >
            <Text style={{textDecorationLine: 'underline', backgroundColor: 'rgba(0,0,0,0)', color: 'white', fontSize: 15, alignSelf: 'center'}}>로그인</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (this.state.signIn) {
      if (this.state.emailPassword) {
        return (
          <View style={{marginTop: 44}}>
            <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>안녕하세요!</Text>
            </View>
            <View style={{marginTop: 8, marginLeft: 23, marginRight: 52, backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text style={{color: 'white', fontSize: 16}}>등록된 이메일과 비밀번호를 입력해주세요 😄</Text>
            </View>
            <View style={{marginTop: 78, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
              <TextInput
                placeholder='이메일'
                placeholderTextColor='white'
                style={{fontWeight: 'bold', color: 'white', height: 20}}
              />
            </View>
            <View style={{marginTop: 23, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
              <TextInput
                placeholder='비밀번호 (최소 8자, 최대 12자)'
                placeholderTextColor='white'
                style={{fontWeight: 'bold', color: 'white', height: 20}}
              />
            </View>
            <TouchableOpacity
              style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
              onPress={
                () => {
                  this.setState({
                    first: true,
                    signUp: false,
                    signIn: false,
                    email: false,
                    password: false,
                    nickname: false,
                    emailPassword: false,
                    lostPassword: false
                  })
                  NavigationActions.root()
                }
              } >
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginTop: 20, marginLeft: 60, marginRight: 62, backgroundColor: 'rgba(0,0,0,0)'}}
              onPress={() => {
                this.setState({
                  first: false,
                  signUp: false,
                  signIn: true,
                  email: false,
                  password: false,
                  emailPassword: false,
                  lostPassword: true
                })
              }
            } >
              <Text style={{textDecorationLine: 'underline', color: 'white', fontSize: 15, alignSelf: 'center'}}>비밀번호를 잊어버렸어요</Text>
            </TouchableOpacity>
          </View>
        )
      } else if (this.state.lostPassword) {
        return (
          <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
            <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>ㅠ.ㅠ</Text>
            </View>
            <View style={{marginTop: 17, marginLeft: 23, marginRight: 45, backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text style={{color: 'white', fontSize: 16}}>회원가입시 입력한 이메일을 알려주시면 비밀번호 변경 링크를 보내드려요 😉</Text>
            </View>
            <View style={{marginTop: 100, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
              <TextInput
                placeholder='이메일'
                placeholderTextColor='white'
                style={{fontWeight: 'bold', color: 'white', height: 20}}
              />
            </View>
            <TouchableOpacity
              style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
              onPress={
                () => {
                  this.setState({
                    first: true,
                    signUp: false,
                    signIn: false,
                    email: false,
                    password: false,
                    nickname: false,
                    emailPassword: false,
                    lostPassword: false
                  })
                }
              } >
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>임시비밀번호 전송</Text>
            </TouchableOpacity>
          </View>
        )
      }
    } else if (this.state.signUp) {
      if (this.state.email) {
        return (
          <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
            <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>반가워요!</Text>
            </View>
            <View style={{marginTop: 8, marginLeft: 23, marginRight: 114, backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text style={{color: 'white', fontSize: 16}}>앞으로 더 자주 볼 수 있도록 이메일과 비밀번호를 등록해주세요 🙂</Text>
            </View>
            <View style={{marginTop: 111, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white'}}>
              <TextInput
                placeholder='이메일'
                placeholderTextColor='white'
                style={{height: 20, color: 'white'}}
              />
            </View>
            <TouchableOpacity
              style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
              onPress={
                () => {
                  this.setState({
                    first: false,
                    signUp: true,
                    email: false,
                    password: true
                  })
                }
              } >
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>다음</Text>
            </TouchableOpacity>
          </View>
        )
      } else if (this.state.password) {
        return (
          <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
            <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>반가워요!</Text>
            </View>
            <View style={{marginTop: 8, marginLeft: 23, marginRight: 114, backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text style={{color: 'white', fontSize: 16}}>앞으로 더 자주 볼 수 있도록 이메일과 비밀번호를 등록해주세요 🙂</Text>
            </View>
            <View style={{marginTop: 57, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
              <TextInput
                placeholder='비밀번호 (최소 8자, 최대 12자)'
                placeholderTextColor='white'
                style={{fontWeight: 'bold', color: 'white', height: 20}}
              />
            </View>
            <View style={{marginTop: 23, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
              <TextInput
                placeholder='비밀번호 확인'
                placeholderTextColor='white'
                style={{fontWeight: 'bold', color: 'white', height: 20}}
              />
            </View>
            <TouchableOpacity
              style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
              onPress={
                () => {
                  this.setState({
                    first: false,
                    signUp: true,
                    email: false,
                    password: false,
                    nickname: true
                  })
                }
              } >
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>다음</Text>
            </TouchableOpacity>
          </View>
        )
      } else if (this.state.nickname) {
        return (
          <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
            <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>고마워요!</Text>
            </View>
            <View style={{marginTop: 8, marginLeft: 23, marginRight: 86, backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text style={{color: 'white', fontSize: 16}}>에피소드에서 사용할 프로필사진과 이름을 설정해주세요 😀</Text>
            </View>
            <View style={{marginTop: 18, marginBottom: 28}}>
              <Image source={Images.profileIcon} style={{alignSelf: 'center'}} />
            </View>
            <View style={{marginTop: 0, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
              <TextInput
                placeholder='이름 (한글과 영문대소문자, 숫자만가능)'
                placeholderTextColor='white'
                style={{fontWeight: 'bold', color: 'white', height: 20}}
              />
            </View>
            <TouchableOpacity
              style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
              onPress={
                () => {
                  this.setState({
                    first: true,
                    signUp: false,
                    email: false,
                    password: false,
                    nickname: false
                  })
                }
              } >
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>가입</Text>
            </TouchableOpacity>
          </View>
        )
      }
    }
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <Video source={Videos.backgroundVideo}   // Can be a URL or a local file.
          muted
          ref={(ref) => {
            this.player = ref
          }}                             // Store reference
          paused={false}                 // Pauses playback entirely.
          resizeMode='cover'             // Fill the whole screen at aspect ratio.
          repeat                         // Repeat forever.
          playInBackground={false}       // Audio continues to play when app entering background.
          playWhenInactive={false}       // [iOS] Video continues to play when control or notification center are shown.
          progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
        {this.conditionalRender()}
      </View>
    )
  }
}

export default GreetingScreen
