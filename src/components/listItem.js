import React from 'react';
import { View, Text, TouchableHighlight, Alert, StatusBar } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import CacheImage from '../components/chacheImage';
import firebase from 'firebase';
import _ from 'lodash';




class ListItem extends React.PureComponent {
    constructor(props) {
      super(props);
      this.renderRemoveFromList = this.renderRemoveFromList.bind(this)
      this.deleteListItem = this.deleteListItem.bind(this)
      this.deleteCockotail = this.deleteCockotail.bind(this)
      this.confirmDelete = this.confirmDelete.bind(this)
      this.renderPlus = this.renderPlus.bind(this)
    }

    renderPlus = (post) => () => {
      const userUid = this.props.user.uid
      const postKey = post._key
      const name = post.name
      const image = post.image
      const steps = post.steps
      const uid  = post.uid
      const userImage = post.userImage
      const userName  = post.userName
      const ingredients = post.ingredients
          firebase.database().ref('user_cocktails').child(userUid).child(postKey).set({
           name: name,
           image: image,
           steps: steps,
           uid: uid,
           ingredients: ingredients,
           userImage: userImage,
           userName: userName,
           _key: postKey,
         }, (error) => {
           if(error){
             alert('could not add to the list try again' + error)
           }else{
             // this.renderAnimation()
             alert('saved to list')
           }
         })
    }

     async likedCocktail(item) {
       // console.log('whyyyyyy')
       const userUid = this.props.user.uid
       console.log(userUid)
       const itemUid = item.uid
       console.log(itemUid)
      if(userUid === itemUid){
        alert("can't like your own post")
      }else{
         console.log('in else');
        const itemKey = item._key
        // console.log(item._key)
        firebase.database().ref('likes').child(itemKey).once('value', snap => {
          let data = snap.val() || {}
          let likeUids = Object.keys(data)
          const likeInArray =  _.includes(likeUids, userUid)
            if(likeInArray === false ){
              console.log('in +1')
              const ref = firebase.database().ref()
                  let likesUpdate = {}
                 likesUpdate[`${itemKey}/${userUid}`] = true
                 ref.child('likes').update(likesUpdate)
                 ref.child('cocktail_list').child(itemKey).update({
                   numberOfLikes: item.numberOfLikes + 1
                 })
           }else {
             // console.log('in -1')
             firebase.database().ref('likes').child(itemKey).child(userUid).remove()
               firebase.database().ref('cocktail_list').child(itemKey).update({
                 numberOfLikes: item.numberOfLikes - 1
               })
           }
        })
      }
    }

    renderRemoveFromList = (item) => () => {
        const userUid = this.props.user.uid
        const cocktailUid = item._key
        const cocktailName = item.name
        Alert.alert(
          'Delete',
          `Are you sure you want to remove item ${cocktailName}?`,
          [
            {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
            {text: 'Yes', onPress: this.deleteListItem(userUid, cocktailUid) },
          ]
        )
    }

    deleteListItem = (userUid, cocktailUid) => () => {
      const Uid = firebase.auth().currentUser.uid
      // console.log(Uid)
      // firebase.database().ref()
      // firebase.auth().currentUser
      // console.log(userUid, cocktailUid)
      firebase.database().ref('user_cocktails').child(userUid).child(cocktailUid).remove()
    }

    confirmDelete = (item) => () => {
      firebase.database().ref('cocktail_list').child(item._key).remove()
    }

    deleteCockotail = (item) => () => {
      Alert.alert(
        'Delete',
        `Are you sure you want to delete ${item.name}?` ,
        [
          {text: 'Yes', onPress: this.confirmDelete(item)},
          {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
        ],
        { cancelable: false }
      )
    }


  renderIcons = (navigation, item) => {
    if(navigation.state.routeName === 'userPersonalList'){
      return (
        <View
         style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10}}
         >
           <Icon
            type='font-awesome'
            name='times-circle'
             size={25}
             onPress={this.renderRemoveFromList(item)}
            />
        </View>

      )
    }else if(navigation.state.routeName === 'cocktailList'){
      const userUid = this.props.user.uid
      const itemUid = item.uid
      if(userUid === itemUid){
        return (
          <View
            style={{ justifyContent: 'center', justifyContent: 'space-around',flexDirection: 'row', marginTop: 5 }}
          >
          <StatusBar
            hidden={true}
          />
          <View
          >
            <Icon
             name='trash'
             size={20}
            type='font-awesome'
            onPress={this.deleteCockotail(item)}
            />
          </View>
          <View
          style={{ flexDirection: 'row' }}
          >
            <Icon
             name='thumbs-up'
             size={20}
              type='font-awesome'
              onPress={this.likedCocktail.bind(this, item)}
            />
            <Text>{item.numberOfLikes}</Text>
          </View>
        </View>
        )
      }else {
          return (
            <View
             style={{flexDirection: 'row', marginTop: 10,  justifyContent: 'space-around', marginTop: 5}}
            >
              <View
              style={{flexDirection: 'row', marginTop: 10}}
              >
                <Icon
                 name='plus-square'
                 type='font-awesome'
                 size={25}
                 onPress={this.renderPlus(item)}
                />
              </View>
              <View
              style={{ marginTop: 10, flexDirection: 'row'}}
              >
                <Icon
                 name='thumbs-up'
                 size={20}
                  type='font-awesome'
                  onPress={this.likedCocktail.bind(this,item)}
                />
                <Text>{item.numberOfLikes}</Text>
              </View>
            </View>
          )
      }
    }
  }
  render(){
    const { item, navigation, pageName, cocktailPage, user} = this.props
    return(
      <Card
       containerStyle={{ borderRadius: 10, marginBottom: 8 }}
       key={item.uid}
       titleStyle={{
         fontWeight: 'bold',
             letterSpacing: 2,
           }}
      >

          <View
           style={[styles.imageContainer]}
          >
           <CacheImage
           uri={item.image}
           style={{ width: 300, height: 200, borderRadius: 10 }}
           />
          </View>
       <View
        style={{ alignItems: 'center', justifyContent: 'center', marginTop: 8}}
       >
         <Text
          style={{ fontSize: 15, fontWeight: '500', letterSpacing: 2 }}
         >{item.name}</Text>
       </View>
        <View
         style={{ marginTop: 10}}
        >
          <Button
             title='View Details'
             buttonStyle={{ borderRadius: 10 , backgroundColor: '#3B5998'}}
             onPress={() => navigation.navigate(cocktailPage, {cocktail: item})}
          />
        </View>
         {this.renderIcons(navigation, item)}
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}
          >
          <TouchableHighlight
           onPress={() => navigation.navigate(pageName, {userUid: item.uid} )}
          >
            <View>
             <CacheImage
              uri={item.userImage}
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
}

const styles = {
  imageContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export default ListItem
