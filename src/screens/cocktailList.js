import React, { Component } from 'react';
import  {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import * as firebase from 'firebase';
// import Search from 'react-native-searchbar';
import fontAwesome from 'react-native-vector-icons';
// import { createBottomTabNavigator } from 'react-navigation';
class CoctailList extends Component {
  state = {
    cocktailNames: []
  }
  componentWillMount(){
    firebase.database().ref('/cocktail_list').on('value', (snapshot) =>{
      const cocktailList = snapshot.val()
      this.setState({ cocktailNames: Object.keys(cocktailList) })
    });
  }
  render(){
    return(
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'teal'}}>
        <ScrollView style={{paddingTop:70}}>
        {this.state.cocktailNames.length !== 0 ?
      this.state.cocktailNames.map((name, i) => {
        return (
          <TouchableHighlight
           key={i}
          >
            <Text key={i}>
             {name}
            </Text>
          </TouchableHighlight>
          );
         })
          :
        <Text>No cocktails</Text>
        }
    </ScrollView>
  </View>
    );
  }
}
export default CoctailList;
