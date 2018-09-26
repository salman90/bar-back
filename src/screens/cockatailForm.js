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
 StyleSheet,
 } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Button, Icon, Avatar } from 'react-native-elements'
import firebase from 'firebase'
const {height, width} = Dimensions.get('window');

class CockatailForm extends Component {
  constructor(props) {
    super(props);
    this.state ={
      title: '',
      user: null,
      image: 'https://firebasestorage.googleapis.com/v0/b/bar-back-c3947.appspot.com/o/images%2Fdefault.jpg?alt=media&token=2c51fbb0-9f67-41ed-9110-ccb778065394',
      loading: false,
      valueArray: [],
      data: [{name: ''}],
      profileInfo: null,
      stepsArray: [{ stepName: '' }],
      stepName: '',
    }
    this.renderRemove = this.renderRemove.bind(this)
    this.renderRemoveAStep = this.renderRemoveAStep.bind(this)
    this.addButton = this.addButton.bind(this)
    this.addButtonToSteps = this.addButtonToSteps.bind(this)
    this.uploadCoctailImage = this.uploadCoctailImage.bind(this)
    this.createForm = this.createForm.bind(this)
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (<Icon type='font-awesome' name='arrow-circle-left'
    containerStyle={{ paddingLeft: 15 }} color='#000' onPress={() => navigation.goBack()} />),
    }
  }


  componentDidMount() {
    const { data,  stepsArray } = this.state
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
     const { user, image, ingredients, steps, name, profileInfo, stepsArray, data, title } = this.state
     this.setState({ loading: true })
     const userUid = user.uid
     const userName = `${profileInfo.firstName} ${profileInfo.lastName}`
     const userImage = `${profileInfo.profileImage}`
     const saveDataToUserList = await firebase.database().ref('user_cocktails').child(userUid).push({
       name: title,
       ingredients: data,
       steps: stepsArray,
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
       name: title,
       ingredients: data,
       steps: stepsArray,
       uid: userUid,
       image: image,
       userName: userName,
       userImage: userImage,
       numberOfLikes: 0,
     })
     this.setState({
                    loading: false,
                    image:  'https://firebasestorage.googleapis.com/v0/b/bar-back-c3947.appspot.com/o/images%2Fdefault.jpg?alt=media&token=2c51fbb0-9f67-41ed-9110-ccb778065394',
                    stepsArray: [{stepName: '' }],
                    data: [{name: '' }],
                    name: '',
                    stepName: '',
                    title: '',
                  })
   }



   addButton(){
     const { data, ingredientsCounter } = this.state
     const newData = data
       newData.push({ name: ''})
     this.setState({
      data: newData,
     })
   }



  _onChangeText(text, index) {
  const {name, data} = this.state
  const newData = this.state.data.map((data,i) => {
      if(index !== i)return data;
        return { ...data,  name:  text}
    })

    this.setState({
      data: newData
    })
  }


  _onChangeTextForSteps(text, index) {
    // console.log(text)
    const {stepName, stepsArray} = this.state
    const newData = this.state.stepsArray.map((step,i) => {
      if(index !== i) return step;
      // console.log(text)
      return { ...step, stepName: text }
    })
    this.setState({
      stepsArray: newData
    })
  }

  renderRemove = (index) => () => {
    this.setState({
      data:  this.state.data.filter((s, sidx) => index !== sidx )
    })
  }


  renderRemoveAStep = (index) => () => {
    this.setState({
      stepsArray: this.state.stepsArray.filter((s, sidx) => index !== sidx)
    })
  }


  addButtonToSteps(){
    const { stepsArray, stepsCounter } = this.state
    const newData = stepsArray
      newData.push({ stepName: ''})
    this.setState({
     stepsArray: newData,
    })
  }



  render(){
    const addMoreCompView = this.state.data.map((data ,index) =>{
      return (
        <View
         key={index}
         style={{ flexDirection: 'row' }}
        >
            <TextInput
             style={styles.IngredientsAndStepsTextInputStyle}
             onChangeText={(text) => { this._onChangeText(text, index)}}
             placeholder={`ingredients ${index + 1}`}
             value={data.name}
          />
            <Icon
              type='ionicon'
              name='ios-remove-circle-outline'
              onPress={this.renderRemove(index)}
              size={30}
            />

        </View>
      )
    })

    const addMoreSteps = this.state.stepsArray.map((step, index) => {
      return (
        <View
         key={index}
         style={{ flexDirection: 'row' }}
        >
          <TextInput
           style={styles.IngredientsAndStepsTextInputStyle}
           placeholder={`step ${index + 1}`}
           onChangeText={(text) => { this._onChangeTextForSteps(text, index)}}
           value={step.stepName}
          />
          <Icon
            type='ionicon'
            name='ios-remove-circle-outline'
            onPress={this.renderRemoveAStep(index)}
            size={30}
          />
        </View>
      )
    })

    if(this.state.loading){
      return (
        <View
         style={styles.container}
        >
          <ActivityIndicator />
        </View>
      )
    }

    return(
    <View
     style={{ flex: 1, backgroundColor: 'teal' }}
    >
    <ScrollView
    contentContainerStyle={styles.scrollViewStyle}
    >
      <View
      style={styles.container}
      >

         <View
          style={styles.textInputTitle}
         >
           <Text>Cocktail Name</Text>
         </View>
         <View>
           <TextInput
          autoCapitalize='none'
          autoCorrect={false}
           style={styles.nameTextInputStyle}
           onChangeText={(text) => this.setState({ title: text})}
           value={this.state.title}
           />
         </View>
         <View
          style={styles.textInputTitle}
         >
            <Text>Ingredients</Text>
         </View>
         <View
          style={{ flexDirection: 'column'}}
         >
           <View>
            {addMoreCompView}
           </View>
           <View>
             <Icon
              onPress={this.addButton}
              type='ionicon'
              size={30}
              name='ios-add-circle'
             />
           </View>
         </View>
       <View
        style={{flexDirection: 'column'}}
       >
         <View
          style={styles.textInputTitle}
         >
            <Text>Steps</Text>
         </View>
         <View>
          {addMoreSteps}
         </View>
         <View>
           <Icon
           onPress={this.addButtonToSteps}
           type='ionicon'
           size={30}
           name='ios-add-circle'
           />
         </View>
       </View>
       <TouchableWithoutFeedback
         onPress={this.uploadCoctailImage}
        >
          <View
           style={styles.textInputTitle}
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
               containerStyle={styles.avatarContainer}
              />
            </View>
          </TouchableWithoutFeedback>
          <View
           style={{ marginTop: 10}}
          >
            <Button
              title='Create Your Cocktail'
              onPress={this.createForm}
            />
          </View>
      </View>
  </ScrollView>
  </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    paddingVertical: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  textInputTitle: {
     alignItems: 'center',
     justifyContent: 'center',
     flexDirection: 'row',
     marginTop: 10,
  },
  nameTextInputStyle: {
    width: 250 ,
    height: 50,
    borderWidth: 2,
    marginLeft: 14,
   borderColor: '#000',
   marginTop: 8,
   borderRadius: 8,
 },
 IngredientsAndStepsTextInputStyle: {
   width: 210,
   height: 50,
   borderColor: '#000',
   borderWidth: 3,
   margin: 5,
   borderRadius: 10,
 },
 ingredientsAndStepsButtonStyle: {
   width: 40,
   height: 50,
 },
 addIngredientsAndStepsButtonStyle:{
   width: 130,
   height: 50,
   margin: 5,
   borderRadius: 8,
   backgroundColor: 'blue'

 },
 avatarContainer: {
   marginLeft: 10,
   borderRadius: 8,
 },
})



export default CockatailForm
