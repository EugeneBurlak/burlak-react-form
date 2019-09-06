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
    let { error } = this.state;
    return (
      <Form
        theme="dark"
        autoReset={true}
        ref="form"
        statusIcon={{
          enable: true,
          success: true,
          error: true
        }}
        title={{
          text: 'Login',
          htmlAfter: (() => {
            return <div>2</div>;
          })()
        }}
        onSubmit={(data, scope) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              console.log(data);
              resolve();
            }, 1000)
          });
        }}
        fields={[
          {
            name: 'text',
            type: 'text',
            label: 'Phone',
            value: '199999',
            mask:'0000',
            validation: (e) => {
              if(!e) return 'sss'
            }
          },
          {
            type: 'radio',
            name: 'checkbox11',
            inline: true,
            options: [{
              value: '1',
              text: '1'
            },{
              value: '2',
              text: '2'
            }],
            validation: (e) => {
              if(!e) return 'sss'
            }
          },{
            type: 'select',
            name: 'select',
            options: [{
              value: '',
              text: '1'
            },{
              value: '1',
              text: '1 dsa dsa dsa dsds dsa dsa dsa ds ddsds dsa dsa dsa ds ddsds dsa dsa dsa ds das dsa '
            },{
              value: '2',
              text: '2'
            }],
            resetButton:{
              enable: true
            },
            validation: (e) => {
              if(!e) return 'sss'
            }
          },
          {
            value: 'Sign in',
            type: 'submit',
            htmlAfter: {
              html: () => {
                return error ? error : null;
              },
              error: true
            }
          }
        ]}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
