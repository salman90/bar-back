import React, { Component } from 'react';
import {View, Text, Image  } from 'react-native';
import { Avatar, Button, Icon } from 'react-native-elements';
import firebase from 'firebase'

class ProfileUser extends Component{
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }
  componentDidMount(){
    const userUid = this.props.navigation.state.params.userUid
    firebase.database().ref('users').child(userUid).on('value', snapshot => {
      this.setState({user: snapshot.val() })
    })
  }
  render(){
    if(!this.state.user) {
      return <Text>Loading</Text>
    }
    console.log(this.state.user);
    return(
      <View
       style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
      >
        <View>
        <Avatar
         width={200}
         rounded
         size="xlarge"
         onPress={this.uploadImage}
         source={{uri: this.state.user.profileImage}}
        />
        </View>
      </View>
    )
  }
}

export default ProfileUser
