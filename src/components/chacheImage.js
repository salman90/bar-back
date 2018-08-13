import React from 'react';
import { Image } from 'react-native';
import shorthash from 'shorthash';
import SHA1 from "crypto-js/sha1";
import { FileSystem } from 'expo';
import md5 from 'js-md5';
import _ from 'lodash'

const BASE_DIR = `${FileSystem.cacheDirectory}expo-image-cache/`;

export default class CacheImage extends React.Component {
  state = {
    source: null,
  };


  async componentDidMount() {
    // console.log('in cache')
    const { uri } = this.props;
    // console.log(uri)
    const filename = uri.substring(uri.lastIndexOf("/"), uri.indexOf("?") === -1 ? uri.length : uri.indexOf("?"));
    // console.log(filename)
    const ext = filename.indexOf(".") === -1 ? ".jpg" : filename.substring(filename.lastIndexOf("."));
    const path = `${BASE_DIR}${SHA1(uri)}${ext}`;
    const tmpPath = `${BASE_DIR}${SHA1(uri)}-${_.uniqueId()}${ext}`;
    // console.log(tmpPath)
    // console.log(tmpPath)
    try {
       await FileSystem.makeDirectoryAsync(BASE_DIR);
     } catch (e) {
       // console.log(e)
     }
    const info = await FileSystem.getInfoAsync(path);
    // console.log(info)
    // console.log(info)
    const {exists} = info;
    // console.log(info)

    if(exists){
      console.log('exists')
      this.setState({
      source: {
        uri: path
      }})
      return
    }
    // console.log('download image')

    await FileSystem.downloadAsync(uri, tmpPath);
    await FileSystem.moveAsync({ from: tmpPath, to: path });
     this.setState({
       source: {
         uri: path
       }
     });
  };
  render() {

    return <Image style={this.props.style} source={this.state.source} />;
  }
}
