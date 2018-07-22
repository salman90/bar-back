import React, { Component } from 'react';
import  {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import * as firebase from 'firebase';
import SearchBar from 'react-native-searchbar';
import fontAwesome from 'react-native-vector-icons';
import { createStackNavigator } from 'react-navigation';
import { Card, Button } from 'react-native-elements';

const {height, width} = Dimensions.get('window');


class UserCocktail extends Component {
  constructor(props){
    super(props);
    this.state = {
      cocktailNames: [],
      results: [],
      cocktailList: [],
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
        const data = snapshot.val()
        let cocktailList = Object.values(data);
        this.setState({ cocktailList })
      } else {
        this.setState({cocktailList: ["Add Cocktails!"]});
      }
    });
  }
  showCocktailDetail(item){
    console.log(item)
    // this.props.navigation.navigate('cocktailDetail', {cocktail: item})
  }
  _keyExtractor = item => (item.index || item.image)
  renderCocktail(item){
    // console.log(item)
    this.props.navigation.navigate('renderCocktail', {cocktail: item } )
  }
  _renderItem({item, index}) {
    return (
      <Card
      containerStyle={{ borderRadius: 10 }}
      title={item.name}
      key={index}
      titleStyle={{ fontWeight: 'bold',
      letterSpacing: 2,
    }}
    >
    <View
    style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}
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
    </Card>
  )
}

render(){
  // console.log(this.state.cocktailList)
  const { navigate } = this.props.navigation;
  return(
    <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'gray'}}>
    <SearchBar
    data={this.state.cocktailList}
    handleResults={this._handleResults}
    allDataOnEmptySearch
    hideBack
    showOnLoad/>
    {this.state.results.length !== 0 ?
      <FlatList
      style={{paddingTop: 70}}
      data={this.state.results}
      renderItem={this._renderItem.bind(this)}
      keyExtractor={this._keyExtractor}
      />
      :
      <FlatList
      style={{paddingTop: 70}}
      data={this.state.cocktailList}
      renderItem={this._renderItem.bind(this)}
      keyExtractor={this._keyExtractor}
      />
    }
    </View>
  );
}
}
export default UserCocktail;
