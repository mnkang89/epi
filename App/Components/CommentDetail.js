import React, { Component, PropTypes } from 'react'
import { Text, View, Image, TouchableOpacity, Modal } from 'react-native'

import { Colors, Metrics } from '../Themes/'

class CommentDetail extends Component {

  static propTypes = {
    comment: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      settingModal: false
    }
  }

  commentSetting () {
    this.setState({
      settingModal: true
    })
  }

  cancelPress () {
    this.setState({
      settingModal: false
    })
  }

  removeCommentPress () {
    this.setState({
      settingModal: false
    })
  }

  render () {
    const { message } = this.props.comment
    const { nickname } = this.props.comment.account
    const {
            headerContentStyle,
            userTextStyle,
            dateTextStyle
          } = styles

    return (
      <View style={{marginLeft: 14.25, marginRight: 14.25}}>
        <View style={headerContentStyle}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={styles.imageStyle}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
          </View>
          <View style={{width: 250, marginLeft: 5, marginRight: 11}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={userTextStyle}>{nickname}</Text>
            </View>
            <View style={{flex: 2, marginTop: 3, marginBottom: 10}}>
              <Text style={{color: 'rgb(53, 53, 53)', fontSize: 15, lineHeight: 16}}>{message}</Text>
              <Text style={dateTextStyle}>2016-11-12 11:00:00</Text>
            </View>
          </View>
          <View style={{marginTop: 14, marginLeft: 11}}>
            <TouchableOpacity
              style={{width: 20, height: 20, marginTop: 20, marginLeft: 11}}
              onPress={this.commentSetting.bind(this)} >
              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: 3, width: 3, height: 3, backgroundColor: 'rgb(198,198,198)'}} />
                <View style={{marginRight: 3, width: 3, height: 3, backgroundColor: 'rgb(198,198,198)'}} />
                <View style={{width: 3, height: 3, backgroundColor: 'rgb(198,198,198)'}} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType={'slide'}
          transparent
          visible={this.state.settingModal}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}}>
            <View style={{
              width: 355,
              marginTop: 535,
              alignSelf: 'center',
              backgroundColor: 'rgba(252,252,252,0.8)',
              borderRadius: 12}} >
              <TouchableOpacity onPress={this.removeCommentPress.bind(this)}>
                <View style={{height: 60, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.5)'}}>
                  <Text style={{fontSize: 20, color: 'rgb(254,56,36)'}}>댓글 삭제</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.cancelPress.bind(this)}>
                <View style={{height: 60, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, color: 'rgb(0,118,255)'}}>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = {
  headerContentStyle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: 'rgb(231, 231, 231)'
  },
  userTextStyle: {
    paddingTop: 10,
    color: 'rgb(53, 53, 53)',
    fontSize: 12.5,
    fontWeight: 'bold',
    justifyContent: 'flex-start'
  },
  dateTextStyle: {
    color: 'rgb(145, 145, 145)',
    fontSize: 9,
    paddingTop: 4
  },
  thumbnailStyle: {
    height: 50,
    width: 50
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  imageStyle: {
    width: Metrics.icons.large,
    height: Metrics.icons.large,
    borderRadius: Metrics.icons.large / 2
  },
  textStyle: {
    backgroundColor: '#000000',
    flex: 1,
    height: 113
  },
  textContainerStyle: {
    color: Colors.snow,
    fontSize: 20,
    fontWeight: 'bold'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
}

export default CommentDetail
