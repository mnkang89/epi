import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import axios from 'axios'
import FollowDetail from './FollowDetail'

class FollowList extends Component {
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

  renderFollows () {
    return this.state.albums.map(album =>
      <FollowDetail key={album.title} album={album} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderFollows()}
      </ScrollView>
    )
  }
}

export default FollowList
