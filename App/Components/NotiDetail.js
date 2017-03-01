import React, { Component, PropTypes } from 'react'
import { Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { Colors, Images, Metrics } from '../Themes/'
import CachableImage from '../Common/CachableImage'
import { convert2TimeDiffString } from '../Lib/Utilities'

const windowSize = Dimensions.get('window')

class NotiDetail extends Component {

  static propTypes = {
    token: PropTypes.string,
    noti: PropTypes.object,
    myAccount: PropTypes.object,

    openComment: PropTypes.func,
    getComment: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      type: this.props.noti.type
    }
  }

  onNotiPress () {
    const { episodeId, contentId } = this.props.noti.notiRelateEntityMeta
    const { token } = this.props
    // const account = this.props.noti.notiCreateAccount
    const account = this.props.myAccount
    console.log(this.state.type)

    if (this.state.type === 'comment') {
      this.props.openComment(true)
      this.props.getComment(token, episodeId, contentId)

      NavigationActions.singleEpisodeScreen({
        type: 'push',
        screen: 'NotiScreen',
        detailType: 'single',
        singleType: 'noti',
        account,
        episodeId,
        contentId: null
      })
    } else if (this.state.type === 'like') {
      // TODO: openComment는 deprecated될 수 있음
      this.props.openComment(false)

      NavigationActions.singleEpisodeScreen({
        type: 'push',
        screen: 'NotiScreen',
        detailType: 'single',
        singleType: 'noti',
        account,
        episodeId,
        contentId
      })
    } else if (this.state.type === 'follow') {
      const accountId = this.props.noti.notiCreateAccount.id

      NavigationActions.notiTouserProfileScreen({
        type: 'push',
        screen: 'NotiScreen',
        id: accountId
      })
    }
  }

  onProfilePress () {
    const accountId = this.props.noti.notiCreateAccount.id

    NavigationActions.notiTouserProfileScreen({
      type: 'push',
      screen: 'NotiScreen',
      id: accountId
    })
  }

  renderProfileImage () {
    if (this.props.noti.notiCreateAccount.profileImagePath) {
      return (
        <CachableImage
          style={styles.imageStyle}
          source={{uri: this.props.noti.notiCreateAccount.profileImagePath}} />
      )
    } else {
      return (
        <Image
          style={styles.imageStyle}
          source={Images.profileImage} />
      )
    }
  }

  // renderProfileImage () {
  //   let uri = this.props.noti.notiCreateAccount.profileImagePath
  //   // let uri = 'https://facebook.github.io/react/img/logo_og.png'
  //   if (uri) {
  //     return (
  //       <CachableImage
  //         style={styles.profileStyle}
  //         source={{uri: uri}} />
  //     )
  //   } else {
  //     return (
  //       <CachableImage
  //         style={styles.profileStyle}
  //         source={Images.profileImage} />
  //     )
  //   }
  // }

  render () {
    const { message } = this.props.noti
    const timeDiffString = convert2TimeDiffString(this.props.noti.createDatetime)

    return (
      <TouchableOpacity style={{alignItems: 'center'}} onPress={this.onNotiPress.bind(this)}>
        <View style={{width: windowSize.width, paddingLeft: 15, paddingRight: 15, height: 55, borderBottomWidth: 1, borderColor: '#F1F1F1', flexDirection: 'row', backgroundColor: '#FFFFFF'}}>
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 3}}
            onPress={this.onProfilePress.bind(this)}>
            {this.renderProfileImage()}
          </TouchableOpacity>
          <View style={{flex: 10, flexDirection: 'row', paddingLeft: 11.5}}>
            <View style={{flex: 7, justifyContent: 'center'}}>
              <Text style={{color: '#777777', fontWeight: 'bold'}}>{message}</Text>
            </View>
            <View style={{flex: 3, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{fontSize: 10, color: '#B2B2B2'}}>{timeDiffString}</Text>
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
