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
} from 'react-native';
import * as firebase from 'firebase';
import SearchBar from 'react-native-searchbar';
import fontAwesome from 'react-native-vector-icons';
import { createStackNavigator } from 'react-navigation';
import { Card, Button, Icon } from 'react-native-elements';
import _ from 'lodash';


const {height, width} = Dimensions.get('window');


class CoctailList extends Component {

  static navigationOptions = props => {
  const { navigation } = props;
  const { navigate } = navigation;
  return {
    headerMode: 'none',
    headerVisible: false,
    header: null,
    tabBarIcon: ({ tintColor }) =>(
      <Icon
        name='user-circle'
        type='font-awesome'
        size={20}
      />
    ),
  }
}
  constructor(props){
    super(props);
    this.state = {
      cocktailNames: [],
      results: [],
      cocktailList: [],
      likeCounter: 1,
      user: firebase.auth().currentUser,
      iconColor: '#000',
      liked: null,
      numberOfLikes: 0
    };
    this._handleResults = this._handleResults.bind(this);
  }





  async componentWillMount(){
    this.Lister()
  }
  _handleResults(results){
    this.setState({ results });
  }
  Lister = async () => {
    const ref = firebase.database().ref('/cocktail_list')

     ref.on('value', (snapshot) =>{
      const data = snapshot.val()

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

  getUsersProfile(uid) {
    // return firebase.database().ref('users').child(uid).once('value', snap => {
    //   let like =  snap.val()
    //   this.setState({ like: snap.val() })
    // })
  }

   showCocktailDetail(item){
     // console.log(item)
     // this.props.navigation.navigate('cocktailDetail', {cocktail: item})
   }

_keyExtractor = item => (item.index || item.image)

renderCocktail(item){
    this.props.navigation.navigate('renderCocktail', {cocktail: item } )
  }


  deleteCockotail(item){
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
     firebase.database().ref('cocktail_list').child(item._key).remove()
  }

  async likedCocktail(item){
    const { user } = this.state
    const userUid = user.uid
    const itemUid = item.uid

    if(itemUid === userUid) {
      alert("you can't like your won post ")
    }else{
      const itemKey = item._key
      const likes =  await this.getLikes(itemKey, userUid, (result) => {
        if(result === false ){
          const ref = firebase.database().ref()
          const likesUpdate = {}
          likesUpdate[`${itemKey}/${userUid}`] = true
          ref.child('likes').update(likesUpdate)
          ref.child('cocktail_list').child(itemKey).update({
            numberOfLikes: item.numberOfLikes + 1
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


  renderIcons = (item) => {
    const { user } = this.state
    const itemUid = item.uid
    const userUid = user.uid

    const thumbsUpIconColor = {
      color: this.state.iconColor
    }
    if(itemUid === userUid){
      return (
        <View
          style={{ justifyContent: 'center', justifyContent: 'space-around',flexDirection: 'row', marginTop: 5 }}
        >
        <StatusBar
          hidden={true}
        />
        <View
        >
          <Icon
           name='trash'
           size={20}
          type='font-awesome'
           onPress={this.deleteCockotail.bind(this, item)}
          />
        </View>
        <View
        style={{ flexDirection: 'row' }}
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
    }else{
      return (
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
            }}
       >

           <View
            style={[styles.imageContainer]}
           >
            <Image
            source={{uri: item.image}}
            style={{ width: 300, height: 200, borderRadius: 10 }}
            />
           </View>
         <View
          style={{ marginTop: 10}}
         >
           <Button
              title='View Details'
              onPress={this.renderCocktail.bind(this, item)}
              buttonStyle={{ borderRadius: 10 , backgroundColor: '#3B5998'}}
           />
         </View>
           {this.renderIcons(item)}
           <View
             style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}
           >
           <TouchableHighlight
            onPress={() => this.props.navigation.navigate('userProfile', {userUid: item.uid})}
           >
             <View>
              <Image
               source={{ uri: item.userImage }}
               style={{ width: 50, height: 50, borderRadius: 50/2 }}
              />
             </View>
            </TouchableHighlight>
             <View
             >
             <Text
             style={{ fontSize: 15, fontWeight: 'bold'}}
             >{item.userName}</Text>
             </View>

           </View>
       </Card>
    )
  }

  render(){
    const { navigate } = this.props.navigation;
    return(
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'gray'}}>
         <FlatList
            data={this.state.cocktailList}
            renderItem={this._renderItem.bind(this)}
            keyExtractor={this._keyExtractor}
         />
      </View>
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
export default CoctailList;
