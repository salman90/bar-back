import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CoctailList from './screens/cocktailList';
import UserCocktail from './screens/userCockatil';
import Profile from './screens/profile';
import CockatailForm from './screens/cockatailForm';
import Auth from './screens/auth';
import CocktailDetail from './screens/cocktailDetail';
import PorfileUser from './screens/profileUser';
import UserPersonalList from './screens/userpersonallist'
import {
  createBottomTabNavigator,
  createStackNavigator,
 } from 'react-navigation';

import * as firebase from "firebase";
import { Icon } from 'react-native-elements'

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
    const profileStack = createStackNavigator({
      profile: {screen: Profile },
      userPersonalList: {screen: UserPersonalList},
      cockatailForm: {screen: CockatailForm},
    }, {
      navigationOptions: ({ }) => ({
        title: `BarBack`,
      })
    })

    const cocktailListStackNav = createStackNavigator({
      cocktailList: {
        screen: CoctailList,
        navigationOptions: ({navigation}) => ({
          cardStyle: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          } ,
          title: `BarBack`,

          headerTitleStyle: {
            color: '#000',
            fontSize: 20,
            letterSpacing: 1,
          },
        })
      },
      renderCocktail: { screen: CocktailDetail},
      userProfile: {screen: PorfileUser }
    })

    const mainTabNav = createBottomTabNavigator({
      profile: {
        screen: profileStack
      },
      cocktailList:   {
        screen: cocktailListStackNav
      },
    }, {
      navigationOptions: ({ navigation }) => ({
        tabBarOptions: {
          showLabel: false,
        },
        title: {
          tabBarLabel: null
        },
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          if(routeName === 'profile'){

            if(focused){

              return (
                <Icon
                 name='user-circle'
                 size={25}
                type='font-awesome'
                color='#800080'
                />
              )
            }
            return(
              <Icon
               name='user-circle'
               size={25}
              type='font-awesome'
              />
            )
          }else if(routeName === 'cocktailList'){
            if(focused){
              return(
                <Icon
                name='martini'
                size={20}
                type='material-community'
                color='#800080'
                />
              )
            }
            return (
              <Icon
               name='martini'
               size={20}
               type='material-community'
              />
            )
          }
        },
      })
    })

    const TabNavigation = createBottomTabNavigator({
      auth: {screen: Auth },
      main: {
        screen: mainTabNav
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
      <TabNavigation />
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
