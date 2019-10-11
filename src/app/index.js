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
        statusIcon={{ enable: false }}
        theme={'dark'}
        ref="form"
        fields={[
          {
            type: 'fields',
            fields: [
              {
                name: 'first_name',
                type: 'text',
                mask: '+0020',
                value: '+3323',
                validationOnBlur: true,
                placeholder: 'First name',
                width: 'half',
                validation: e => {
                  return 'dsds';
                }
              },
              {
                name: 'last_name',
                type: 'text',
                placeholder: 'LAST_NAME',
                width: 'half'
              }
            ]
          }
        ]}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
