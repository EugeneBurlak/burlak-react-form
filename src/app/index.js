import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from '../package';
class App extends Component {
  constructor() {
    super();
    this.state = {
      type: 'text'
    };
  }
  render() {
    return (
      <Form
        styled
        autoReset={true}
        ref="form"
        onSubmit={(data, scope) => {
          console.log(data);
        }}
        fields={[
          {
            name: 'text',
            type: 'text',
            validation: (e) => {
              if(!e) return 's'
            }
          },
          {
            type: 'fields',
            fields: [
              {
                name: 'text2',
                type: 'text'
              },
              {
                type: 'fields',
                fields: [{
                  type: 'text',
                  name: 'text3'
                },{
                  type: 'fields',
                  fields: [{
                    name: 'text4',
                    type: 'password',
                    switchButton: {
                      enable: true
                    }
                  }]
                }]
              }
            ]
          },
          {
            value: 'SEND_MESSAGE',
            type: 'submit',
            col: 'second'
          }
        ]}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
