//롱프레스 원래 구현방식
<TouchableWithoutFeedback
  onPress={this.onDoublePress.bind(this)}
  onPressIn={()=>{
    this.setState({pressIn: new Date().getTime()});
    console.log('눌렀다옹');
  }}
  onPressOut={()=>{this.onLongPress()}} >

onLongPress() {
  console.log('클릭 뗏따옹~')
  const delta = new Date().getTime() - this.state.pressIn
  console.log(delta);
  if(delta > 1000 ) {
  console.log('롱프레스 발생~')
  NavigationActions.commentScreen({type: 'reset'})
  }
}



//댓글부분
<View style={[styles.mainContainer, {marginBottom: this.state.visibleHeight}]}>

  <View style={{flex:8, backgroundColor: 'black'}}>
    <CommentList />
  </View>

  <View style={{flexDirection:'row', flex:1}}>
    <View style={styles2.textContainer}>
      <TextInput
        placeholder="댓글 쓰기.."
        style={styles2.input}/>
    </View>
    <View style={styles2.sendContainer}>
      <TouchableHighlight
        underlayColor={'#4e4273'}
        >
        <Text style={styles2.sendButton}>게시</Text>
      </TouchableHighlight>
    </View>
  </View>

  <View style={{height: 40}}></View>

</View>
