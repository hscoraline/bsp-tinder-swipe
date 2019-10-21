import React, { Component } from 'react';
import {  View, Text, StyleSheet, Modal, ActivityIndicator, SafeAreaView, Image, Animated, PanResponder, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import {BASE_URL} from '../utilities/APIConfig'
import { Easing } from 'react-native-reanimated';
import MyStatusBar from '../components/MyStatusBar';

//
import tab_avatar_select from '../images/tab_avatar_selected.png'
import tab_avatar_unselect from '../images/tab_avatar_unselect.png'
import tab_account_select from '../images/tab_account_selected.png'
import tab_account_unselect from '../images/tab_account_unselect.png'
import tab_calendar_select from '../images/tab_calendar_selected.png'
import tab_calendar_unselect from '../images/tab_calendar_unselect.png'
import tab_phone_select from '../images/tab_phone_selected.png'
import tab_phone_unselect from '../images/tab_phone_unselect.png'
import tab_place_select from '../images/tab_place_selected.png'
import tab_place_unselect from '../images/tab_place_unselect.png'


const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentUser : null,
        secondUser: null,
        isProgress: false,
        swipe: 0
    };
  }

  

    componentDidMount(){
        this.getNewUser()
        this.getNewUser2()
    }

    nextUser = () =>{
        this.setState({
            currentUser : this.state.secondUser
        })

        this.getNewUser2()
    }

    like=()=>{
        this.refs.currentCard.like()
    }

    nope=()=>{
        this.refs.currentCard.nope()
    }

    getNewUser = async () => {
        return fetch(BASE_URL+"0.4/?randomapi")
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({currentUser: responseJson.results[0].user,
            })

        return responseJson;
        })
        .catch((error) => {
            console.error(error);
        });
    }

    getNewUser2 = async () => {
        return fetch(BASE_URL+"0.4/?randomapi")
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({secondUser: responseJson.results[0].user,
            })

        return responseJson;
        })
        .catch((error) => {
            console.error(error);
        });
    }

  render() {
    return (
      this.state.isProgress ? <CustomProgressBar />:

      <SafeAreaView style={{flex: 1}}>
        <MyStatusBar/>
        <View style={style.Wrapper}>
            <View style={[{height: '15%', backgroundColor:'#F62459', justifyContent:'center', alignItems:'center'}]}>
                <Image style={{width:180, height:60, marginTop:50}} source={require("../images/logo.png")}></Image>
            </View>

            <View style={[style.CenterPanel]}>

                <MyCard user={this.state.secondUser} parent={this} />
                <MyCard ref='currentCard' user={this.state.currentUser} parent={this} />

                <View style={{width: '100%', height: 120, position:'absolute', bottom: 0, zIndex:99}}>

                    <TouchableOpacity onPress={()=>{this.like()}}>
                    <Image style={{width: 60, height: 60, position: 'absolute',top: 30, left: 80, zIndex: 999}} source={require('../images/ic_nope.png')}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{this.nope()}}>
                    <Image style={{width: 60, height: 60, position: 'absolute',top: 30, right: 80, zIndex: 999}} source={require('../images/ic_like.png')}/>
                    </TouchableOpacity>

                </View>
            </View>

        </View>
      </SafeAreaView>
    );
  }
  
  
}


class MyCard extends Component {

    constructor(props) {
      super(props);
      this.state = {
          aboutTabSelected: true,
          birthDayTabSelected: false,
          addressTabSelected: false,
          phoneTabSelected: false,
          accountTabSelected: false,
          currentTab: TabType.ABOUT,
      };

      this.currentUser = this.props.user
      this.animatedValue = new Animated.Value(0)
      this.position = new Animated.ValueXY()

      this.rotate = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp'
      })
  
      this.rotateAndTranslate = {
        transform: [{
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
        ]
      }
  
      this.likeOpacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
      })

      this.dislikeOpacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp'
      })

    }

    componentWillMount(){
        this.PanResponder = PanResponder.create({

            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
      
              this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
            },
            onPanResponderRelease: (evt, gestureState) => {

              if (gestureState.dx > 250) {
                this.props.parent.nextUser();
                Animated.spring(this.position, {
                  toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
                }).start()
              }
              else if (gestureState.dx < -250) {
                this.props.parent.nextUser();

                Animated.spring(this.position, {
                  toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
                }).start()
              }
              else {
                Animated.spring(this.position, {
                  toValue: { x: 0, y: 0 },
                  friction: 4
                }).start()
              }
            }
          })
    }

    componentDidMount(){
        this.animateVisible()
    }


    like = ()=>{
        Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(()=>{
              this.props.parent.nextUser()
          })
    }

    nope = ()=>{
        Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(()=>{
            this.props.parent.nextUser()
        })
    }

    setTabChecked = (tabType)=>{
        console.log(tabType);
        switch(tabType){
            case TabType.ABOUT:{
                this.setState({
                    aboutTabSelected: true,
                    addressTabSelected: false,
                    birthDayTabSelected: false,
                    accountTabSelected: false,
                    phoneTabSelected: false,
                    currentTab: TabType.ABOUT
                })
                break;
            }
            case TabType.ADDRESS:{
                this.setState({
                    aboutTabSelected: false,
                    addressTabSelected: true,
                    birthDayTabSelected: false,
                    accountTabSelected: false,
                    phoneTabSelected: false,
                    currentTab: TabType.ADDRESS

                })
                break;
            }
            case TabType.BIRTHDAY:{
                this.setState({
                    aboutTabSelected: false,
                    addressTabSelected: false,
                    birthDayTabSelected: true,
                    accountTabSelected: false,
                    phoneTabSelected: false,
                    currentTab: TabType.BIRTHDAY

                })
                break;
            }
            case TabType.ACCOUNT:{
                this.setState({
                    aboutTabSelected: false,
                    addressTabSelected: false,
                    birthDayTabSelected: false,
                    accountTabSelected: true,
                    phoneTabSelected: false,
                    currentTab: TabType.ACCOUNT

                })
                break;
            }
            case TabType.PHONE:{
                this.setState({
                    aboutTabSelected: false,
                    addressTabSelected: false,
                    birthDayTabSelected: false,
                    accountTabSelected: false,
                    phoneTabSelected: true,
                    currentTab: TabType.PHONE

                })
                break;
            }
        }
        
    }
  
    animateVisible () {
        this.animatedValue.setValue(0)
        Animated.timing(
          this.animatedValue,{
            toValue: 1,
            duration: 300,
            easing: Easing.linear
          }
        ).start()
    }

    render() {
        
        const opacity = this.animatedValue.interpolate({
            inputRange: [0 ,1],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })

        const scale = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
            extrapolate: 'clamp'
        })

        if(this.props.user != null){
            if(this.position.x != 0){
                this.position.setValue({x: 0, y: 0})
            }
            return (
                <Animated.View
                {...this.PanResponder.panHandlers}
                 style={[{
                      opacity: opacity,
                      transform: [{ scale: scale}],
                    },this.rotateAndTranslate,style.Card]} >
                        
                    <Animated.View style={{ opacity: this.likeOpacity, position: 'absolute', top: 5, left: 15, zIndex: 1000 }}>
                    <Text style={{ color: 'green', fontSize: 25, fontWeight: '800', padding: 10 }}>LIKE</Text>
                    </Animated.View>

                    <Animated.View style={{ opacity: this.dislikeOpacity, position: 'absolute', top: 5, right: 15, zIndex: 1000 }}>
                    <Text style={{ color: 'red', fontSize: 25, fontWeight: '800', padding: 10 }}>NOPE</Text>
                    </Animated.View>
      
                    <View style={{height: 140, width: '100%', backgroundColor: '#ecf0f1', borderTopLeftRadius:20, borderTopRightRadius: 20}}></View>
                    <View style={{width:180, height:180, backgroundColor: 'white' ,justifyContent: 'center', alignItems: 'center', position:'absolute', top:50, borderRadius: 180*2, borderWidth: 1, borderColor: 'gray'}}>
                        <Image style={{width:170, height:170, borderRadius: 170*2}} source={{uri: this.props.user.picture}}/>
                    </View>
                    <View style={[{height: '45%', width: '100%', position: 'absolute', bottom: 0, flexDirection:'column', alignItems:'center'}]}>
                        
                        <TabDetail user={this.props.user} type={this.state.currentTab}></TabDetail>
                        <View style={{width: '100%', height:60, position: 'absolute', bottom:20, flexDirection:'row', justifyContent:'space-around', alignItems: 'center'}}>
                            <TabIcon tabType={TabType.BIRTHDAY} isSelected={this.state.birthDayTabSelected} parent={this}/>
                            <TabIcon tabType={TabType.ADDRESS} isSelected={this.state.addressTabSelected} parent={this}/>
                            <TabIcon tabType={TabType.ABOUT} isSelected={this.state.aboutTabSelected} parent={this}/>
                            <TabIcon tabType={TabType.PHONE} isSelected={this.state.phoneTabSelected} parent={this}/>
                            <TabIcon tabType={TabType.ACCOUNT} isSelected={this.state.accountTabSelected} parent={this}/>
                        </View>
                    </View>
                </Animated.View>
            );
        } else {
            return (
                <ActivityIndicator style={{position: 'absolute',}} size="large" />            
                )
        }

    }
}

class TabIcon extends Component {
    constructor(props) {
        super(props);
       
    }

    renderImage() {
        var imgSource = null;

        switch(this.props.tabType){
            case TabType.ABOUT: imgSource = this.props.isSelected? tab_avatar_select : tab_avatar_unselect
            break
            case TabType.ACCOUNT: imgSource = this.props.isSelected? tab_account_select : tab_account_unselect
            break
            case TabType.ADDRESS: imgSource = this.props.isSelected? tab_place_select : tab_place_unselect
            break
            case TabType.BIRTHDAY: imgSource = this.props.isSelected? tab_calendar_select : tab_calendar_unselect
            break
            case TabType.PHONE: imgSource = this.props.isSelected? tab_phone_select : tab_phone_unselect
            break
        }

        return (
          <Image
            style={{width: 40, height: 40}}
            source={ imgSource }
          />
        );
    }

    _setSelected = () =>{
        this.props.parent.setTabChecked(this.props.tabType)
    }

    render(){
        return(
            <TouchableOpacity onPress={()=>{this._setSelected()}}>
                {this.renderImage()}
            </TouchableOpacity>
        )
    }
}

class TabDetail extends Component{
    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0)
        this.state = {
        };
    }

    capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    componentDidMount(){
        this.animateVisible()
    }

    componentDidUpdate(){
        // this.animateVisible()
    }

    animateVisible () {
        this.animatedValue.setValue(0)
        Animated.timing(
          this.animatedValue,
          {
            toValue: 1,
            duration: 500,
            easing: Easing.linear
          }
        ).start()
    }

    _renderTab(){

        let text1 = ""
        let text2 = ""

        switch (this.props.type) {
            case TabType.ABOUT:{
                text1 = this.capitalize("My name is")
                text2 = this.capitalize(this.props.user.name.first + " " + this.props.user.name.last)
                break;
            }
            case TabType.ADDRESS:{
                text1 = this.capitalize("My address is")
                text2 = this.capitalize(this.props.user.location.street)
                break;
            }
            case TabType.BIRTHDAY:{
                text1 = this.capitalize("My birthday is")
                text2 = this.capitalize("25/08/1997")
                break;
            }
            case TabType.PHONE:{
                text1 = this.capitalize("My phone number is")
                text2 = this.capitalize(this.props.user.phone)
                break;
            }
            case TabType.ACCOUNT:{
                text1 = this.capitalize("My account is")
                text2 = this.capitalize(this.props.user.username)
                break;
            }
        }

        const opacity = this.animatedValue.interpolate({
            inputRange: [0 ,1],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })

        return(
            <Animated.View style={[{opacity: opacity},{flex: 1, alignItems:'center'}]}>
                <Text style={{fontSize:23}}>{text1}</Text>
                <Text style={{fontSize:33, color:'#F62459'}}>{text2}</Text>
            </Animated.View>
        )
    }

    render() {
      return (
        this._renderTab()
      )
    };
}



const style = StyleSheet.create({
    Wrapper:{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    CenterPanel:{
        flex: 1,
        backgroundColor:'#F62459',
        justifyContent: 'center',
        alignItems: 'center'
    },
    Card:{ 
        width:'80%', 
        height: 450, 
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection:'column',
        borderRadius: 20,
        position:'absolute',
        bottom: 150
    }
})


const TabType = {
    ABOUT: 'about',
    BIRTHDAY: 'birthday',
    ADDRESS: 'address',
    PHONE: 'phone',
    ACCOUNT: 'account'
}

