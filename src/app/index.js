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
        theme="modernDark"
        autoReset={true}
        ref="form"
        title={{
          text: 'Login',
          htmlAfter: (() => {
            return(
              <div>2</div>
            )
          })(),
          htmlBefore: (() => {
            return(
              <div>1</div>
            )
          })()
        }}
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
          },{
            type: 'password',
            name: 'password',
            switchButton: {
              enable: true
            }
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
