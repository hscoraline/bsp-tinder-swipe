import React, { Component } from 'react';
import { StatusBar } from 'react-native';

export default class MyStatusBar extends Component{
    render(){
        return(
            <StatusBar backgroundColor='#F62459' barStyle="light-content" />
            )
    }
}

