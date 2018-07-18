import React, { Component } from 'react';
import  {
  View,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  Picker,
  ActivityIndicator} from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import firebase from 'firebase';
import { Avatar } from 'react-native-elements';
// import { createBottomTabNavigator } from 'react-navigation';

const {height, width} = Dimensions.get('window');


class Profile extends Component {
  state = {
    user: null
  }

  componentWillMount() {
    const user = firebase.auth().currentUser;
    const userUid = user.uid
    firebase.database().ref('users').child(userUid).on('value', snapshot => {
      const userInfo =  snapshot.val()
      this.setState({ user: userInfo })
    })
  }

  onFirstNameChange = (text) =>  {
    // console.log(text)
    const user = firebase.auth().currentUser
    const userUid = user.uid
    firebase.database().ref('users').child(userUid).update({
      firstName: text
    })
  }

  onLastNameChange = (text) => {
    const user = firebase.auth().currentUser
    const userUid = user.uid
    firebase.database().ref('users').child(userUid).update({
      lastName: text
    })

  }

  askPermissionsAsync = async () => {
    // await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

  };

  uploadImage = async () => {
    const user = firebase.auth().currentUser
    const userUid = user.uid

    await this.askPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    // console.log(result)
    if(!result.cancelled) {
      let localUri = result.uri
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(result.uri.split('/').pop());
      // let type = match ? `image/${match[1]}` : `image`;
      let image =  await this.UploadImageToStorage(localUri, userUid)
      firebase.database().ref('users').child(userUid).update({ profileImage: image })
    }
  }

  UploadImageToStorage = async (uri, userUid) => {
    // const user = firebase.auth().currentUser
    // const userUid = user.uid

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


  render(){
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
            style={{ flexDirection: 'column', marginBottom: 10}}
           >
             <Avatar
             width={200}
              size="xlarge"
              onPress={this.uploadImage}
              source={{uri:this.state.user.profileImage}}
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
            />
          </View>
          <View
           style={{ flexDirection: 'column', marginBottom: 10}}
          >

          </View>
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
