import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from '../package';
class App extends Component {
  render() {
    return (
      <Form
        styled
        autoReset={true}
        onSubmit={data => {
          console.log(data);
          return new Promise((resolve, reject) => {
            resolve();
          });
        }}
        fields={[
          {
            name: 'checkbox',
            label: 'ENTER_MESSAGE',
            type: 'checkbox',
            validation: checked => {
              if (!checked) return 'REQUIRED';
            }
          },
          {
            name: 'second',
            type: 'textarea',
            text: 'second text',
            value: '',
            resetButton: {
              enable: true
            }
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
