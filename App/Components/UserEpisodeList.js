// TODO: *프로필 컴포넌트 따로 만들고 에피소드 리스트 리팩토링해서 재활용성 높이기

import React, { Component, PropTypes } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import { Colors } from '../Themes'

import EpisodeDetail from './common/EpisodeDetail'
import styles from '../Containers/Styles/FeedScreenStyle'

import AccountActions from '../Redux/AccountRedux'
import EpisodeActions from '../Redux/EpisodeRedux'

class UserEpisodeList extends Component {

  static propTypes = {
    // 내려온 프롭스
    id: PropTypes.number,

    // store 프롭스
    token: PropTypes.string,
    following: PropTypes.bool,

    profileImagePath: PropTypes.string,
    nickname: PropTypes.string,
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,

    items: PropTypes.array,

    requestOtherInfo: PropTypes.func,
    requestOtherEpisodes: PropTypes.func,
    deleteFollow: PropTypes.func,
    postFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      follow: this.props.following
    }
  }

  componentWillMount () {
    console.log(this.props)
    const { token, id } = this.props
    const active = false

    this.isAttempting = true

    this.props.requestOtherInfo(token, id)
    this.props.requestOtherEpisodes(token, id, active)
  }

  onFollowPress () {
    const { token } = this.props
    const id = this.props.id

    if (this.state.follow) {
      this.props.deleteFollow(token, id)
      this.setState({ follow: false })
    } else {
      this.props.postFollow(token, id)
      this.setState({ follow: true })
    }
  }

  renderFollowButton () {
    if (this.state.follow) {
      return (
        <TouchableOpacity
          onPress={this.onFollowPress.bind(this)}>
          <View style={{borderWidth: 0.5, borderColor: 'rgb(217, 217, 217)', borderRadius: 5, paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, backgroundColor: 'white'}}>
            <Text style={{color: 'black'}}>팔로잉</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          onPress={this.onFollowPress.bind(this)}>
          <View style={{borderWidth: 0.5, borderColor: 'rgb(217, 217, 217)', borderRadius: 5, paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8}}>
            <Text style={{color: 'rgb(217, 217, 217)'}}>팔로우</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  renderEpisodes () {
    return this.props.items.map(item =>
      <EpisodeDetail key={item.episode.id} episode={item.episode} account={item.account} />)
  }

  renderProfileInfo () {
    return (
      <View style={{alignItems: 'center', backgroundColor: '#000000'}}>
        <View style={{flex: 2}}>
          <Image
            style={[styles.image, {borderWidth: 1, borderColor: 'white', marginBottom: 14.5, marginTop: 39.5}]}
            source={{uri: this.props.profileImagePath}}
          />
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{color: Colors.snow, fontSize: 25, fontWeight: 'bold'}}>{this.props.nickname}</Text>
          <View style={{flexDirection: 'row', marginTop: 10.5, marginBottom: 25.5}}>
            <TouchableOpacity>
              <Text style={{color: Colors.snow, fontSize: 12}}>팔로워 {this.props.followerCount}</Text>
            </TouchableOpacity>
            <Text style={{color: Colors.snow, fontSize: 12}}> | </Text>
            <TouchableOpacity>
              <Text style={{color: Colors.snow, fontSize: 12}}>팔로잉 {this.props.followingCount} </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 10}}>
          {this.renderFollowButton()}
        </View>
      </View>
    )
  }

  render () {
    return (
      <ScrollView>
        {this.renderProfileInfo()}
        {this.renderEpisodes()}
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    following: state.account.otherFollowing,

    profileImagePath: state.account.otherProfileImagePath,
    nickname: state.account.otherNickname,
    followerCount: state.account.otherFollowerCount,
    followingCount: state.account.otherFollowingCount,

    items: state.episode.otherEpisodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestOtherInfo: (token, accountId) => dispatch(AccountActions.otherInfoRequest(token, accountId)),
    requestOtherEpisodes: (token, accountId, active) => dispatch(EpisodeActions.otherEpisodesRequest(token, accountId, active)),

    postFollow: (token, id) => dispatch(AccountActions.followPost(token, id)),
    deleteFollow: (token, id) => dispatch(AccountActions.followDelete(token, id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEpisodeList)
