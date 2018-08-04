import React, { Component } from 'react';
import {View, Text, Image, ActivityIndicator  } from 'react-native';
import firebase from 'firebase'

class ProfileUser extends Component{
  state = {
    user: null
  }
  componentDidMount(){
    const userUid = this.props.navigation.state.params.userUid
    firebase.database().ref('users').child(userUid).once('value', snap => {
     const userInfo = snap.val()
    this.setState({ user: userInfo})
     console.log(userInfo)
    })
  }
  render(){
    const { user } = this.state
    if(user === null ){
      <View
       style={{ alignItems: 'center', justifyContent: 'center', flex: 1}}
      >
        <ActivityIndicator
         size='large'
         color="#0000ff"
        />
      </View>
    }
    return(
      <View
       style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
      >
        <View>
          <Text>{}</Text>
        </View>
      </View>
    )
  }
}

export default ProfileUser
