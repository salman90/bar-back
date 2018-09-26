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
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
 FIREBASE_STORAGE_BUCKET,
FIREBASE_MESSAGING_SENDER_ID
} from 'react-native-dotenv';

import {
  createBottomTabNavigator,
  createStackNavigator,
 } from 'react-navigation';

import * as firebase from "firebase";
import { Icon } from 'react-native-elements'

class App extends React.Component {

  componentWillMount(){
    const config = {
      apiKey: FIREBASE_API_KEY,
      authDomain: FIREBASE_AUTH_DOMAIN,
      databaseURL: FIREBASE_DATABASE_URL,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: FIREBASE_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_MESSAGING_SENDER_ID
    };
    firebase.initializeApp(config);
  }

  render() {
    const userProfileListStack = createStackNavigator({
      userPersonalList: {screen: UserPersonalList},
      renderCocktail: { screen: CocktailDetail},
    }, {
      navigationOptions: ({ navigation }) => ({
        title: `BarBack`,
        headerVisible: false,
      })
    })
    const profileStack = createStackNavigator({
      profile: {screen: Profile },
      userPersonalList: {screen: UserPersonalList},
      cockatailForm: {screen: CockatailForm},
    }, {
      navigationOptions: ({ navigation }) => ({
        title: `BarBack`,
        headerStyle: {
         backgroundColor: '#A9A9A9'
       },
       headerTitleStyle: {
         color: '#000',
         fontSize: 20,
         letterSpacing: 4,
         fontWeight: '500',
       },
      })
    })

    const cocktailListStackNav = createStackNavigator({
      cocktailList: {
        screen: CoctailList,
        navigationOptions: ({navigation}) => ({
          headerStyle: {
           backgroundColor: '#fff'
         },
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
