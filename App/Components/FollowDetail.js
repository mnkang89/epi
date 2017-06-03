// TODO: 헤애함
import React, { Component, PropTypes } from 'react'
import { Text, Image, View, TouchableOpacity, Dimensions } from 'react-native'

import { Colors, Metrics, Images } from '../Themes/'
import CachableImage from '../Common/CachableImage'
import { getAccountId } from '../Services/Auth'
import { getRealm } from '../Services/RealmFactory'

const realm = getRealm()
const windowSize = Dimensions.get('window')

class FollowDetail extends Component {

  static propTypes = {
    follow: PropTypes.object,
    screen: PropTypes.string,

    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func,
    resetFollowModal: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      follow: this.props.follow.following
    }
  }

  componentDidMount () {
    const id = this.props.follow.id
    let user = realm.objects('user').filtered('id = ' + id)

    if (user.length === 0) {
      realm.write(() => {
        realm.delete(user)
        realm.create('user', { id: id })
      })
    } else {
      realm.write(() => {
        let user = Array.from(realm.objects('user').filtered('id = ' + id))[0]

        user.followStatus = this.props.follow.following
      })
    }

    realm.objects('user').filtered('id = ' + id).addListener((users, changes) => {
      let user = Array.from(realm.objects('user').filtered('id = ' + id))[0]

      setTimeout(() => {
        this.setState({ follow: user.followStatus })
      }, 500)
    })
  }

  onFollowPress () {
    const { token } = this.props
    const id = this.props.follow.id

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

  onProfilePress () {
    const accountId = this.props.follow.id
    this.props.resetFollowModal()

    if (this.props.screen === 'FeedScreen') {
      setTimeout(() => {
        this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'FeedScreen'})
      }, 500)
    } else if (this.props.screen === 'NotiScreen') {
      setTimeout(() => {
        this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'NotiScreen'})
      }, 500)
    } else if (this.props.screen === 'SearchScreen') {
      setTimeout(() => {
        this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'SearchScreen'})
      }, 500)
    } else if (this.props.screen === 'ProfileScreen') {
      setTimeout(() => {
        this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'ProfileScreen'})
      }, 500)
    }
  }

  renderProfileImage () {
    let uri = this.props.follow.profileImagePath

    if (uri) {
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

  renderFollowButton () {
    if (this.state.follow) {
      return (
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={this.onFollowPress.bind(this)} >
          <View style={{width: 68, height: 23, borderWidth: 0.5, borderColor: '#D5D5D5', borderRadius: 20, paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, backgroundColor: 'white'}}>
            <Text style={{color: '#9E9E9E', fontSize: 12, textAlign: 'center'}}>팔로잉</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={this.onFollowPress.bind(this)} >
          <View style={{width: 68, height: 23, borderRadius: 20, paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, backgroundColor: '#F85032'}}>
            <Text style={{color: '#FFFFFF', fontSize: 12, textAlign: 'center'}}>팔로우</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  render () {
    const { userTextStyle } = styles
    const { nickname } = this.props.follow

    return (
      <View style={{width: windowSize.width - 30, alignItems: 'center', height: 55, borderBottomWidth: 0.5, borderColor: 'rgb(231, 231, 231)', flexDirection: 'row', backgroundColor: 'white'}}>
        <TouchableOpacity
          style={{flex: 1, alignItems: 'flex-end'}}
          onPress={this.onProfilePress.bind(this)} >
          {this.renderProfileImage()}
        </TouchableOpacity>
        <View style={{flex: 5, justifyContent: 'center', paddingLeft: 10}}>
          <Text style={userTextStyle}>{nickname}</Text>
        </View>
        <View style={{flex: 1}}>
          {this.renderFollowButton()}
        </View>
      </View>
    )
  }
};

const styles = {
  headerContentStyle: {
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  userTextStyle: {
    color: 'rgb(53, 53, 53)',
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

export default FollowDetail
