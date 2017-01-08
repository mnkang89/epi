import React, { Component } from 'react'
import { View, RefreshControl, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import EpisodeDetail from './EpisodeDetail'
import EpisodeActions from '../../Redux/EpisodeRedux'

class SingleEpisodeList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentWillMount () {
    console.log('싱글 에피소드 리스트')
    console.log(this.props)
    this.isAttempting = true
    const { token, episodeId } = this.props

    this.props.requestSingleEpisode(token, episodeId)
    console.log('하이')
    console.log(this.props)
    console.log('하이')
  }

  componentWillReceiveProps (nextProps) {
    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
      this.setState({refreshing: false})
    } else {
      console.log('아이템다름')
      if (this.state.refreshing) {
        this.setState({refreshing: false})
        setTimeout(() => {
          console.log(this.state.refreshing)
        }, 100)
      }
    }
  }

  onRefresh () {
    console.log('onRefresh에서 리프레슁 상태')
    console.log(this.state.refreshing)
    const { token, episodeId } = this.props
    this.setState({refreshing: true})
    this.props.requestSingleEpisode(token, episodeId)
  }

  renderEpisodes () {
    console.log(this.props)
    return this.props.items.map(item =>
      <EpisodeDetail key={item.id} episode={item} />)
  }

  render () {
    return (
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >
          {this.renderEpisodes()}
        </ScrollView>
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    accountId: state.token.id,

    items: state.episode.singleEpisode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestSingleEpisode: (token, episodeId) => dispatch(EpisodeActions.singleEpisodeRequest(token, episodeId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleEpisodeList)
