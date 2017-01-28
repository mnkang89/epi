import React, { Component, PropTypes } from 'react'
import {
  View,
  Modal,
  Text,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import FollowList from '../FollowList'

class FollowModal extends Component {

  static propTypes = {
    token: PropTypes.string,

    showType: PropTypes.string,
    followVisible: PropTypes.bool,
    follows: PropTypes.array,

    openFollow: PropTypes.func,
    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      text: '',
      height: 5,
      inputBottom: 40,
      followVisible: this.props.followVisible
    }
  }

  componentDidMount () {
    // this.props.resetFollowModal()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.followVisible) {
      this.setState({
        followVisible: nextProps.followVisible
      })
    }
  }

  resetFollowModal () {
    this.setState({followVisible: false})

    setTimeout(() => {
      this.props.openFollow(false, null)
    }, 500)
  }

  render () {
    return (
      <Modal
        animationType={'slide'}
        transparent
        visible={this.state.followVisible}>
        <View style={styles2.containerStyle}>
          <View style={{backgroundColor: 'white', flex: 1, marginTop: 151, borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
            <View style={{flexDirection: 'row', height: 42.5, marginRight: 4.5, marginLeft: 4.5, borderBottomWidth: 0.5, borderBottomColor: 'rgb(204, 204, 204)'}}>
              <TouchableOpacity
                onPress={() => {
                  this.resetFollowModal()
                }}
                style={{paddingTop: 10, paddingLeft: 16}} >
                <Icon
                  name='chevron-down'
                  size={16}
                  style={{width: 16, height: 16, alignSelf: 'center', fontWeight: '300'}} />
              </TouchableOpacity>
              <Text style={{left: 140, marginTop: 10, fontSize: 17, fontWeight: 'bold'}} >{this.props.showType}</Text>
            </View>
            <FollowList
              follows={this.props.follows}
              postFollow={this.props.postFollow}
              deleteFollow={this.props.deleteFollow} />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles2 = {
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  }
}

export default FollowModal
