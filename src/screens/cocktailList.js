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
} from 'react-native';
import * as firebase from 'firebase';
import SearchBar from 'react-native-searchbar';
import fontAwesome from 'react-native-vector-icons';
import { createStackNavigator } from 'react-navigation';
import { Card, Button, Icon } from 'react-native-elements';

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
      user: firebase.auth().currentUser,
      iconColor: 'gray'
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
    const ref = firebase.database().ref('/cocktail_list')
     ref.on('value', (snapshot) =>{
      const data = snapshot.val()
      const list = []
      snapshot.forEach((child) => {
        list.push({
          name: child.val().name,
          ingredients: child.val().ingredients,
          image: child.val().image,
          steps: child.val().steps,
          uid: child.val().uid,
          _key: child.key
        });
      })
      this.setState({ cocktailList: list })
    });
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

  likedCocktail() {
    console.log('salman salem')
    this.setState({ iconColor: 'blue' })
  }


  renderIcons = (item) => {
    const { user } = this.state
    const itemUid = item.uid
    const userUid = user.uid
    const thumbsUpIconColor = {
      color: this.state.iconColor
    }
    // console.log(item.uid, 'item', userUid, 'user')
    if(itemUid === userUid){

      return (
        <View
          style={{ justifyContent: 'center', justifyContent: 'space-around',flexDirection: 'row', marginTop: 5, }}
        >
        <View>
          <Icon
           name='trash'
           size={20}
          type='font-awesome'
           onPress={this.deleteCockotail.bind(this, item)}
          />
        </View>
        <View>
          <Icon
           name='thumbs-up'
           size={20}
            type='font-awesome'
            color={this.state.iconColor}
            onPress={this.likedCocktail.bind(this)}
          />
        </View>
      </View>
      )
    }else{
      return (
        <View>
          <Icon
           name='thumbs-up'
           size={20}
            type='font-awesome'
            color= {this.state.iconColor}
            onPress={this.likedCocktail.bind(this)}
          />
        </View>
      )
    }
  }

  _renderItem({item, index}) {
    return (
       <Card
        containerStyle={{ borderRadius: 10 }}
        title={item.name.toUpperCase()}
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
           {this.renderIcons(item)}
       </Card>
    )
  }

  render(){
    // console.log(this.state.cocktailList)
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
export default CoctailList;
