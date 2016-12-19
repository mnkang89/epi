import React, { Component } from 'react'
import { ScrollView } from 'react-native'
// import axios from 'axios'
import CommentDetail from './CommentDetail'

export default class CommentList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comments: []
    }
  }

  /*
    componentWillMount () {
      axios.get('https://rallycoding.herokuapp.com/api/music_albums')
        .then(response => this.setState({ comments: response.data }))
    }
  */

  renderComments () {
    return this.props.comments.map(comment =>
      <CommentDetail key={comment.id} comment={comment} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderComments()}
      </ScrollView>
    )
  }

}
