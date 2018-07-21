import React, { Component } from 'react';
import  {
  View,
  Text,
  Button,
  ScrollView,
  Image,
  TouchableHighlight,
} from 'react-native';
import * as firebase from 'firebase';

class UserCocktailDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktail: {},
      user: firebase.auth().currentUser
    };
  }
  componentWillMount(){
    firebase.database().ref('/user_cocktails/'+`${this.state.user.uid}/`+ `${this.props.navigation.state.params.cocktail}`).on('value', (snapshot) =>{
      this.setState({cocktail: snapshot.val()});
    });
  }
  render(){
    const { params } = this.props.navigation.state;
    const back = () => {
      this.props.navigation.goBack(null);
    }
    return (
      <View style={{paddingTop: 50}}>
        <Image
          style={{width: 200, height: 200}}
          source={{uri: this.state.cocktail.image }} />
        <Text>Details on {this.state.cocktail.name}</Text>
        <Text>Ingredients: {this.state.cocktail.ingredients}</Text>
        <Text>Steps: {this.state.cocktail.steps}</Text>
      </View>
    )
  }
}

export default UserCocktailDetail;
