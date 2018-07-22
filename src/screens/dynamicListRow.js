import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';


class DynamicListRow extends Component {
  _defaultTransition  = 250;
  // _defaultHeightValue = 60;

  state = {
    // _rowHeight: new Animated.Value(this._defaultHeightValue)
    _rowOpacity: new Animated.Value(0)
  }

  componentWillMount(){
    console.log('in animated function ')
    Animated.timing(this.state.animatedValue, {
      toValue: 1,
      duration: 500,
    }).start()
  }

  render() {
    const opacity = {
      opacity: this.state.animatedValue
    }
    return (
      <Animated.View
       style={{opacity: this.state._rowOpacity}}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}


export default DynamicListRow;
