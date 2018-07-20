import React, { Component } from 'react';
import  {View, Text } from 'react-native';
import { Button } from 'react-native-elements';

class UserCocktail extends Component {
  render(){
    return(
      <View
       style={{ alignItems: 'center', justifyContent: 'center', flex: 1}}
      >
        <Button
          onPress={() => this.props.navigation.navigate('cockatailForm')}
        />
       <Text>User Cocktail</Text>
      </View>
    )
  }
}

export default UserCocktail;
