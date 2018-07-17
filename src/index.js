import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CoctailList from './screens/cocktailList';
import UserCocktail from './screens/userCockatil';
import Profile from './screens/profile'
import { createBottomTabNavigator } from 'react-navigation';


class App extends React.Component {

  render() {
    const MainNavigation = createBottomTabNavigator({
      cocktailList: {screen: CoctailList},
      profile: {screen: Profile},
      UserCocktail: {screen: UserCocktail},
    })
    // const main =
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
