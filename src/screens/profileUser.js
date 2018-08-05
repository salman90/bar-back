import React, { Component } from 'react';
import  {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  FlatList,
  Image,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import * as firebase from 'firebase';
import SearchBar from 'react-native-searchbar';
import fontAwesome from 'react-native-vector-icons';
import { createStackNavigator } from 'react-navigation';
import { Card, Button, Icon, Avatar } from 'react-native-elements';
import _ from 'lodash';

const {height, width} = Dimensions.get('window');

class ProfileUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      cocktailNames: [],
      results: [],
      cocktailList: [],
      likeCounter: 1,
      user: null,
      iconColor: '#000',
      liked: null,
      numberOfLikes: 0,
      numCocktails: 0,
      animatedValue: new Animated.Value(1),
      animatedValue2: new Animated.Value(0),
    };
    this._handleResults = this._handleResults.bind(this);
  }
  async componentWillMount(){
    const ref = firebase.database().ref('/users').child(this.props.navigation.state.params.userUid)
    ref.on('value', (snapshot) =>{
      this.setState({user: snapshot.val()})
    })

    this.Lister()
  }
  _handleResults(results){
    this.setState({ results });
  }
  Lister = async () => {
    const ref = firebase.database().ref('/user_cocktails').child(this.props.navigation.state.params.userUid)

     ref.on('value', (snapshot) =>{
      const data = snapshot.val()
      this.setState({numCocktails: snapshot.numChildren()})

      const list = []
      snapshot.forEach((child) => {

        list.push({
          name: child.val().name,
          userName: child.val().userName,
          userImage: child.val().userImage,
          ingredients: child.val().ingredients,
          image: child.val().image,
          steps: child.val().steps,
          uid: child.val().uid,
          numberOfLikes: child.val().numberOfLikes,
          _key: child.key
        });
      })
      this.setState({ cocktailList: list })
    });
  }

  getProfiles = (uid) => {
    console.log(uid)
  }

_keyExtractor = item => (item.index || item.image)

renderCocktail(item){
    this.props.navigation.navigate('renderCocktail', {cocktail: item } )
  }
  deleteCocktail(item){
    Alert.alert(
      'Delete',
      `Are you sure you want to delete ${item.name}?` ,
      [
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: this.confirmDelete.bind(this, item)},
      ],
      { cancelable: false }
    )
  }
  confirmDelete(item){
    firebase.database().ref('user_cocktails').child(firebase.auth().currentUser.uid).child(item._key).remove()
  }
  async likedCocktail(item){
    const { user } = this.state
    const userUid = firebase.auth().currentUser.uid
    const itemUid = item.uid

    if(itemUid === userUid) {
      alert("you can't like your own post ")
    }else{
      const itemKey = item._key
      const likes =  await this.getLikes(itemKey, userUid, (result) => {
        if(result === false ){
          const ref = firebase.database().ref()
          const likesUpdate = {}
          likesUpdate[`${itemKey}/${userUid}`] = true
          ref.child('likes').update(likesUpdate)
          ref.child('user_cocktails').child(userUid).child(itemKey).update({
            numberOfLikes: item.numberOfLikes + 1
          }, (error) => {
            if(error){
              alert('could not like post, please try again')
            }
          })
        }else {
          firebase.database().ref('likes').child(itemKey).child(userUid).remove()
            firebase.database().ref('cocktail_list').child(itemKey).update({
              numberOfLikes: item.numberOfLikes - 1
          })
        }
      })
    }
  }

  getLikes = (key, uid, callback) => {
     return firebase.database().ref('likes').child(key).once('value', snap => {
       let data = snap.val() || {}
       const likeUids = Object.keys(data)
      const likeInArray =  _.includes(likeUids, uid)
      callback(likeInArray)
    })
  }

  renderAnimation(){
    Animated.timing(this.state.animatedValue, {
      toValue: 0,
      duration: 250,
    }).start(() => {
      Animated.timing(this.state.animatedValue2, {
        toValue: 1,
        duration: 250,
      }).start()
    })
  }

   renderPlus(post){
    const { user } = this.state
    const userUid =  user.uid
    const postKey = post._key
    const name = post.name
    const image = post.image
    const steps = post.steps
    const uid  = post.uid
    const userImage = post.userImage
    const userName  = post.userName
     firebase.database().ref('user_cocktails').child(userUid).child(postKey).set({
       name: name,
       image: image,
       steps: steps,
       uid: uid,
       userImage: userImage,
       userName: userName,
       _key: postKey
     }, (error) => {
       if(error){
         alert('could not add to the list try again' + error)
       }else{
         // this.renderAnimation()
         alert('saved to list')
       }
     })
   }

  renderIcons = (item) => {
    const name = `${this.state.user.firstName}`+ ' '+`${this.state.user.lastName}`
    const { user } = this.state
    const itemUid = item.uid
    const userUid = user.uid
    const thumbsUpIconColor = {
      color: this.state.iconColor
    }
    if(String(name) === String(item.userName)){
      return (
        <View
          style={{ justifyContent: 'center', justifyContent: 'space-around',flexDirection: 'row', marginTop: 5 }}
        >
        <StatusBar
          hidden={true}
        />
        <View>
          <Icon
           name='trash'
           size={20}
           type='font-awesome'
           onPress={this.deleteCocktail.bind(this, item)}
          />
        </View>
      </View>
      )
    }else{
      return (
      <View
       style={{flexDirection: 'row', marginTop: 10,  justifyContent: 'space-around'}}
      >
        <Animated.View
         style={{flexDirection: 'row'}}
        >
         <Animated.View
         >
           <Icon
            name='plus-square'
            type='font-awesome'
            size={25}
            onPress={this.renderPlus.bind(this, item)}
           />
         </Animated.View>
        </Animated.View>

         <View
         style={{ marginTop: 10, flexDirection: 'row'}}
         >
           <Icon
            name='thumbs-up'
            size={20}
             type='font-awesome'
             iconStyle={{ color: this.state.iconColor }}
             onPress={this.likedCocktail.bind(this,item)}
           />
           <Text>{item.numberOfLikes}</Text>
         </View>
        </View>
      )
    }
  }

  _renderItem({item, index}) {
    return (
       <Card
        containerStyle={{ borderRadius: 10, marginBottom: 8 }}
        title={item.name.toUpperCase()}
        key={index}
        titleStyle={{
          fontWeight: 'bold',
          letterSpacing: 2,
        }}>
           <View style={[styles.imageContainer]}>
            <Image
            source={{uri: item.image}}
            style={{ width: 300, height: 200, borderRadius: 10 }}/>
           </View>
         <View style={{ marginTop: 10}}>
           <Button
              title='View Details'
              onPress={this.renderCocktail.bind(this, item)}
              buttonStyle={{ borderRadius: 10 , backgroundColor: '#3B5998'}}/>
         </View>
           {this.renderIcons(item)}
       </Card>
    )
  }

  render(){
    const { navigate } = this.props.navigation;
    if(this.state.user === null ){
      return (
        <View />
      )
    }
    return(
      <ScrollView>
      <View
      style={{flexDirection: 'column', alignItems: 'center'}}>
        <Text
        style={{fontSize: 40}}>
          {this.state.user.firstName} {this.state.user.lastName}
        </Text>
        <Avatar
         width={200}
         rounded
         size="xlarge"
         onPress={this.uploadImage}
         source={{uri: this.state.user.profileImage}}
        />
      </View>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <Text
          style={{padding: 10}}>
          City
        </Text>
        <Text style={{padding: 10}}>
          {this.state.numCocktails} cocktail recipes
        </Text>
      </View>
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'teal'}}>
         <FlatList
            data={this.state.cocktailList}
            renderItem={this._renderItem.bind(this)}
            keyExtractor={this._keyExtractor}
         />
      </View>
      </ScrollView>
    );
  }
}

const styles = {
  imageContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export default ProfileUser
