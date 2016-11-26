import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import axios from 'axios'
import ExploreDetail from './ExploreDetail'

class ExploreList extends Component {

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

  renderExplores () {
    return this.state.albums.map(album =>
      <ExploreDetail key={album.title} album={album} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderExplores()}
      </ScrollView>
    )
  }
}

export default ExploreList
