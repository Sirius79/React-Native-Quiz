import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,FlatList,Button } from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';

import * as firebase from 'firebase';
import {getDatabase} from './database';


export default class TeacherSelect extends React.Component {
  
  constructor(props){
    super(props);
    this.sclass = this.props.navigation.state.params.class;
    this.sub = this.props.navigation.state.params.sub;
    var db = '/class/'+this.sclass+'/'+this.sub;
    this.qset = getDatabase().ref(db);
    this.state={
      ques:'',
      c:''
    }
  }

  componentDidMount(){
    this.listenForQues(this.qset);
  }
  listenForQues(qset){
    qset.on('value',(dataSnapshot)=>{
      var ques =[];
      var c =0;
      dataSnapshot.forEach((child)=>{
        if (c>0){
          ques.push({
            no:c,
          });
        }
        c=c+1;
      });
      
      this.setState({
        ques:ques,
        c:c
      })


    });
  }
   static navigationOptions = {
    title: 'Welcome ${navigation.state.params.screen}',
  }		
  render() {
    console.log(this.state.ques);
    const { navigate } = this.props.navigation;
    return (
      <View>
        <FlatList data={this.state.ques} renderItem={({item})=><TouchableOpacity onPress={()=>navigate("TeacherQuestion",{class:this.sclass,sub:this.sub,c:item.no})}><Text>Quiz No. {item.no}</Text></TouchableOpacity>}/>
        <TouchableOpacity onPress={()=> navigate("Add",{class:this.sclass,sub:this.sub,c:this.state.c}) }><Text>Add Quiz</Text></TouchableOpacity>
      </View>
    );
  }
}