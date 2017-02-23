import React, { Component, PropTypes } from 'react'
import { ScrollView, Dimensions, Text, View, Image, TouchableOpacity } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
// import Video from 'react-native-video'
import CachableImage from '../Common/CachableImage'
import CachableVideo from '../Common/CachableVideo'

import { Colors, Images, Metrics } from '../Themes/'

const windowSize = Dimensions.get('window')
const screenWidth = Dimensions.get('window').width
const scrollViewWidth = Math.round(screenWidth * 0.90)
const cardWidth = scrollViewWidth * 0.80
const paddingCard = scrollViewWidth * 0.02

class ExploreDetail extends Component {

  static propTypes = {
    token: PropTypes.string,
    following: PropTypes.bool.isRequired,

    account: PropTypes.object.isRequired,
    episode: PropTypes.object.isRequired,

    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func,

    cameraHandler: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      follow: this.props.following
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      follow: nextProps.following
    })
  }

  onFollowPress () {
    const { token } = this.props
    const id = this.props.episode.accountId

    if (this.state.follow) {
      this.props.deleteFollow(token, id)
      this.setState({follow: false})
    } else {
      this.props.postFollow(token, id)
      this.setState({follow: true})
    }
  }

  onProfileImagePress () {
    const accountId = this.props.account.id
    console.log(accountId)
    NavigationActions.searchTouserProfileScreen({
      type: 'push',
      screen: 'SearchScreen',
      id: accountId
    })
  }

  onEpisodePress (contentId) {
    const episodeId = this.props.episode.id
    const account = this.props.account
    NavigationActions.searchTosingleEpisodeScreen({
      type: 'push',
      screen: 'SearchScreen',
      detailType: 'single',
      singleType: 'search',
      modal: false,
      episodeId,
      contentId,
      account
    })
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

  renderContents () {
    const contents = this.props.episode.contents
    return contents.map(content => {
      if (content.type === 'Image') {
        return (
          <TouchableOpacity key={contents.indexOf(content)} onPress={this.onEpisodePress.bind(this, content.id)} >
            <View style={{marginRight: 8.1}} >
              <CachableImage style={{width: windowSize.width - 228.4, height: windowSize.width - 228.4}} source={{ uri: content.path }} />
            </View>
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity key={contents.indexOf(content)} onPress={this.onEpisodePress.bind(this, content.id)} >
            <View style={{marginRight: 8.1}}>
              <View style={{width: windowSize.width - 228.4, height: windowSize.width - 228.4}}>
                <CachableVideo
                  source={{uri: content.path}}   // Can be a URL or a local file.
                  muted
                  videoRef={(ref) => {
                    this.player = ref
                  }}                             // Store reference
                  paused
                  resizeMode='cover'             // Fill the whole screen at aspect ratio.
                  repeat={false}                         // Repeat forever.
                  playInBackground={false}       // Audio continues to play when app entering background.
                  playWhenInactive              // [iOS] Video continues to play when control or notification center are shown.
                  progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  }} />
              </View>
            </View>
          </TouchableOpacity>
        )
      }
    }
    )
  }

  renderProfileImage () {
    if (this.props.account.profileImagePath) {
      return (<CachableImage
        style={styles.imageStyle}
        source={{uri: this.props.account.profileImagePath}} />
      )
    } else {
      return (<Image
        style={styles.imageStyle}
        source={Images.profileImage} />
      )
    }
  }

  render () {
    console.tron.log('팔로잉여부')
    console.log(this.props.following)
    const { userTextStyle } = styles

    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 57.5, marginLeft: 15, marginRight: 14.45, backgroundColor: 'black'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={this.onProfileImagePress.bind(this)}>
              {this.renderProfileImage()}
            </TouchableOpacity>
            <View style={{marginLeft: 5}}>
              <Text style={userTextStyle}>{this.props.account.nickname}</Text>
            </View>
          </View>
          <View style={{marginTop: 14.5}}>
            {this.renderFollowButton()}
          </View>
        </View>
        <View style={{height: windowSize.width - 213, marginLeft: 15, marginRight: 15}}>
          <ScrollView
            snapToAlignment={'center'}
            scrollEventThrottle={299}
            directionalLockEnabled
            decelerationRate={'fast'}
            snapToInterval={cardWidth + paddingCard + paddingCard + 1}
            showsHorizontalScrollIndicator
            horizontal >
            {this.renderContents()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = {
  headerContentStyle: {
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  userTextStyle: {
    color: 'rgb(217, 217, 217)',
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

export default ExploreDetail
