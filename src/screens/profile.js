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
// import { Image, CacheManager } from "react-native-expo-image-cache";
import firebase from 'firebase';
import { Avatar, Button, Icon } from 'react-native-elements';
import { Image, CacheManager } from 'react-native-expo-image-cache';
import { FileSystem } from 'expo';
import CacheImage from '../components/chacheImage';
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
      this.setState({ localUri: localUri });
      let image =  await this.UploadImageToStorage(localUri, userUid)
      const path = await CacheManager.get(image).getPath();
      firebase.database().ref('users').child(userUid).update({ profileImage: image })
    }
  }

  UploadImageToStorage = async (uri, userUid) => {

    const respones = await fetch(uri)
    const blob = await respones.blob()
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
    console.log('in sign out')
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
    // console.log(this.props.)
    const {user, userInfo} = this.state
    const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
    console.log(user)
    // const {user, userInfo} = this.state
    // console.log(this.state.user)
    if(!this.state.user) {
      return(
        <View
         style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
        >
          <ActivityIndicator
           size='large'
           color="#0000ff"
          />
        </View>
      )
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
         <TouchableWithoutFeedback
          onPress={this.uploadImage}
         >
           <View
            style={{ flexDirection: 'column', marginBottom: 10, flex:1 }}
           >
           <Image
              style={{ width: 200, height: 200, borderRadius: 200/2 }}
              {...{preview, uri: user.profileImage}}
             />
           </View>
        </TouchableWithoutFeedback>
           <View
            style={{ flexDirection: 'column', marginBottom: 10}}
           >
            <View
             style={{alignItems: 'center', justifyContent: 'center'}}
            >
              <Text
              style={{ fontSize: 20, letterSpacing: 2, marginTop: 10, color: '#fff' }}
              >First Name</Text>
           </View>
             <TextInput
             style={styles.inputStyle}
             onChangeText={(text) => this.onFirstNameChange(text)}
             value={this.state.user.firstName}
             autoCapitalize='none'
             autoCorrect={false}
             underlineColorAndroid='rgba(0,0,0,0)'
             placeholder='First Name'
             placeholderTextColor='#fff'
             />
          </View>
          <View
           style={{ flexDirection: 'column', marginBottom: 10}}
          >
            <View
             style={{alignItems: 'center', justifyContent: 'center'}}
            >
              <Text
               style={{ fontSize: 20, letterSpacing: 2, marginTop: 10, color: '#fff' }}
              >Last Name</Text>
            </View>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => this.onLastNameChange(text)}
              value={this.state.user.lastName}
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder='Last Name'
              placeholderTextColor='#fff'
            />
          </View>
          <View>
          <Button
           title='create a cocktail'
           buttonStyle={{ marginTop: 8, borderRadius: 10 , backgroundColor: 'turquoise', marginTop: 8, width: 200}}
           onPress={this.createCocktail.bind(this)}
          />
            <Button
              title='View  List'
              buttonStyle={{ marginTop: 8, borderRadius: 10 , backgroundColor: '#3B5998', width: 200, marginTop: 8}}
              onPress={() => this.props.navigation.navigate('userPersonalList', {user: this.state.userInfo})}
            />

           <Button
           title='logout'
           buttonStyle={{ marginTop: 8, borderRadius: 10 , backgroundColor: '#3B5998', width: 200}}
           onPress={this.logOut.bind(this)}
           />
           </View>
          </View>
       </ScrollView>
    </View>
    )
  }
}

const styles = {
  mainContainer: {
    flex:1,
    backgroundColor: 'teal'
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
     borderColor: '#fff',
     color: '#fff',
   },
   image: {
    height: 200,
    width: 200,
    borderRadius: 8,
  },
}

export default Profile;
