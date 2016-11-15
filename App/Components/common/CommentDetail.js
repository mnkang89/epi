import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { Colors } from '../../Themes'

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
      <View>
        <View style={headerContentStyle}>
          <Image
            style={styles.imageStyle}
            source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
          />
          <View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={userTextStyle}>{artist}</Text>
              <Text style={dateTextStyle}>2016-11-12</Text>
            </View>
            <View style={{flex: 2, marginTop: 10, marginBottom: 10}}>
              <Text style={{color: Colors.snow, fontSize: 12}}>Welcome. Not sure where to begin? Click here to view our Student Orientatint and Departmental</Text>
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
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  userTextStyle: {
    paddingTop: 10,
    color: Colors.snow,
    fontSize: 10,
    justifyContent: 'flex-start'
  },
  dateTextStyle: {
    color: Colors.snow,
    fontSize: 10,
    paddingTop: 10,
    left: 200
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
    height: 50,
    width: 50,
    borderRadius: 50
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
