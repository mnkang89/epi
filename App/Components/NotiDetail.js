import React, { Component, PropTypes } from 'react'
import { Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { Colors, Images, Metrics } from '../Themes/'
import CachableImage from '../Common/CachableImage'
import { convert2TimeDiffString } from '../Lib/Utilities'

const windowSize = Dimensions.get('window')

class NotiDetail extends Component {

  static propTypes = {
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
    // api에서 notiRelateEntityMeta주면 변경할 예정
    // const { episodeId, contentId } = this.props.noti.notiRelateEntityMeta
    const account = this.props.myAccount

    if (this.state.type === 'comment') {
      const { episodeId, contentId } = this.props.noti.notiRelateEntityMeta
      this.props.openComment(true)
      this.props.getComment(null, episodeId, contentId)

      // NavigationActions.singleEpisodeScreen({
      //   type: 'push',
      //   screen: 'NotiScreen',
      //   detailType: 'single',
      //   singleType: 'noti',
      //   account,
      //   episodeId,
      //   contentId: null
      // })
      this.props.navigation.navigate('SingleEpisode', {
        screen: 'NotiScreen',
        detailType: 'single',
        singleType: 'noti',
        account,
        episodeId,
        contentId: null
      })
    } else if (this.state.type === 'like') {
      const { episodeId, contentId } = this.props.noti.notiRelateEntityMeta
      // TODO: openComment는 deprecated될 수 있음
      this.props.openComment(false)

      // NavigationActions.singleEpisodeScreen({
      //   type: 'push',
      //   screen: 'NotiScreen',
      //   detailType: 'single',
      //   singleType: 'noti',
      //   account,
      //   episodeId,
      //   contentId
      // })
      this.props.navigation.navigate('SingleEpisode', {
        screen: 'NotiScreen',
        detailType: 'single',
        singleType: 'noti',
        account,
        episodeId,
        contentId
      })
    } else if (this.state.type === 'follow') {
      const accountId = this.props.noti.notiCreateAccount.id
      this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'NotiScreen'})
      // NavigationActions.notiTouserProfileScreen({
      //   type: 'push',
      //   screen: 'NotiScreen',
      //   id: accountId
      // })
    } else if (this.state.type === 'newContent') {
      const accountId = this.props.noti.notiCreateAccount.id
      this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'NotiScreen'})
      // NavigationActions.notiTouserProfileScreen({
      //   type: 'push',
      //   screen: 'NotiScreen',
      //   id: accountId
      // })
    } else if (this.state.type === 'newEpisode') {
      const accountId = this.props.noti.notiCreateAccount.id
      this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'NotiScreen'})
      // NavigationActions.notiTouserProfileScreen({
      //   type: 'push',
      //   screen: 'NotiScreen',
      //   id: accountId
      // })
    }
  }

  onProfilePress () {
    const accountId = this.props.noti.notiCreateAccount.id
    this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'NotiScreen'})
    // NavigationActions.notiTouserProfileScreen({
    //   type: 'push',
    //   screen: 'NotiScreen',
    //   id: accountId
    // })
  }

  renderProfileImage () {
    const randomTime = new Date().getTime()
    const uri = `${this.props.noti.notiCreateAccount.profileImagePath}?random_number=${randomTime}`

    if (this.props.noti.notiCreateAccount.profileImagePath) {
      return (
        <CachableImage
          style={styles.imageStyle}
          source={{uri: uri}} />
      )
    } else {
      return (
        <Image
          style={styles.imageStyle}
          source={Images.profileImage} />
      )
    }
  }

  render () {
    const { message } = this.props.noti
    const timeDiffString = convert2TimeDiffString(this.props.noti.createDatetime)
    const nickname = this.props.noti.notiCreateAccount.nickname
    const nicknameStartingIndex = message.search(nickname)
    const nicknameEndingIndex = nicknameStartingIndex + nickname.length
    const messageWithoutNickname = message.slice(nicknameEndingIndex)

    return (
      <TouchableOpacity style={{alignItems: 'center'}} onPress={this.onNotiPress.bind(this)}>
        <View style={{width: windowSize.width, paddingLeft: 15, height: 55, flexDirection: 'row', backgroundColor: '#FFFFFF'}}>
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 3}}
            onPress={this.onProfilePress.bind(this)}>
            {this.renderProfileImage()}
          </TouchableOpacity>
          <View style={{flex: 10, flexDirection: 'row', paddingLeft: 11.5, borderBottomWidth: 1, borderColor: '#F1F1F1'}}>
            <View style={{flex: 8, justifyContent: 'center'}}>
              <Text style={{color: '#777777', fontWeight: 'bold'}}><Text style={{color: 'rgb(33, 33, 33)', fontWeight: 'bold'}}>{nickname}</Text>{messageWithoutNickname}</Text>
            </View>
            <View style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 15}}>
              <Text style={{fontSize: 10, color: '#B2B2B2'}}>{timeDiffString}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

}

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
