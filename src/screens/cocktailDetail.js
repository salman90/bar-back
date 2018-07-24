import React, { Component } from 'react';
import  {
  View,
  Text,
  Button,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  Image,
} from 'react-native';
import * as firebase from 'firebase';



const {height, width} = Dimensions.get('window');


class CocktailDetail extends Component {
  static navigationOptions = props => {
  const { navigation } = props;
  const { navigate } = navigation;
  return {
    tabBarVisible: false,
    tabBarIcon: ({ tintColor }) =>(
      <Icon
        name='user-circle'
        type='font-awesome'
        size={20}
      />
    ),
  }
}
  constructor(props) {
    super(props);
    this.state = {
      cocktail: null,
      cocktailUser: null,
    };
  }


  async componentDidMount(){
    const navParams = this.props.navigation.state.params.cocktail;
    const cocktailUser = await this.getUserInfo()
    this.setState({ cocktail: navParams})
  }

  getUserInfo = () => {
    const cocktail = this.props.navigation.state.params.cocktail;
    const userUid = cocktail.uid
    return firebase.database().ref('users').child(userUid).once('value', snap => {
      snap.val()
      const user = snap.val()
      this.setState({ cocktailUser: user })
    })
  }


  render(){
    const { cocktail, cocktailUser} = this.state
    if(cocktail === null || cocktailUser === null ){
      return (
        <View
         style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
        >
         <Text>Loading ....</Text>
        </View>
      )
    }else{

    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, padding: 20, marginBottom: 5 }}>
      <View
       style={{width: width * 0.90, backgroundColor: '#fff', borderRadius: 8}}
      >
        <View
         style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 10}}
        >
         <Text
          style={{ fontWeight: 'bold', letterSpacing: 2, fontSize: 20}}
         >{cocktail.name}
         </Text>
        </View>
        <View
         style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <Image
            source={{ uri: cocktail.image}}
            style={{  width: width * 0.75, height: 200, borderRadius: 8}}
          />
        </View>
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: 10 }}
        >
         <View>
            <Text
             style={{ fontSize: 20, marginBottom: 10 }}
            >Ingredients</Text>
        </View>
        <View>
            <Text>{cocktail.ingredients}</Text>
        </View>
        </View>
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: 10 }}
        >
          <View>
            <Text
            style={{ fontSize: 20, marginBottom: 10 }}
            >Steps</Text>
          </View>
          <View>
            <Text>{cocktail.steps}</Text>
          </View>
        </View>
        <View
        style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
        width: width * 0.75, marginLeft: 15, marginTop: 10  }}
        >
            <Image
              source={{ uri: cocktailUser.profileImage}}
              style={{  width: 50, height: 50, marginBottom: 5, borderRadius: 50/2}}
            />
            <Text
             style={{ fontSize: 15, fontWeight: 'bold'}}
            >{cocktailUser.firstName}</Text>
        </View>
        </View>

      </View>
    )
   }
  }
}

export default CocktailDetail;
