import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  ListView,
  TextInput,
 } from 'react-native';
  import { Button } from 'react-native-elements';
  import DynamicListRow from './dynamicListRow';
  import firebase from  'firebase';

  const data = [ {name: 1} ]

class InputScreen extends Component {
  constructor(props) {
    super(props);
    // this.updateListView = this.updateListView.bind(this);
    // this.toggleItemEnabled = this.toggleItemEnabled.bind(this);
    this.state = {
      data: data,
      dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 != row2}),
    listView: []
    };
  }



  componentWillMount(){
    const user = firebase.auth().currentUser
    const userUid = user.uid
    // this.state.listView
    // let newData = []
     // firebase.database().ref('user_cocktails').child(userUid).on('value', (snapshot) =>{
       // const cocktailList = snapshot.val()
            // const data = snapshot.val()
            // let newData = [ ...that.state.listView]
            // newData.push(data)
            // that.setState({ listView: newData })
          // })
  }

  componentDidMount() {
    this.updateListView(this.props.data)
  }

  updateListView(items) {

  }
  state = {
    loading: true,
       dataSource: new ListView.DataSource({
           rowHasChanged: (row1, row2) => true
       }),
       refreshing: false,
       data: data,
  }

  _renderRow(rowData) {
     // console.log('rowData')
    return (
      <View
       style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
      >
        <TextInput
        autoCapitalize='none'
        autoCorrect={false}
         style={{ width: 100, height: 50, borderWidth: 2, marginLeft: 14,
         borderColor: 'gray', marginTop: 8, borderRadius: 8  }}
        />
      </View>
    )
  }

  addData() {
    const data = this.state.data
    const Kiwi = {name: 'kiwi'}
    data.push(Kiwi);
    this.setState({ data: data,
                  dataSource:  this.state.dataSource.cloneWithRows(this.state.data)
                 })
  }
  render(){
    console.log(this.state.listView)
    return (
      <View
       style={styles.container}
      >
        <ListView
           horizontal={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
        />
        <Button
          title='add data'
          onPress={this.addData.bind(this)}
        />
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export default InputScreen
