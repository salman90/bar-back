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
import ListItem from '../components/listItem';

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
    };
    this._handleResults = this._handleResults.bind(this);
  }
  async componentDidMount(){
    // if()
    const ref = firebase.database().ref('/users').child(this.props.navigation.state.params.userUid)
    ref.once('value', (snapshot) =>{
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



_keyExtractor = item => (item.index || item.image)


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
            renderItem={this._renderItem}
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
