import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { Colors, Images, Metrics } from '../Themes/'

class NotiDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: this.props.noti.type
    }
  }

  onNotiPress () {
    const { episodeId, contentId } = this.props.noti.notiRelateEntityMeta
    const account = this.props.noti.notiCreateAccount

    if (this.state.type === 'comment') {
      NavigationActions.singleEpisodeScreen({
        type: 'push',
        modal: true,
        account,
        episodeId,
        contentId: null
      })
    } else if (this.state.type === 'like') {
      NavigationActions.singleEpisodeScreen({
        type: 'push',
        modal: false,
        account,
        episodeId,
        contentId
      })
    } else if (this.state.type === 'follow') {
      const accountId = this.props.noti.notiRelateEntityMeta

      NavigationActions.notiTouserProfileScreen({
        type: 'push',
        id: accountId
      })
    }
  }

  onProfilePress () {
    const accountId = this.props.noti.notiCreateAccount.id

    NavigationActions.notiTouserProfileScreen({
      type: 'push',
      id: accountId
    })
  }

  renderProfileImage () {
    if (this.props.noti.notiCreateAccount.profileImagePath) {
      return (<Image
        style={styles.imageStyle}
        source={{uri: this.props.noti.notiCreateAccount.profileImagePath}} />
      )
    } else {
      return (<Image
        style={styles.imageStyle}
        source={Images.profileImage} />
      )
    }
  }

  render () {
    const { message } = this.props.noti

    return (
      <TouchableOpacity onPress={this.onNotiPress.bind(this)}>
        <View style={{height: 55, marginLeft: 15, marginRight: 15, borderBottomWidth: 1, borderColor: 'rgb(45, 45, 45)', flexDirection: 'row', backgroundColor: 'black'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={this.onProfilePress.bind(this)}>
              {this.renderProfileImage()}
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 11.5, marginRight: 24.5, justifyContent: 'center'}}>
            <View style={{marginRight: 24.5}}>
              <Text style={{color: 'rgb(217, 217, 217)'}}>{message}</Text>
            </View>
            <View style={{marginRight: 24.5}}>
              <Text style={{alignSelf: 'flex-end', fontSize: 10, color: 'rgb(123,123,123)'}}>1분 전</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
};

const styles = {
  headerContentStyle: {
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  userTextStyle: {
    color: 'white',
    fontSize: 12.5,
    fontWeight: 'bold'
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

export default NotiDetail
