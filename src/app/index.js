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
            value: +new Date() - 111186000,
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
