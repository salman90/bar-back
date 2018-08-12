import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableHighlight,
  ActivityIndicator,
  Alert  } from 'react-native';
import firebase from 'firebase';
import { Card, Button, Icon } from 'react-native-elements';
import CacheImage from '../components/chacheImage';
import ListItem from '../components/listItem';


class UserPersonalList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (<Icon type='font-awesome' name='arrow-circle-left'
    containerStyle={{ paddingLeft: 15 }} color='#000' onPress={() => navigation.goBack()} />),
    }
  }

  state = {
    cocktailList: null
  }
  componentDidMount() {
    const navParams = this.props.navigation.state.params.user;
    const userUid = navParams.uid
    // console.log(userUid)
    firebase.database().ref('user_cocktails').child(userUid).on('value', snap => {
      const list = []
      snap.forEach((child) => {
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
        })
      })
      this.setState({ cocktailList: list })
    })
  }

  _keyExtractor = item => (item.index || item._key)

  renderCocktail(item){
    this.props.navigation.navigate('renderCocktail', {cocktail: item } )
  }

  renderRemoveFromList(post){

    const navParams = this.props.navigation.state.params.user;
    const userUid = navParams.uid
    const postKey = post._key
    const postName = post.name
    Alert.alert(
      'Delete',
      `Are you sure you want to delete ${postName}`,
      [
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: this.deleteListItem.bind(this,userUid,postKey)},

      ],
      { cancelable: false }
    )
  }

  deleteListItem(userUid, postKey){
    firebase.database().ref('user_cocktails').child(userUid).child(postKey).remove()
  }

  _renderItem = ({item}) => (
    <ListItem
    item={item}
    navigation={this.props.navigation}
    pageName='userProfile'
    cocktailPage='renderCocktail'
    />
  )

  render(){
       if(this.state.cocktailList === null){
         return(
           <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
           >
            <ActivityIndicator
            size="large" color="#0000ff"
            />
           </View>
         )
       }else {
        return (
          <View
           style={{
             flex: 1,
             alignItems: 'center',
             justifyContent: 'center',
             backgroundColor: 'teal'
           }}
          >
           <FlatList
           data={this.state.cocktailList}
           renderItem={this._renderItem}
           keyExtractor={this._keyExtractor}
           removeClippedSubviews={false}
           />
          </View>
        )
       }
  }
}

const styles = {
  imageContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export default UserPersonalList
