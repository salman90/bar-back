import React, { Component } from 'react';
import  {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import * as firebase from 'firebase';
import SearchBar from 'react-native-searchbar';
import fontAwesome from 'react-native-vector-icons';

class CoctailList extends Component {
  constructor(props){
    super(props);
    this.state = {
      cocktailNames: [],
      results: [],
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
    firebase.database().ref('/cocktail_list').on('value', (snapshot) =>{
      const cocktailList = snapshot.val()
      this.setState({ cocktailNames: Object.keys(cocktailList) })
    });
  }
  render(){
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
      {this.state.results.length !== 0 ?
        this.state.results.map((result, i) => {
          return (
            <TouchableHighlight
            style={{paddingTop: 5}}
            key={i}>
            <Text key={i}>
            {result}
            </Text>
            </TouchableHighlight>

          );
        })
        :
        this.state.cocktailNames.map((name, i) => {
          return (
            <TouchableHighlight
            style={{paddingTop: 5}}
            key={i}>
            <Text key={i}>
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
export default CoctailList;
