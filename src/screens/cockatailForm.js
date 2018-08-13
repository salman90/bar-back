import React,{ Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
 Dimensions,
 ScrollView,
 ListView,
 KeyboardAvoidingView,
 } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Button, Icon, Avatar } from 'react-native-elements'
import firebase from 'firebase'
const {height, width} = Dimensions.get('window');

class CockatailForm extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (<Icon type='font-awesome' name='arrow-circle-left'
    containerStyle={{ paddingLeft: 15 }} color='#000' onPress={() => navigation.goBack()} />),
    }
  }
  state = {
    name: '',
    user: null,
    image: 'https://firebasestorage.googleapis.com/v0/b/bar-back-c3947.appspot.com/o/images%2Fdefault.jpg?alt=media&token=2c51fbb0-9f67-41ed-9110-ccb778065394',
    ingredients: '',
    steps: '',
    loading: false,
    valueArray: [],
    disabled: false,
    index: 0,
    dataSource: new ListView.DataSource({
              rowHasChanged: (row1, row2) => row1 != row2
          }),
    data: [],
    stepsDataSource: new ListView.DataSource({
              rowHasChanged: (row1, row2) => row1 != row2
          }),
     dataForSteps: [],
     stepsCounter: 1,
     profileInfo: null,

  }

  componentDidMount() {
    const { data, dataForSteps } = this.state
<<<<<<< HEAD
    // const name = {
    //   name: 'mahmoud'
    // }
=======
    const name = {
      name: 'mahmoud'
    }
>>>>>>> bfd8636abeb216637b16fb96d9208242ba90db68
    data.push(name)
    dataForSteps.push(name)
    const user = firebase.auth().currentUser
    const userUid = user.uid
    this.setState({
      user: user,
    })
    firebase.database().ref('users').child(userUid).once('value', snap =>{
      const profileInfo = snap.val()
      this.setState({profileInfo: profileInfo })
    })
   }
   uploadCoctailImage = async () =>{
     this.setState({ loading: true})
     await this.askPermissionsAsync();
     let result = await ImagePicker.launchImageLibraryAsync({
       allowsEditing: true,
       aspect: [4, 3],
     });
      if(!result.cancelled){
        let localUri = result.uri
        let image =  await this.UploadImageToStorage(localUri)
        this.setState({ image: image, loading: false })
      }else{
        this.setState({ loading: false })
      }
   }

   UploadImageToStorage = async  (uri) => {
     const respones = await fetch(uri)
     const blob = await respones.blob()
     const userUid = this.state.user.uid

     let ref =  firebase.storage().ref('images').child(userUid).child('cocktailImage')
     const uploadTask = await ref.put(blob);
     const downloadUrl = await ref.getDownloadURL()
     return  downloadUrl
   }

   askPermissionsAsync = async () => {
     await Permissions.askAsync(Permissions.CAMERA_ROLL);

   };

   createForm = async () => {
     const { user, image, ingredients, steps, name, profileInfo } = this.state
     this.setState({ loading: true })
     const userUid = user.uid
     const userName = `${profileInfo.firstName} ${profileInfo.lastName}`
     const userImage = `${profileInfo.profileImage}`
     const saveDataToUserList = await firebase.database().ref('user_cocktails').child(userUid).push({
       name: name,
       ingredients: ingredients,
       steps: steps,
       uid: userUid,
       image: image,
       userName: userName,
       userImage: userImage,
       numberOfLikes: 0,
     }, (error) =>{
       if(error){
         alert("Data could not be saved" + error)
       }else{
         alert('Data was saved successfully')
       }
     })
     const saveDataToMainList = await firebase.database().ref('cocktail_list').push({
       name: name,
       ingredients: ingredients,
       steps: steps,
       uid: userUid,
       image: image,
       userName: userName,
       userImage: userImage,
       numberOfLikes: 0,
     })
     this.setState({ loading: false,
                    image:  'https://firebasestorage.googleapis.com/v0/b/bar-back-c3947.appspot.com/o/images%2Fdefault.jpg?alt=media&token=2c51fbb0-9f67-41ed-9110-ccb778065394',
                    steps: '',
                    ingredients: '',
                    name: ''
                                  })
   }


   onRenderTextIngredient = (text) => {

   }
  render(){
    if(this.state.loading){
      return (
        <View
         style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
        >
        <ActivityIndicator />
        </View>
      )
    }
    return(
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="padding"
      >

    <ScrollView
    contentContainerStyle={{paddingVertical: 50, flex: 1 }}
    >
      <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
      >
       <View
        style={{flexDirection: 'column'}}
       >
         <View
          style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}
         >
           <Text>Cocktail Name</Text>
         </View>
         <View>
           <TextInput
          autoCapitalize='none'
          autoCorrect={false}
           style={{ width: 250 , height: 50, borderWidth: 2, marginLeft: 14,
           borderColor: 'gray', marginTop: 8, borderRadius: 8  }}
           onChangeText={(text) => this.setState({ name: text})}
           value={this.state.name}
           />
         </View>
       </View>
       <View
        style={{flexDirection: 'column'}}
       >
         <View
          style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}
         >
            <Text>Ingredients</Text>
         </View>
         <View>
           <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            multiline={true}
            style={{width: 250, height: 50, borderWidth: 2, marginLeft: 14,
            borderColor: 'gray', marginTop: 8, borderRadius: 8}}
            onChangeText={(text) => this.setState({ ingredients: text})}
            value={this.state.ingredients}
            />
         </View>
       </View>
       <View
        style={{flexDirection: 'column'}}
       >
         <View
          style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}
         >
            <Text>Steps</Text>
         </View>
         <View>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            multiline={true}
            style={{width: 250, height: 50, borderWidth: 2, marginLeft: 14,
            borderColor: 'gray', marginTop: 8, borderRadius: 8}}
            onChangeText={(text) => this.setState({ steps: text})}
            value={this.state.steps}
            />
         </View>
       </View>
       <TouchableWithoutFeedback
         onPress={this.uploadCoctailImage.bind(this)}
        >
          <View
           style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 10 }}
          >
            <Text>Upload Image</Text>
            <Icon
            name='upload'
            size={20}
            type='font-awesome'
            containerStyle={{marginLeft: 8}}
            />
              <Avatar
              width={100}
               size="xlarge"
               onPress={this.uploadImage}
               source={{uri: this.state.image}}
               containerStyle={{ marginLeft: 10, borderRadius: 8}}
              />
            </View>
          </TouchableWithoutFeedback>
          <View
           style={{ marginTop: 10}}
          >
            <Button
              title='Submit Cocktail'
              onPress={this.createForm.bind(this)}
            />
          </View>
      </View>
  </ScrollView>
  </KeyboardAvoidingView>
    )
  }
}



export default CockatailForm
