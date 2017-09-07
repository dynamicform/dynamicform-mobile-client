/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from "react";
import {AppRegistry, StyleSheet} from "react-native";
import {Provider} from "react-redux";
import store from "./public/store/store";
import DynamicForm from "./src/components/DynamicForm";

export default class dynamicformmobile extends Component{
  onSuccess(response){
    console.log('回调函数onSuccess',response);
  }
  onError(error){
    console.log('回调函数onError',error)
  }
  render() {
    return (
        <Provider store={store}>
          <DynamicForm
              formDefinitionSrc="http://172.31.0.81:3000/api/getdefinition/yekangMobile"
              onSuccess={this.onSuccess}
              onError={this.onError}
          />
        </Provider>
    );
  }
}

// http://172.16.36.31:3000/api/getdefinition/Qyijie
// http://172.16.36.31:3000/api/getdefinition/qone-form
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
