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
        theme="modernDark"
        autoReset={true}
        ref="form"
        title={{
          text: 'Login',
          htmlAfter: (() => {
            return <div>2</div>;
          })()
        }}
        onSubmit={(data, scope) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (error) resolve('Success');
              else reject('Error!');
            }, 3000);
          })
            .then(() => {
              this.setState({
                error: error
              });
            })
            .catch(error => {
              this.setState({
                error: error
              });
            });
        }}
        fields={[
          {
            name: 'text',
            type: 'text',
            label: 'Name',
            mask: '000',
            validation: e => {
              if (e !== '2') return 'Need 2';
            },
            statusIcon: {
              enable: true
            }
          },
          {
            label: 'Password',
            type: 'password',
            name: 'password',
            validation: e => {
              if (e !== '2') return 'Need 2';
            },
            switchButton: {
              enable: true
            }
          },
          {
            type: 'textarea',
            name: '1',
            resetButton: {
              enable: true
            }
          },
          {
            type: 'select',
            name: 'select',
            options: [
              {
                text: '221',
                value: ''
              },
              {
                text: '1',
                value: '1'
              },
              {
                text: '2',
                value: '2 '
              }
            ]
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
          },
          {
            type: 'radio',
            name: '22',
            inline: true,
            options: [
              {
                value: '1',
                text: '2'
              },
              {
                value: '2',
                text: '2'
              }
            ]
          },
          {
            type: 'checkbox',
            text: 'Remeber me',
            name: 'remember_me'
          }
        ]}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
