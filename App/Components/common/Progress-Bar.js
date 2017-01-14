import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Easing
} from 'react-native'

export default class ProgressBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      progress: new Animated.Value(this.props.initialProgress || 0)
    }

    this.props.style = styles
    this.props.easing = Easing.linear(Easing.ease)
    this.props.easingDuration = 500
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.progress >= 0 && this.props.progress !== prevProps.progress) {
      this.update()
    }
  }

  render () {
    const fillWidth = this.state.progress

    return (
      <View style={[styles.background, this.props.backgroundStyle, this.props.style]}>
        <Animated.View style={[styles.fill, this.props.fillStyle, { width: fillWidth }]} />
      </View>
    )
  }

  update () {
    Animated.timing(this.state.progress, {
      easing: this.props.easing,
      duration: this.props.easingDuration,
      toValue: this.props.progress / 100
    }).start()
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#bbbbbb',
    height: 4,
    overflow: 'hidden'
  },
  fill: {
    backgroundColor: 'black',
    height: 4
  }
})
