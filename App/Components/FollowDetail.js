// TODO: 헤애함
import React, { Component, PropTypes } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'

import { Colors, Metrics } from '../Themes/'

class FollowDetail extends Component {

  static propTypes = {
    album: PropTypes.object
  }

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
          <View style={{borderWidth: 1, borderColor: 'rgb(53, 53, 53)', borderRadius: 5, padding: 5, backgroundColor: 'black'}}>
            <Text style={{color: 'white'}}>팔로잉</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({follow: true})
          }}>
          <View style={{borderWidth: 1, borderColor: 'rgb(53, 53, 53)', borderRadius: 5, padding: 5, backgroundColor: 'white'}}>
            <Text>팔로우</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  render () {
    const { artist } = this.props.album
    const {
            userTextStyle
          } = styles

    return (
      <View style={{height: 55, marginLeft: 15, marginRight: 14.45, borderBottomWidth: 0.5, borderColor: 'rgb(231, 231, 231)', flexDirection: 'row', backgroundColor: 'white'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={styles.imageStyle}
            source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
          />
        </View>
        <View style={{marginLeft: 8.9, marginTop: 20}}>
          <Text style={userTextStyle}>{artist}</Text>
        </View>
        <View style={{marginLeft: 170.5, marginTop: 14.5}}>
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
