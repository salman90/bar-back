import React, { Component } from 'react';
import  {View, Text } from 'react-native';
// import { createBottomTabNavigator } from 'react-navigation';


class Profile extends Component {
  render(){
    return(
      <View
       style={{ alignItems: 'center', justifyContent: 'center', flex: 1}}
      >
       <Text>Profile</Text>
      </View>
    )
  }
}

export default Profile;
