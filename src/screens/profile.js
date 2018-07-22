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
// import { createBottomTabNavigator } from 'react-navigation';

const {height, width} = Dimensions.get('window');


class Profile extends Component {

  static navigationOptions = props => {
  const { navigation } = props;
  const { navigate } = navigation;
  return {
    headerMode: 'none',
    headerVisible: false,
    tabBarIcon: ({ tintColor }) =>(
      <Icon
        name='user-circle'
        type='font-awesome'
        size={20}
      />
    ),
  }
}

  state = {
    user: null,
    isVisible: false,
    title: '',
    description: '',
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

  createCocktail(){
    // const {user, title, description, } =  this.state
    // firebase.database().ref('cocktail_list').push({
    //   name: title,
    //   description: description,
    //   user: user
    // })
  }

  renderFormModal(){
    return (
      <Modal
      visible={this.state.isVisible}
      transparent={true}
      >
      <TouchableWithoutFeedback
        onPress={this.onCloseModalPress.bind(this)}
      >
       <View
         style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
       >
        <View
         style={{ width: width * 0.90, height: height * 0.5, backgroundColor: 'red',
         borderRadius: 5 }}
        >
          <View
           style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}
          >
             <Text>Cocktail Title</Text>
          </View>
          <View>
             <TextInput
              autoCapitalize='none'
              autoCorrect={false}
               style={{ width: '90%', height: 50, borderWidth: 2, marginLeft: 14,
               borderColor: 'gray', marginTop: 8, borderRadius: 8  }}
               onChangeText={(text) => this.setState({ title: text})}
               value={this.state.title}
             />
          </View>
          <View
            style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10}}
          >
             <Text>Ingredients</Text>
          </View>
          <View>
          <TextInput
            multiline={true}
            autoCapitalize='none'
            autoCorrect={false}
            style={{ width: '90%', height: 70, borderWidth: 2, marginLeft: 14,
            borderColor: 'gray', marginTop: 8, marginBottom: 10, borderRadius: 8 }}
            onChangeText={(text) => this.setState({ description: text}) }
            value={this.state.description}
          />
          </View>
          <View
           style={{alignItems: 'center', justifyContent: 'center'}}
          >
          <TouchableWithoutFeedback
           onPress={this.uploadCoctailImage.bind(this)}
          >
            <View
             style={{width: '50%', height: 50, backgroundColor: 'gray', flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop: 10}}
            >
             <Text>Upload Image</Text>
             <Icon
             name='upload'
             size={20}
             type='font-awesome'
             containerStyle={{marginLeft: 8}}
             />
            </View>

          </TouchableWithoutFeedback>
          <View
           style={{ marginTop: 10}}
          >
            <Button
              title='Submit Cocktail'
              onPress={this.createCocktail.bind(this)}
            />
          </View>
          </View>
        </View>
      </View>
       </TouchableWithoutFeedback>
    </Modal>
    )
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
            style={{ flexDirection: 'column', marginBottom: 10}}
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
             />
          </View>
          <View
           style={{ flexDirection: 'column', marginBottom: 10}}
          >
           <View
            style={{alignItems: 'center', justifyContent: 'center'}}
           >
            <Text>Last Name</Text>
           </View>
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
       {this.renderFormModal()}
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
