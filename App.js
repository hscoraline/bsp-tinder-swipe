
import React, {Fragment} from 'react';
import {} from 'react-native';
import {createAppContainer, SafeAreaView} from 'react-navigation'
import {FluidNavigator, Transition} from 'react-navigation-fluid-transitions'
import MainScreen from './src/screens/MainScreen';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <AppContainer/>
    </SafeAreaView>
  );
};

const RootStack = FluidNavigator({
  MainScreen: {
    screen: MainScreen
  }
},
  {
    initialRouteName: 'MainScreen',
    defaultNavigationOptions: {
      header: null
    },
  })

  const AppContainer = createAppContainer(RootStack)


export default App;
