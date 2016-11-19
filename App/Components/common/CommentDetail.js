import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { Colors, Metrics } from '../../Themes/'

class CommentDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: []
    }
  }

  render () {
    const { artist } = this.props.album
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
          <View style={{marginLeft: 5, marginRight: 100}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={userTextStyle}>{artist}</Text>
            </View>
            <View style={{flex: 2, marginTop: 3, marginBottom: 10}}>
              <Text style={{color: 'rgb(53, 53, 53)', fontSize: 15, lineHeight: 16}}>가나다라바바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차</Text>
              <Text style={dateTextStyle}>2016-11-12 11:00:00</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
};

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
