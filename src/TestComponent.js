/**
 * Created by dreamcatchernick on 06/07/2017.
 */
import React from 'react';
import {View} from 'react-native';
import {Button} from 'antd-mobile';

export default class TestComponent extends React.Component{
    render(){
        return(
            <View>
                <Button type="primary">Hello</Button>
            </View>
        );
    }
}
