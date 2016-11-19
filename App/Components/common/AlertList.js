import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import axios from 'axios'
import AlertDetail from './AlertDetail'

class AlertList extends Component {
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

  renderAlerts () {
    return this.state.albums.map(album =>
      <AlertDetail key={album.title} album={album} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderAlerts()}
      </ScrollView>
    )
  }
}

export default AlertList
