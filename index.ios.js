/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import TestComponent from './src/TestComponent';

export default class dynamicformmobile extends Component {
  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
           Welcome to iOS DynamicForm-Render!
        </Text>
        <TestComponent/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome:{
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions:{
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('dynamicformmobile', () => dynamicformmobile);
