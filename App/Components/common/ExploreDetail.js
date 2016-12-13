import React, { Component } from 'react'
import { ScrollView, Dimensions, Text, View, Image, TouchableOpacity } from 'react-native'
import { Colors, Metrics } from '../../Themes/'
import Video from 'react-native-video'

const screenWidth = Dimensions.get('window').width
const scrollViewWidth = Math.round(screenWidth * 0.90)
const cardWidth = scrollViewWidth * 0.80
const paddingCard = scrollViewWidth * 0.02

class ExploreDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      follow: false
    }
  }

  renderFollowButton () {
    if (this.state.follow) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({follow: false})
          }}>
          <View style={{borderWidth: 0.5, borderColor: 'rgb(217, 217, 217)', borderRadius: 5, paddingTop: 8, paddingBottom: 8, paddingRight: 6.4, paddingLeft: 6.4, backgroundColor: 'white'}}>
            <Text style={{color: 'black'}}>팔로잉</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({follow: true})
          }}>
          <View style={{borderWidth: 0.5, borderColor: 'rgb(217, 217, 217)', borderRadius: 5, paddingTop: 8, paddingBottom: 8, paddingRight: 6.4, paddingLeft: 6.4}}>
            <Text style={{color: 'rgb(217, 217, 217)'}}>팔로우</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  renderContents () {
    const contents = this.props.episode.contents
    // <ExploreContentDetail key={contents.indexOf(content)} content={content} />)
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

  render () {
    const { userTextStyle } = styles

    return (
      <View>
        <View style={{height: 57.5, marginLeft: 15, marginRight: 14.45, flexDirection: 'row', backgroundColor: 'black'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={styles.imageStyle}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
          </View>
          <View style={{marginLeft: 5, marginTop: 20}}>
            <Text style={userTextStyle}>작성자</Text>
          </View>
          <View style={{marginLeft: 170.5, marginTop: 14.5}}>
            {this.renderFollowButton()}
          </View>
        </View>
        <View style={{height: 162, marginLeft: 15, marginRight: 15}}>
          <ScrollView
            snapToAlignment={'start'}
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
};

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
