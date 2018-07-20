import React, { Component } from 'react';
import  {
  View,
  Text,
  Button,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import * as firebase from 'firebase';

class CocktailDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktail: {}
    };
  }
  componentWillMount(){
    firebase.database().ref('/cocktail_list/' + `${this.props.navigation.state.params.cocktail}`).on('value', (snapshot) =>{
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
        <Text>Details on {this.state.cocktail.title}</Text>
        <Text>Description: {this.state.cocktail.description}</Text>
        <Text>Steps: {this.state.cocktail.steps}</Text>
      </View>
    )
  }
}

export default CocktailDetail;
