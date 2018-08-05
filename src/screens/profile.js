import React, { Component } from 'react';
import  {
  View,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  Picker,
  ActivityIndicator,
  Modal,
TouchableWithoutFeedback} from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import firebase from 'firebase';
import { Avatar, Button, Icon } from 'react-native-elements';
import { Image } from 'react-native-expo-image-cache';
import { FileSystem } from 'expo';

// import { createBottomTabNavigator } from 'react-navigation';

const {height, width} = Dimensions.get('window');


class Profile extends Component {
  state = {
    user: null,
    isVisible: false,
    title: '',
    description: '',
    localUri: '',
  }

  componentWillMount() {
    const userInfo = firebase.auth().currentUser;
    const userUid = userInfo.uid

    this.setState({ userInfo: userInfo })
     // console.log(this.state.user)
    firebase.database().ref('users').child(userUid).on('value', snapshot => {
      const user =  snapshot.val()
      this.setState({ user: user })
    })

  }

  onFirstNameChange = (text) =>  {
    const { userInfo } = this.state
    const userUid = userInfo.uid

    // const userUid = user.uid
    firebase.database().ref('users').child(userUid).update({
      firstName: text
    })
  }

  onLastNameChange = (text) => {
    const { userInfo } = this.state
    const userUid = userInfo.uid

    firebase.database().ref('users').child(userUid).update({
      lastName: text
    })

  }

  askPermissionsAsync = async () => {
    // await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

  };

  uploadImage = async () => {
    const { userInfo } = this.state
    const userUid = userInfo.uid

    await this.askPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    // console.log(result)
    if(!result.cancelled) {
      let localUri = result.uri
      this.setState({ localUri: localUri })

      // console.log(this.state.localUri)
      // let filename = localUri.split('/').pop();
      // let match = /\.(\w+)$/.exec(result.uri.split('/').pop());
      // let type = match ? `image/${match[1]}` : `image`;
      let image =  await this.UploadImageToStorage(localUri, userUid)
      firebase.database().ref('users').child(userUid).update({ profileImage: image })
    }
  }

  UploadImageToStorage = async (uri, userUid) => {
    // const user = firebase.auth().currentUser
    // const userUid = user.uid
    // console.log(uri)

    const respones = await fetch(uri)
    const blob = await respones.blob()
    console.log(blob)
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    let metadata = {
    contentType: `image/${fileType}`,
    }


    let ref =  firebase.storage().ref('images').child(userUid).child('mainImage')
       const uploadTask = await ref.put(blob, metadata);
       const downloadUrl = await ref.getDownloadURL()
       return downloadUrl
  }

  _onFormButtonPress(){
    this.props.navigation.navigate('cockatailForm')
  }

  onCloseModalPress(){
    this.setState({ isVisible: false })
  }


  uploadCoctailImage(){
    console.log('Upload Coctail Image you bitch')
  }



  SignOut = (callback) => {
    firebase.auth().signOut()
    callback()
  }

  logOut(){
    this.SignOut(() => {
      this.props.navigation.navigate('auth')
    })
  }

  createCocktail() {
    this.props.navigation.navigate('cockatailForm')
  }


  render(){
    const {user, userInfo} = this.state
    if(!this.state.user) {
      return <Text>Loading</Text>
    }
    return(
    <View
     style={styles.mainContainer}
    >

       <ScrollView
        contentContainerStyle={styles.scrollViewStyle}
       >
         <View
         style={styles.elementsViewStyle}
         >
           <View
            style={{ flexDirection: 'column', marginBottom: 10, flex:1 }}
           >
             <Avatar
              width={200}
              rounded
              size="xlarge"
              onPress={this.uploadImage}
              source={{uri: this.state.user.profileImage}}
             />
           </View>
           <View
            style={{ flexDirection: 'column', marginBottom: 10}}
           >
            <Text>First Name</Text>
             <TextInput
             style={styles.inputStyle}
             onChangeText={(text) => this.onFirstNameChange(text)}
             value={this.state.user.firstName}
             autoCapitalize='none'
             autoCorrect={false}
             underlineColorAndroid='rgba(0,0,0,0)'
             />
          </View>
          <View
           style={{ flexDirection: 'column', marginBottom: 10}}
          >
            <Text>Last Name</Text>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => this.onLastNameChange(text)}
              value={this.state.user.lastName}
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
          </View>
          <View>
            <Button
              title='View  List'
              buttonStyle={{ borderRadius: 10 , backgroundColor: '#3B5998'}}
              onPress={() => this.props.navigation.navigate('userPersonalList', {user: this.state.userInfo})}
            />
          </View>
          <View
           style={{ marginTop: 10 }}
          >
           <Button
           title='logout'
           buttonStyle={{ borderRadius: 10 , backgroundColor: '#3B5998'}}
           onPress={this.logOut.bind(this)}
           />
          </View>
          <Button
           title='create a cocktail'
           buttonStyle={{ borderRadius: 10 , backgroundColor: '#3B5998', marginTop: 10}}
           onPress={this.createCocktail.bind(this)}
          />
        </View>
       </ScrollView>
    </View>
    )
  }
}

const styles = {
  mainContainer: {
    flex:1
  },
   scrollViewStyle: {
     flexGrow : 1,
     justifyContent : 'center'
   },
    elementsViewStyle: {
      alignItems: 'center',
      justifyContent: 'center',
    },
   inputStyle: {
      width: width * 0.75,
     borderBottomWidth: 2,
     borderColor: 'gray',
   }
}

export default Profile;
