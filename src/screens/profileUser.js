import React, { Component } from 'react';
import {View, Text, Image  } from 'react-native';
import firebase from 'firebase'

class ProfileUser extends Component{
  componentDidMount(){
    const userUid = this.props.navigation.state.params.userUid
    firebase.database().ref('users').child(userUid).once('value', snap => {
     const userInfo = snap.val()
     console.log(userInfo)
    })
  }
  render(){
    return(
      <View
       style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
      >
        <View>

        </View>
      </View>
    )
  }
}

export default ProfileUser
