import React, { Component } from "react";
import ReactDOM from "react-dom";
import Form from "./export.js";

class App extends Component{
  render(){
    return (
      <div>
        <Form
            onSubmit={(data) => {
              console.log(data);
              return new Promise((resolve, reject) => {
                resolve();
              })
            }}
            fields={[
              {
                name: 'radios',
                label: 'ENTER_MESSAGE',
                type: 'select',
                col: 'second',
                size: 1,
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
                validation: (array) => {
                  if(!array.length) return 'REQUIRED';
                }
              },
              {
                value: 'SEND_MESSAGE',
                type: 'submit',
                col: 'second'
              }
            ]}
          />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"));