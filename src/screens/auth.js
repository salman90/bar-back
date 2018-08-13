import React, { Component } from 'react';
import {View, Text, TextInput, Dimensions, KeyboardAvoidingView, ActivityIndicator  } from 'react-native';
import { Input, Card, Icon, Button } from 'react-native-elements';
import * as firebase from "firebase";

const {height, width} = Dimensions.get('window');

class Auth extends Component {

  componentWillMount(){
    firebase.auth().onAuthStateChanged(userAuth => {
      if(userAuth){
        this.props.navigation.navigate('profile')
      }
    })
  }
 state = {
   email: '',
   password: '',
   loading: false
 }

  onEmailChange = (text) =>  {
    this.setState({ email: text })
  }

  onPasswordChange = (text) => {
    this.setState({ password: text })
  }

   signInUser = async () => {
    this.setState({ loading: true })
    const { email, password } = this.state
    firebase.auth().signInWithEmailAndPassword(email, password)
     .then(() => {
       this.setState({ error: '', loading: false });
       this.props.navigation.navigate('cocktailList')
    })
     .catch(() => {
       firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          this.setState({error: '' ,loading: false})
          this.props.navigation.navigate('cocktailList')
          this.createUserInDatabase(email, password)
        })
        .catch((error) => {
          this.setState({error: '' ,loading: false})
          let errorCode = error.code;
              let errorMessage = error.message;
              if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
              } else {
                alert(errorMessage);
              }
        })
     })
  }

  createUserInDatabase = (email, password) => {
    const defaults = {
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      profileImage:'https://firebasestorage.googleapis.com/v0/b/bar-back-c3947.appspot.com/o/images%2FdefaultProfile.png?alt=media&token=71909f25-454a-4f80-b38e-74cd56320e30',
      email: email,

    }
    const user = firebase.auth().currentUser;
    const userUid = user.uid
    firebase.database().ref('users').child(userUid).update({
      ...defaults
    })
  }

  render(){
    if(this.state.loading){
      return (
        <View
         style={styles.container}
        >
        <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }else{
      return(
        <KeyboardAvoidingView
           style={{flex: 1}}
           behavior="padding"
        >
        <View
         style={styles.container}
        >
          <View
           style={styles.emailContainer}
          >
            <Icon
             name='user'
             type='font-awesome'
             containerStyle={{ padding: 10}}
            />
            <TextInput
             style={styles.input}
             placeholder='Email'
             autoCorrect={false}
             onChangeText={(text) => this.onEmailChange(text)}
             autoCapitalize='none'
             underlineColorAndroid='rgba(0,0,0,0)'
            />

          </View>
          <View
            style={styles.passwordContianer}
          >
            <Icon
            name= 'unlock'
            type='font-awesome'
            containerStyle={{ padding: 10}}
            />
            <TextInput
             style={styles.input}
             placeholder='password'
             autoCorrect={false}
             secureTextEntry={true}
             onChangeText={(text) => this.onPasswordChange(text)}
             underlineColorAndroid='rgba(0,0,0,0)'
            />
          </View>
          <View
          style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10}}
          >
             <Button
              buttonStyle={{ width: 250, borderRadius: 10, backgroundColor: '#A9A9A9'}}
              title='Sign Up'
              onPress={this.signInUser}
             />
          </View>
        </View>
      </KeyboardAvoidingView>
      )
    }
  }
}

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'teal',
  },emailContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },passwordContianer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  }, input: {
     flex: 1,
     paddingTop: 10,
     marginRight: 10,
     paddingBottom: 10,
     paddingLeft:0 ,
     borderBottomWidth: 2,
     borderColor: 'gray',
  },
}


export default Auth
