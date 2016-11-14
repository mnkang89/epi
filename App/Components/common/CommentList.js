import React, { Component } from 'react';
import { ScrollView, TouchableHighlight } from 'react-native';
import axios from 'axios';
import CommentDetail from './CommentDetail';

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: []
    };
  }

  componentWillMount() {
    axios.get('https://rallycoding.herokuapp.com/api/music_albums')
      .then(response => this.setState({ albums: response.data }));
  }

  renderAlbums() {
    return this.state.albums.map(album =>
      <CommentDetail key={album.title} album={album} />);
  }

  render() {
    //console.log(this.state);
    return (
      <ScrollView>
        {this.renderAlbums()}
      </ScrollView>
    );
  }

}

export default CommentList;
