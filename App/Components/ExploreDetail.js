import React, { Component, PropTypes } from 'react'
import { ScrollView, Dimensions, Text, View, Image, TouchableOpacity } from 'react-native'
import Video from 'react-native-video'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import { Colors, Images, Metrics } from '../Themes/'

import AccountActions from '../Redux/AccountRedux'

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

    deleteFollow: PropTypes.func,
    postFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      follow: this.props.following
    }
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
      id: accountId
    })
  }

  onEpisodePress () {
    const episodeId = this.props.episode.id
    const account = this.props.account
    NavigationActions.searchTosingleEpisodeScreen({
      type: 'push',
      modal: false,
      episodeId,
      account,
      contentId: null
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
          <View key={contents.indexOf(content)} style={{marginRight: 8.1}}>
            <Image style={{height: 146.6, width: 146.6}} source={{ uri: content.path }} />
          </View>
        )
      } else {
        return (
          <View key={contents.indexOf(content)} style={{marginRight: 8.1}}>
            <View style={{height: 146.6, width: 146.6}}>
              <Video
                source={{uri: content.path}}   // Can be a URL or a local file.
                muted
                ref={(ref) => {
                  this.player = ref
                }}                             // Store reference
                paused={false}                 // Pauses playback entirely.
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
        )
      }
    }
    )
  }

  renderProfileImage () {
    if (this.props.account.profileImagePath) {
      return (<Image
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
    console.log('팔로잉여부')
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
        <TouchableOpacity onPress={this.onEpisodePress.bind(this)}>
          <View style={{height: 162, marginLeft: 15, marginRight: 15}}>
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
        </TouchableOpacity>
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

const mapStateToProps = (state) => {
  return {
    token: state.token.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    postFollow: (token, id) => dispatch(AccountActions.followPost(token, id)),
    deleteFollow: (token, id) => dispatch(AccountActions.followDelete(token, id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreDetail)
