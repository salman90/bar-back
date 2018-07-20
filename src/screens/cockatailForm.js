import React, { Component } from 'react';
import {View, Text, TextInput, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Button, Icon } from 'react-native-elements'
import firebase from 'firebase'


class CockatailForm extends Component {
  state = {
    name: '',
    user: null,
    image: null,
    ingredients: '',
    steps: '',
    loading: false,
  }

  static navigationOptions = props => {
  const { navigation } = props;
  const { navigate } = navigation;
  return {

    tabBarVisible: false,
  }
}
  componentWillMount() {
    const user = firebase.auth().currentUser
    this.setState({ user: user})
    const userUid = user.uid
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
      }
   }

   UploadImageToStorage = async  (uri) => {
     const respones = await fetch(uri)
     const blob = await respones.blob()
     // let fileType = uriParts[uriParts.length - 1];
     // let metadata = {
     // contentType: `image/${fileType}`,
     // }
     const userUid = this.state.user.uid

     let ref =  firebase.storage().ref('images').child(userUid).child('cocktailImage')
     const uploadTask = await ref.put(blob);
     const downloadUrl = await ref.getDownloadURL()
     return  downloadUrl
   }

   askPermissionsAsync = async () => {
     // await Permissions.askAsync(Permissions.CAMERA);
     await Permissions.askAsync(Permissions.CAMERA_ROLL);

   };

   createForm = async () => {
     this.setState({ loading: true })
     const { user, image, ingredients, steps, name } = this.state
     const userUid = user.uid
     const savedata = await firebase.database().ref('user_cocktails').push({
       name: name,
       ingredients: ingredients,
       steps: steps,
       uid: userUid,
       image: image,
     })
     this.setState({ loading: false })
   }

  render(){
    console.log(this.state.ingredients, 'ingredients')
    console.log(this.state.name, 'name')
    console.log(this.state.steps, 'steps')
    console.log(this.state.image, 'image')
    console.log(this.state.loading)
    if(this.state.loading){
      return (
        <View
         style={{alignItems: 'center', justifyContent: 'center'}}
        >
        <ActivityIndicator />
        </View>
      )
    }
    return(
      <View
       style={{ flex: 1, flexDirection: 'column'}}
      >
       <View
        style={{ alignItems: 'center', justifyContent: 'center'}}
       >
         <Text>Cocktail Name</Text>
      </View>
      <View>
          <TextInput
           autoCapitalize='none'
           autoCorrect={false}
            style={{ width: '90%', height: 50, borderWidth: 2, marginLeft: 14,
            borderColor: 'gray', marginTop: 8, borderRadius: 8  }}
            onChangeText={(text) => this.setState({ name: text})}
            value={this.state.name}
          />
       </View>
       <View
        style={{alignItems: 'center', justifyContent: 'center'}}
       >
         <Text>Ingredients</Text>
       </View>
       <View

       >
         <TextInput
         autoCapitalize='none'
         autoCorrect={false}
         multiline={true}
         style={{width: '90%', height: 50, borderWidth: 2, marginLeft: 14,
         borderColor: 'gray', marginTop: 8, borderRadius: 8}}
         onChangeText={(text) => this.setState({ ingredients: text})}
         value={this.state.ingredients}
         />
        </View>
        <View
        style={{alignItems: 'center', justifyContent: 'center'}}
        >
          <Text>Steps</Text>
        </View>
        <View>
        <TextInput
        autoCapitalize='none'
        autoCorrect={false}
        multiline={true}
        style={{width: '90%', height: 50, borderWidth: 2, marginLeft: 14,
        borderColor: 'gray', marginTop: 8, borderRadius: 8}}
        onChangeText={(text) => this.setState({ steps: text})}
        value={this.state.steps}
        />
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
        </View>
        </TouchableWithoutFeedback>
        <View>
          <Button
            title='create form'
            onPress={this.createForm.bind(this)}
          />
        </View>
      </View>
    )
  }
}



export default CockatailForm
