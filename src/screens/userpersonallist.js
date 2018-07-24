import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import { Card, Button, Icon } from 'react-native-elements';


class UserPersonalList extends Component {
  state = {
    cocktailList: null
  }
  componentDidMount() {
    const navParams = this.props.navigation.state.params.user;
    const userUid = navParams.uid
    firebase.database().ref('user_cocktails').child(userUid).once('value', snap => {
      const list = []
      snap.forEach((child) => {
        list.push({
          name: child.val().name,
          userName: child.val().userName,
          userImage: child.val().userImage,
          ingredients: child.val().ingredients,
          image: child.val().image,
          steps: child.val().steps,
          uid: child.val().uid,
          numberOfLikes: child.val().numberOfLikes,
          _key: child.key
        })
      })
      this.setState({ cocktailList: list })
    })
  }

  _keyExtractor = item => (item.index || item.image)

  renderCocktail(item){
    this.props.navigation.navigate('renderCocktail', {cocktail: item } )
  }

  _renderItem({item, index}) {
    return (
      <Card
      containerStyle={{ borderRadius: 10, marginBottom: 8 }}
      title={item.name.toUpperCase()}
      key={index}
      titleStyle={{
        fontWeight: 'bold',
            letterSpacing: 2,
          }}
      >
        <View
         style={[styles.imageContainer]}
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
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}
        >
          <TouchableHighlight
           onPress={() => this.props.navigation.navigate('userProfile', {userUid: item.uid})}
          >
            <View>
              <Image
               source={{ uri: item.userImage }}
               style={{ width: 50, height: 50, borderRadius: 50/2 }}
              />
            </View>
          </TouchableHighlight>
            <View
            >
            <Text
            style={{ fontSize: 15, fontWeight: 'bold'}}
            >{item.userName}</Text>
            </View>
        </View>
      </Card>
    )
  }

  render(){
    // console.log(this.state.cocktailList)
       if(this.state.cocktailList === null){
         return(
           <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
           >
             <Text>loading</Text>
           </View>
         )
       }else {
        return (
          <View
           style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
          >
           <FlatList
           data={this.state.cocktailList}
           renderItem={this._renderItem.bind(this)}
           keyExtractor={this._keyExtractor}
           />
          </View>
        )
       }
  }
}

const styles = {
  imageContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export default UserPersonalList
