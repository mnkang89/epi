import React, { Component } from 'react'
import { ScrollView, Dimensions, Text, View, Image, TouchableOpacity } from 'react-native'
import { Colors, Metrics } from '../../Themes/'

const screenWidth = Dimensions.get('window').width
const scrollViewWidth = Math.round(screenWidth * 0.90)
const cardWidth = scrollViewWidth * 0.80
const paddingCard = scrollViewWidth * 0.02

class FollowDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: [],
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

  render () {
    const { artist, image } = this.props.album
    const {
            userTextStyle
          } = styles

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
            <Text style={userTextStyle}>{artist}</Text>
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
            horizontal
          >
            <View style={{marginRight: 8.1}}>
              <Image style={{height: 146.6, width: 146.6}} source={{ uri: image }} />
            </View>
            <View style={{marginRight: 8.1}}>
              <Image style={{height: 146.6, width: 146.6}} source={{ uri: image }} />
            </View>
            <View style={{marginRight: 8.1}}>
              <Image style={{height: 146.6, width: 146.6}} source={{ uri: image }} />
            </View>
            <View style={{marginRight: 8.1}}>
              <Image style={{height: 146.6, width: 146.6}} source={{ uri: image }} />
            </View>
            <View style={{marginRight: 8.1}}>
              <Image style={{height: 146.6, width: 146.6}} source={{ uri: image }} />
            </View>
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

export default FollowDetail
