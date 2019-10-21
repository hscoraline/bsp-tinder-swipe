
import React from 'react';
import {} from 'react-native';
import {createAppContainer, SafeAreaView} from 'react-navigation'
import {FluidNavigator} from 'react-navigation-fluid-transitions'
import MainScreen from './src/screens/MainScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';

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
  },
  FavoriteScreen: {
    screen: FavoriteScreen
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
