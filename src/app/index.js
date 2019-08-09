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
    let {error} = this.state;
    return (
      <Form
        theme="modernDark"
        autoReset={true}
        ref="form"
        title={{
          text: 'Login',
          htmlAfter: (() => {
            return(
              <div>2</div>
            )
          })()
        }}
        onSubmit={(data, scope) => {
          console.log(data);
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve('Error!');
            }, 3000);
          }).then(() => {

          }).catch((error) => {
            this.setState({
              error: error
            })
          })
        }}
        fields={[
          {
            name: 'text',
            type: 'text',
            label: 'Name'
          },{
            label: 'Password',
            type: 'password',
            name: 'password',
            validation: (e) => {
              if(!e) return 's'
            },
            switchButton: {
              enable: true
            }
          },
          {
            value: 'Sign in',
            type: 'submit',
            htmlAfter: (() => {
              if(!error) return null;
              return (
                <div className="form-error">{error}</div>
              )
            })()
          },{
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
