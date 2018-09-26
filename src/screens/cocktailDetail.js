import React, { Component } from 'react';
import  {
  View,
  Text,
  Button,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import * as firebase from 'firebase';
import { createStackNavigator } from 'react-navigation';
import CacheImage from '../components/chacheImage';



const {height, width} = Dimensions.get('window');


class CocktailDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cocktail: null,
      cocktailUser: null,
    };
  }




  async componentDidMount(){
    const navParams = this.props.navigation.state.params.cocktail;
    // console.log(navParams)
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

  _keyExtractor = (item, index) => item.name;

  _renderItem = ({item, i}) => {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    )
  }

  renderIngredients(ingredients){
    // console.log(ingredients)
    return ingredients.map((item, index) => {
      return (
        <Text
         key={index}
        >{index + 1 }- {item.name}</Text>
      )
    })
  }

  renderSteps(steps){
    return steps.map((step, i) =>{
      return (
        <Text
         key={i}
        >{i+ 1 }- {step.stepName}</Text>
      )
    })
  }

  render(){
    const { navigate } = this.props.navigation;
    const { cocktail, cocktailUser} = this.state
    if(cocktail === null || cocktailUser === null ){
      return (
        <View
        style={{
          flex: 1,
           alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3B5998'}}
        >
        <Text>BarBack</Text>
        </View>
      )
    }else{
      // console.log(cocktail.ingredients)
      return (
       <View
        style={{ flex: 1, backgroundColor: 'teal'}}
       >
        <ScrollView
        contentContainerStyle={styles.scrollViewStyle}
        >
        <View
        style={{
          alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'teal' }}
        >
          <View
            style={{width: width * 0.90, backgroundColor: '#fff', borderRadius: 8}}
          >
            <View
              style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 10}}
            >
                <Text
                  style={{ fontWeight: 'bold', letterSpacing: 2, fontSize: 20}}
                >
                  {cocktail.name}
                </Text>
            </View>
            <View
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <CacheImage
               uri={cocktail.image}
                style={{  width: width * 0.75, height: 200, borderRadius: 8}}
              />
            </View>
            <View
              style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: 10 }}
            >
              <View>
                <Text
                 style={{ fontSize: 20, marginBottom: 10 }}
                >
                Ingredients
                </Text>
              </View>
              <View
              >
               {this.renderIngredients(cocktail.ingredients)}
              </View>
            </View>
            <View
            style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: 10 }}
            >
              <View>
                <Text
                style={{ fontSize: 20, marginBottom: 10 }}
                >
                 Steps
                </Text>
              </View>
              <View>
              {this.renderSteps(cocktail.steps)}
              </View>
            </View>
            <View
            style={{
              alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
            width: width * 0.75, marginLeft: 15, marginTop: 10
                   }}
               >
               <TouchableHighlight
                onPress={() => this.props.navigation.navigate('userProfile', {userUid: cocktail.uid})}
                >
                  <CacheImage
                      uri={cocktailUser.profileImage}
                      style={{  width: 50, height: 50, marginBottom: 5, borderRadius: 50/2}}
                   />
               </TouchableHighlight>
               <Text
               style={{ fontSize: 15, fontWeight: 'bold'}}
                >
                  {cocktailUser.firstName} {cocktailUser.lastName}
                </Text>
            </View>
          </View>
        </View>
       </ScrollView>
       </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    paddingVertical: 50,
    backgroundColor: 'teal'
  },
})


export default CocktailDetail;
