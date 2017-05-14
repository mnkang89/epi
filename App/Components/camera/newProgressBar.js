import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Easing,
  Animated,
  Dimensions
} from 'react-native'

const windowSize = Dimensions.get('window')

export default class newProgressBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      // progress: new Animated.Value(this.props.initialProgress || 0)
      progress: 0
    }
    this.progress = new Animated.Value(0)
    this.props.style = styles
    this.props.easing = Easing.linear(Easing.ease)
  }

  // componentDidUpdate (prevProps, prevState) {
  //   if (this.props.progress >= 0 && this.props.progress !== prevProps.progress) {
  //     this.update()
  //   }
  // }

  render () {
    console.log('영상 프로그래싱')
    const fillWidth = this.progress

    return (
      <View style={[styles.background, this.props.backgroundStyle, this.props.style]}>
        <Animated.View style={[styles.fill, this.props.fillStyle, { width: fillWidth }]} />
      </View>
    )
  }

  init () {
    this.progress.setValue(0)
  }

  start () {
    // const fill = windowSize.width / 150
    // console.log(fill)
    Animated.timing(this.progress, {
      easing: Easing.linear(),
      duration: 5000,
      toValue: windowSize.width
    }).start()
    // if (this.progress <= windowSize.width) {
    //   this.setState({ progress: this.state.progress + fill })
    // }
  }

  stop () {
    this.progress.stopAnimation()
  }

  // update () {
  //   Animated.timing(this.state.progress, {
  //     // easing: this.props.easing,
  //     duration: this.props.easingDuration,
  //     toValue: this.props.progress / 100
  //   }).start()
  // }
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

// 구 프로그래스바
// import React, { Component } from 'react'
// import {
//   StyleSheet,
//   View,
//   Animated,
//   Easing
// } from 'react-native'
//
// export default class ProgressBar extends Component {
//   constructor (props) {
//     super(props)
//
//     this.state = {
//       progress: new Animated.Value(this.props.initialProgress || 0)
//     }
//
//     this.props.style = styles
//     this.props.easing = Easing.linear(Easing.ease)
//     this.props.easingDuration = 500
//   }
//
//   componentDidUpdate (prevProps, prevState) {
//     if (this.props.progress >= 0 && this.props.progress !== prevProps.progress) {
//       this.update()
//     }
//   }
//
//   render () {
//     console.log('영상 프로그래싱')
//     const fillWidth = this.state.progress
//
//     return (
//       <View style={[styles.background, this.props.backgroundStyle, this.props.style]}>
//         <Animated.View style={[styles.fill, this.props.fillStyle, { width: fillWidth }]} />
//       </View>
//     )
//   }
//
//   update () {
//     Animated.timing(this.state.progress, {
//       // easing: this.props.easing,
//       duration: this.props.easingDuration,
//       toValue: this.props.progress / 100
//     }).start()
//   }
// }
//
// const styles = StyleSheet.create({
//   background: {
//     backgroundColor: '#bbbbbb',
//     height: 4,
//     overflow: 'hidden'
//   },
//   fill: {
//     backgroundColor: 'black',
//     height: 4
//   }
// })
