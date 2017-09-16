import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import { FormLabel, FormInput } from 'react-native-elements' 
import Menu from './Menu';


const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    padding: 10,
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class Option extends React.Component{
  constructor(props){
    super(props);
    this.state={
      optionData:this.props.value[this.props.num - 1]
    }
  }
  formChange(text){
    this.setState({
      optionData:text
    });
    this.props.onFormChange(this.props.num,text);
  }
  removeOption(){
    this.props.removeOption(this.props.num);
    this.setState({
      optionData: this.props.value[this.props.num - 1]
    })
  }
  render(){
    return(
      <View>        
        <TouchableOpacity onPress={()=> this.removeOption()}><FormLabel>Option {this.props.num}: </FormLabel></TouchableOpacity>
        <FormInput value={this.state.optionData} onChangeText={(text) => this.formChange(text)}/>
      </View>
    );
  }
}
class QForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.props.data || {
      question:"",
      optionData: [""],
      correctOption:"",
      numOptions:1
    };
  }
  addOption(){
    let optionsData = this.state.optionData;
    optionsData.push("");
    this.setState({
      numOptions:this.state.numOptions+1,
      optionData: optionsData
    })
  }
  removeOption(num){
    let optionsData = this.state.optionData;
    optionsData.splice(num-1,1);
    this.setState({
      numOptions:this.state.numOptions-1,
      optionData: optionsData
    })
  }
  resetForm(){
    this.setState({
      numOptions:1,
      optionData: [""]
    })
  }
  clearForm(){
    let optionsData=this.state.optionData;
    for(i in optionsData){
      optionsData[i]="";
    }
    this.setState({
      optionData: optionsData
    })
  }
  formChange(num,text){
    let optionsData=this.state.optionData;
    optionsData[num-1]=text;
    this.setState({
      optionData:optionsData
    },()=>{this.props.onChange(this.state,this.props.qnum)});
  }
  _onPressButton(){
    let ques = this.state.question;
    let options = this.state.optionData;
    let correct = this.state.correctOption;

    fetch('http://192.168.1.102:3000/ques_upload', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'ques': ques,
         'options': options,
         'correct': correct
       }
    })
    .then((response) => {       
       this.setState({
          res: response._bodyText
       })
    })
    .catch((error) => {
       console.error(error);
    });

  }
  render() {
    let options=[];
    for(let i=1;i <= this.state.numOptions;i++){
      options.push(<Option key={i} num={i} removeOption={(num)=> this.removeOption(num)} value={this.state.optionData} onFormChange={this.formChange.bind(this)}/>)
    }
    return (
    <View>
      <View>
        <Text style={{fontSize:20,marginLeft:18}}>Question No. {this.props.qnum}</Text>
        <TouchableOpacity onPress={this.resetForm.bind(this)} style={{position:'absolute',right:20,top:3}}>
          <Text style={{fontSize:18,fontWeight: "300"}}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.clearForm.bind(this)} style={{position:'absolute',right:80,top:3}}>
          <Text style={{fontSize:18,fontWeight: "300"}}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FormLabel>Question: </FormLabel>
      <FormInput value={this.state.question} onChangeText={(text) => { this.setState({question: text},()=>{this.props.onChange(this.state,this.props.qnum)})}}/>
      {options}
      <View>
        <TouchableOpacity onPress={this.addOption.bind(this)}>
          <Text style={{fontSize:14,fontWeight: "300"}}>      Add an Option</Text>
        </TouchableOpacity>
      </View>
      <FormLabel>Correct Option/s(enter indices, comma separated if multiple): </FormLabel>
      <FormInput value={this.state.correctOption} onChangeText={(text) => this.setState({correctOption: text},()=>{this.props.onChange(this.state,this.props.qnum)})}/>
    </View>         
    );
  }
}
export default class Basic extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      currentQuestion: 1,
      questions: [],
      numQuestions: 1
    };
  }
  componentWillMount(){
    let qs = this.state.questions;
    qs.push(undefined)
     this.setState({
      questions:qs
    })
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  handleChange(data,index){
    let qs = this.state.questions;
    qs[index - 1]=data;
    this.setState({
      questions:qs
    });
  }
  addQuestion(){
    let qs = this.state.questions;
    qs.push(undefined);
    this.setState({
      numQuestions:this.state.numQuestions+1,
      questions:qs
    });
  }
  handleMenuItemClick(val){
    this.setState({
      currentQuestion:val,
      isOpen: !this.state.isOpen
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item,
    });

  render() {
    const menu = <Menu onItemSelected={this.onMenuItemSelected} addQuestion={this.addQuestion.bind(this)} numQuestions={this.state.numQuestions} onMenuItemClick={this.handleMenuItemClick.bind(this)}/>;
    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}
      >
        <View style={{height:'100%',backgroundColor:'white'}}>
          <ScrollView style={{backgroundColor:'white',position:'absolute',top:20,height:'100%'}}>
          <QForm key={this.state.currentQuestion-1} data={this.state.questions[this.state.currentQuestion-1]} onChange={(data,index)=>this.handleChange(data,index)} qnum={this.state.currentQuestion}/>
          </ScrollView>
        </View>
      </SideMenu>
    );
  }
}