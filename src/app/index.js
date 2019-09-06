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
            type: 'date',
            name: 'date',
            min: +new Date() - 86400 * 1000 * 4,
            value: +new Date() - 86400 * 1000,
            max: +new Date()
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
