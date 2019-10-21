import React, { Component } from 'react';
import {  View, Text, StyleSheet, SafeAreaView, Image, Dimensions, FlatList,TouchableOpacity} from 'react-native';
import MyStatusBar from '../components/MyStatusBar';

export default class FavoriteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        
    };
  }
  
  render() {

    const { params } = this.props.navigation.state;
    let listFavorite = params.data;

    return (
      <SafeAreaView style={{flex: 1}}>
        <MyStatusBar/>
        <View style={style.Wrapper}>
            <View style={[{height: '15%', backgroundColor:'#F62459', justifyContent:'center', alignItems:'center'}]}>
                    <Image style={{width:180, height:60, marginTop:50}} source={require("../images/logo.png")}></Image>
            </View>

            <View style={[style.CenterPanel]}>
                <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}}>
                <Text style={{fontSize: 30, color: "#F62459"}}>{"back"}</Text>
                </TouchableOpacity>

                <FlatList data={
                    listFavorite
                } 
                contentContainerStyle={{
                    marginTop: 10
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({item})=>
                    <View style={{width: '100%', height: 100, flexDirection:'row', alignItems: 'center'}}>
                        <Image style={{width: 80, height: 80, borderRadius: 80*2}} source={{uri: item.picture}}></Image>
                        <Text style={{flex: 1, fontSize: 25, paddingLeft: 30}} >{item.name.first }</Text>
                    </View>
                }
                keyExtractor={item => item.md5}
                />
            </View>
        </View>
      </SafeAreaView>
    );
  }
}


class UserItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            
        };
      }
}



const style = StyleSheet.create({
    Wrapper:{
        flex: 1,
        backgroundColor: '#F62459',
        flexDirection: 'column'
    },
    CenterPanel:{
        backgroundColor: 'white',
        marginTop:10,
        width: '90%',
        height: '80%',
        borderRadius: 20,
        alignSelf: 'center',
        flexDirection: 'column',
        padding: 20
    }
})

