import React, { Component } from 'react';
import  {
  View,
  Text,
  ScrollView,
  TouchableHighlight, } from 'react-native';
// import { createBottomTabNavigator } from 'react-navigation';
import * as firebase from 'firebase';
import SearchBar from 'react-native-searchbar';
import fontAwesome from 'react-native-vector-icons';
import { createStackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements'

class UserCocktail extends Component {
  constructor(props){
    super(props);
    this.state = {
      cocktailNames: [],
      results: [],
      user: firebase.auth().currentUser
    };
    this._handleResults = this._handleResults.bind(this);
  }
  componentWillMount(){
    this.Lister()
  }
  _handleResults(results){
    this.setState({ results });
  }
  Lister(){
    firebase.database().ref('/user_cocktails/'+`${this.state.user.uid}`).on('value', (snapshot) =>{
      if(snapshot.val() !== null){
        this.setState({cocktailNames: Object.keys(snapshot.val()) })
      } else {
        this.setState({cocktailNames: ["Add Cocktails!"]});
      }
    });
  }

  renderForm() {
    this.props.navigation.navigate('cockatailForm')
  }

  render(){
    const { navigate } = this.props.navigation;
    return(
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'teal'}}>
      <SearchBar
      ref={(ref) => this.searchBar = ref}
      data={this.state.cocktailNames}
      handleResults={this._handleResults}
      allDataOnEmptySearch
      hideBack
      showOnLoad/>
      <ScrollView style={{paddingTop:70}}>
      <Button
        title= 'create cocktail'
        onPress={this.renderForm.bind(this)}
      />
      {this.state.results.length !== 0 ?
        this.state.results.map((result, i) => {
          return (
            <TouchableHighlight
            key={i}
            style={{paddingTop: 5}}
            onPress={() => {this.props.navigation.navigate('cocktailDetail', {
              cocktail: result});
            }}>
            <Text>
            {result}
            </Text>
            </TouchableHighlight>
          );
        })
        :
        this.state.cocktailNames.map((name, i) => {
          return (
            <TouchableHighlight
            key={i}
            style={{paddingTop: 5}}
            onPress={() => {this.props.navigation.navigate('cocktailDetail', {
              cocktail: name});
            }}>
            <Text>
            {name}
            </Text>
            </TouchableHighlight>
          );
        })
      }
      </ScrollView>
      </View>
    );
  }
}

export default UserCocktail;
