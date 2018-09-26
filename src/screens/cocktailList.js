import React,{ Component } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import * as firebase from 'firebase';
import { BlurView } from 'expo';
import SearchBar from 'react-native-searchbar';
import fontAwesome from 'react-native-vector-icons';
import { createStackNavigator } from 'react-navigation';

import { Card, Button, Icon } from 'react-native-elements';
import CacheImage from '../components/chacheImage';
import ListItem from '../components/listItem';
import _ from 'lodash';


const {height, width} = Dimensions.get('window');


class CoctailList extends Component {

  constructor(props){
    super(props);
    this.state = {
      cocktailNames: [],
      cocktailList: [],
      likeCounter: 1,
      user: firebase.auth().currentUser,
      iconColor: '#000',
      liked: null,
      numberOfLikes: 0,
      animatedValue: new Animated.Value(1),
      animatedValue2: new Animated.Value(0),
      page: 5,
      refreshing: false,
      loading: false,
    };
   this.renderPlus = this.renderPlus.bind(this)
  }

  async componentDidMount(){
    this.Lister()
  }

  Lister = async () => {
    const { page } = this.state
    this.setState({ loading: true })
    let referenceToOldestKey = ''
      const ref = firebase.database().ref('/cocktail_list')
       ref.on('value', (snapshot) =>{
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

        list.reverse()
        this.setState({ cocktailList: list,
                         loading: false,
                       })
      })
  }


_keyExtractor = item => (item.index || item._key)


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
          }, (error) => {
            if(error){
              alert('could not like post please try again')
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

   renderPlus = (post) => () => {
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
         alert('saved to list')
       }
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
          />
          <Text>{item.numberOfLikes}</Text>
        </View>
      </View>
      )
    }else{
      return (
      <View
       style={{flexDirection: 'row', marginTop: 10,  justifyContent: 'space-around', marginTop: 5}}
      >
         <Animated.View
         style={{flexDirection: 'row', marginTop: 10}}
         >
           <Icon
            name='plus-square'
            type='font-awesome'
            size={25}
            onPress={this.renderPlus(item)}
           />
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

  renderHeader(){
    return (
    <SearchBar
    ref={(ref) => this.searchBar = ref}
    />
    )
  }
  handleRefresh = () =>{
    // console.log('refershing')
    console.log('in refershing')
    this.setState({
      refreshing: true,
    }, () => {
      this.Lister()
    })
  }

  _renderItem = ({item}) => (
    <ListItem
      item={item}
      navigation={this.props.navigation}
      pageName='userProfile'
      cocktailPage='renderCocktail'
      user={this.state.user}
    />
  )


  render(){
    const { navigate } = this.props.navigation;
    return(
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'teal'}}>
         <FlatList
            data={this.state.cocktailList}
            renderItem={this._renderItem}
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
