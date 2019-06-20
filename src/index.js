import React, { Component } from "react";
import ReactDOM from "react-dom";
import Form from "./Form";


class App extends Component{
  render(){
    return(
      <Form
        autoReset={true}
        onSubmit={(data) => {
          console.log(data);
          return new Promise((resolve, reject) => {
            resolve();
          })
        }}
        cols={[
          {
            name: 'first',
            width: 'half'
          },{
            name: 'second',
            width: 'half'
          }
        ]}
        fields={[
          {
            name: 'radios',
            label: 'ENTER_MESSAGE',
            type: 'checkbox',
            col: 'second',
            size: 1,
            value:['first'],
            options: [{
              value: 'first',
              text: 'first text'
            },{
              value: 'second',
              text: 'second text'
            },{
              value: 'third',
              text: 'third text'
            }],
            validation: (checked) => {
              if(!checked.length) return 'REQUIRED';
            }
          },
          {
            name: 'radios2',
            label: 'ERROR',
            type: 'select',
            col: 'second',
            multiple: true,
            options: [{
              value: 'first2',
              text: 'first text2'
            },{
              value: 'second2',
              text: 'second text2'
            },{
              value: 'third2',
              text: 'third text'
            }],
            validation: (checked) => {
              if(!checked.length) return 'REQUIRED';
            }
          },{
            name: 'dsadadas',
            type: 'file',
            col: 'second',
            placeholder: '1'
          },
          {
            value: 'SEND_MESSAGE',
            type: 'submit',
            col: 'second'
          }
        ]}
      />
    )
  }
}


ReactDOM.render(<App />, document.getElementById("root"));

export default Form;