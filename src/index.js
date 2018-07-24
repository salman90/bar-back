import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CoctailList from './screens/cocktailList';
import UserCocktail from './screens/userCockatil';
import Profile from './screens/profile';
import CockatailForm from './screens/cockatailForm';
import Auth from './screens/auth';
import CocktailDetail from './screens/cocktailDetail';
import UserCocktailDetail from './screens/userCocktailDetail';
import PorfileUser from './screens/profileUser';
import {
  createBottomTabNavigator,
  createStackNavigator,
 } from 'react-navigation';

import * as firebase from "firebase";

class App extends React.Component {

  componentWillMount(){
    const config = {
      apiKey: "AIzaSyCqIoVukz6TmYayMf-uFwDmxYPdOOTl6aM",
      authDomain: "bar-back-c3947.firebaseapp.com",
      databaseURL: "https://bar-back-c3947.firebaseio.com",
      projectId: "bar-back-c3947",
      storageBucket: "bar-back-c3947.appspot.com",
      messagingSenderId: "133444454362"
    };
    firebase.initializeApp(config);
  }

  render() {
    const MainNavigation = createBottomTabNavigator({
      auth: {screen: Auth },
      main: {
        screen: createBottomTabNavigator({
          profile: {screen: Profile },
          userCockatil:{
            screen: createStackNavigator({
              usercocktail: {screen: UserCocktail},
<<<<<<< HEAD
              cockatailForm: {screen: CockatailForm},
=======
              cockatailForm: {screen: CockatailForm, navigationOptions: { tabBarVisible: false }},
              userCocktailDetail: { screen: UserCocktailDetail }
>>>>>>> origin/master
            })
          },
          cocktailList:   {
            screen: createStackNavigator({
              cocktailList: {screen: CoctailList },
              renderCocktail: { screen: CocktailDetail},
              userProfile: {screen: PorfileUser }
            })
          },
        }, {
          tabBarOptions: {
            showLabel: true,
			      showIcon: true,
            activeTintColor: '#d074dc',
            inactiveTintColor: '#000',
          },
        })
      }

    },
    {
      lazy: true,
      swipeEnabled: false,
      navigationOptions: {
          tabBarVisible: false
      },
    },
  )
    return (
      <MainNavigation />
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App ;
