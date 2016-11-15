import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import axios from 'axios'
import CommentDetail from './CommentDetail'

class FollowerList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: []
    }
  }

  componentWillMount () {
    axios.get('https://rallycoding.herokuapp.com/api/music_albums')
      .then(response => this.setState({ albums: response.data }))
  }

  renderFollowers () {
    return this.state.albums.map(album =>
      <CommentDetail key={album.title} album={album} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderFollowers()}
      </ScrollView>
    )
  }
}

export default FollowerList
