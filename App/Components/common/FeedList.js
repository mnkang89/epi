import React, { Component } from 'react'
import { ScrollView, Alert } from 'react-native'
import axios from 'axios'
import FeedDetail from './FeedDetail'

class FeedList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: []
    }
  }

  componentWillMount () {
    axios.get('https://rallycoding.herokuapp.com/api/music_albums')
      .then(response => {
        this.setState({ albums: response.data })
      })
  }

  renderAlbums () {
    return this.state.albums.map(album =>
      <FeedDetail key={album.title} album={album} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderAlbums()}
      </ScrollView>
    )
  }

}

export default FeedList
