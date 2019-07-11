import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form';
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
              name: 'radios',
              label: 'ENTER_MESSAGE',
              type: 'radio',
              value: 'first',
              inline: true,
              resetButton: {
                enable: true
              },
              options: [
                {
                  value: 'first',
                  text: 'first text'
                },
                {
                  value: 'second',
                  text: 'second text'
                },
                {
                  value: 'third',
                  text: 'third text'
                }
              ],
              validation: checked => {
                if (!checked.length) return 'REQUIRED';
              }
            },
            {
              name: 'select',
              label: 'ERROR',
              type: 'select',
              multiple: true,
              value: ['second2', 'first2second2'],
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
              placeholder: '1',
              disabled: true,
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

export default Form;
