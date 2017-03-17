import React, { Component, PropTypes } from 'react'
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  PanResponder
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import FollowContainer from '../../Containers/common/FollowContainer'

// 부모 컴포넌트로부터 내려받는 props의 경우 간혹 undefined문제가 발생하고 있음. 데이터 fetching이 되기전에 컴포넌트가 마운트되서 생기는 문제로
// 현재는 ? 연산을 통해 undefined일 경우, default값을 주는 방식으로 진행중

class FollowModal extends Component {

  static propTypes = {
    token: PropTypes.string,
    screen: PropTypes.string,

    showType: PropTypes.string,
    followVisible: PropTypes.bool,
    follows: PropTypes.array,

    openFollow: PropTypes.func,
    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func,
    pushHandler: PropTypes.func,
    popHandler: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      // follows: this.props.follows === undefined ? [] : this.props.follows,
      text: '',
      height: 5,
      inputBottom: 40,
      followVisible: this.props.followVisible === undefined ? false : this.props.followVisible,
      followContainerRender: false
    }

    this.animatedValue = new Animated.Value(600)
    this._wrapperPanResponder = {}
  }

  componentWillMount () {
    this._wrapperPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, g) => {
        return true
      },
      onPanResponderGrant: () => {
        console.log('팬리스폰더 뷰 그랜트')
        this.resetFollowModal()
      }
    })
  }

  componentDidMount () {
    // this.props.resetFollowModal()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.followVisible) {
      this.setState({
        followVisible: nextProps.followVisible
      }, () => {
        Animated.timing(this.animatedValue, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.quad),
          delay: 0
        }).start()
        setTimeout(() => {
          this.setState({followContainerRender: true})
        }, 500)
      })
    }
  }

  resetFollowModal () {
    Animated.timing(this.animatedValue, {
      toValue: 600,
      duration: 250,
      delay: 0
    }).start()

    setTimeout(() => {
      this.setState({
        followVisible: false,
        followContainerRender: false
      })
      this.props.openFollow(false, null)
    }, 250)
  }

  renderFollowContainer () {
    if (this.state.followContainerRender) {
      return (
        <FollowContainer
          screen={this.props.screen}
          resetFollowModal={this.resetFollowModal.bind(this)}
          pushHandler={this.props.pushHandler}
          popHandler={this.props.popHandler} />
      )
    } else {
      return (
        <View style={{flex: 1}} />
      )
    }
  }

  render () {
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={this.state.followVisible}>
        <View style={styles2.containerStyle}>
          <View
            style={{flex: 18}}
            {...this._wrapperPanResponder.panHandlers} />
          <Animated.View style={{transform: [{translateY: this.animatedValue}], backgroundColor: 'white', flex: 82, borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
            <View style={{flexDirection: 'row', height: 42.5, marginRight: 4.5, marginLeft: 4.5, borderBottomWidth: 0.5, borderBottomColor: 'rgb(204, 204, 204)'}}>
              <TouchableOpacity
                onPress={() => {
                  this.resetFollowModal()
                }}
                style={{flex: 1, paddingTop: 10}} >
                <Icon
                  name='chevron-down'
                  size={16}
                  style={{width: 16, height: 16, alignSelf: 'center', fontWeight: '300'}} />
              </TouchableOpacity>
              <View style={{flex: 10, alignItems: 'center'}}>
                <Text style={{marginTop: 10, fontSize: 17, fontWeight: 'bold'}} >
                  {this.props.showType === undefined ? '' : this.props.showType}
                </Text>
              </View>
              <View style={{flex: 1}} />
            </View>
            {this.renderFollowContainer()}
          </Animated.View>
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
