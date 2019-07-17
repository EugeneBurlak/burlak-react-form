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
          console.log(scope);
          return new Promise((resolve, reject) => {
            resolve();
          });
        }}
        fields={[
          {
            name: 'checkbox',
            label: this.state.type,
            type: this.state.type,
            text: 'Checkbox',
            htmlAfter: {
              inline: true,
              html: ((scope) => {
                return(
                  <div onClick={() => {
                    console.log(scope)
                  }}>
                    dsds
                  </div>
                )
              })()
            }
          },
          {
            name: 'second',
            type: 'password',
            value: '',
            resetButton: {
              enable: true
            },
            switchButton: true
          },{
            type: 'button',

          },
          {
            name: 'select',
            label: 'ERROR',
            type: 'select',
            resetButton: {
              enable: true
            },
            options: [
              {
                value: 'first2second2',
                text: 'first text2'
              },
              {
                value: 'second2',
                text: 'second text2'
              },
              {
                value: 'third2',
                text: 'third text'
              }
            ],
            validation: checked => {
              if (!checked.length) return 'REQUIRED';
            }
          },
          {
            name: 'dsadadas',
            type: 'file',
            placeholder: '1'
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
