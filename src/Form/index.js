import React, { Component } from 'react'
import './styles/styles.scss';
export default class Form extends Component {
  constructor(props){
    super(props);
    this.state = {
      fields: props.fields,
      cols: props.cols,
      className: props.className,
      hash: this.generateHash(),
      values: {}
    }
    this.submit = this.submit.bind(this);
    this.switcher = this.switcher.bind(this);
    this.hash = this.generateHash();
  }

  componentWillReceiveProps(props){
    this.setState({
      fields: props.fields,
      cols: props.cols,
      className: props.className
    })
  }

  componentWillMount(){
    let {fields, values} = this.state;
    fields && fields.map((item, index) => {
      if(item.name) values[item.name] = this.getDefaultValue(item);
    });
    this.setState({
      values
    });
  }

  generateHash(){
		let rand = window.Math.floor((window.Math.random()) * 0x10000000000000),
			result;
		rand = rand.toString(16).substring(1),
    result = rand.split('').splice(0, 10).join('');
		return result;
  }

  inputChange(item, event){
    let {values} = this.state;
    values[item.name] = event.target.value;
    this.setState({
      values
    })
  }

  selectChange(item, event){
    let {values} = this.state,
      options = event.target.querySelectorAll('option'),
      array = [];
    options.forEach((item, index) => {
      if(item.selected) array.push(item.value);
    });
    values[item.name] = array;
    this.setState({
      values
    })
  }

  checkboxChange(item, checkbox, event){
    let {values} = this.state,
      array = [],
      dom = document.querySelectorAll('[name="'+item.name+'__'+this.state.hash+'"]');
    dom.forEach((e, i) => {
      if(e.checked){
        array.push(e.value);
      }
    });
    values[item.name] = array;
    this.setState({
      values
    });
  }

  radioChange(item, radio, event){
    let {values} = this.state;
    values[item.name] = radio.value;
    this.setState({
      values
    });
  }

  boolChange(item, event){
    let {values} = this.state;
    values[item.name] = event.target.checked;
    this.setState({
      values
    })
  }

  getDefaultValue(field){
    let result = '';
    if(field.type === 'checkbox' || field.type === 'select') result = [];
    if((field.type === 'checkbox' || field.type === 'radio') && !field.options) result = false;
    return field.value || result;
  }

  clearForm(){
    let {fields} = this.state,
      values = {};
    fields && fields.map((field, index) => {
      if(field.name) values[field.name] = this.getDefaultValue(field);
    });
    this.setState({
      values
    });
  }

  buildInput(item){
    let className = 'form-control';
    if(item.width) className += ' form-control__'+item.type;
    if(item.className) className += ' '+item.className;
    return(
      <input
        id={item.name+'__'+this.state.hash}
        className={className}
        placeholder={item.placeholder}
        onChange={(event) => {
          this.inputChange(item, event);
        }}
        type={item.type}
        value={this.state.values[item.name]}
      />
    )
  }

  buildTextarea(item){
    let className = 'form-control';
    if(item.width) className += ' form-control___'+item.type;
    if(item.className) className += ' '+item.className;
    return(
      <textarea
        id={item.name+'__'+this.state.hash}
        className={className}
        placeholder={item.placeholder}
        onChange={(event) => {
          this.inputChange(item, event);
        }}
        value={this.state.values[item.name]}
      >
      </textarea>
    )
  }

  buildSelect(item){
    let className = 'form-control',
      multiple = item.multiple || false;
    if(item.width) className += ' form-control___'+item.type;
    if(item.className) className += ' '+item.className;
    return(
      <select
        id={item.name+'__'+this.state.hash}
        className={className}
        multiple={multiple}
        size={multiple ? item.size || 0 : 1}
        onChange={(event) => {
          this.selectChange(item, event);
        }}
      >
        {!multiple && !this.state.values[item.name].length &&
          <option selected></option>
        }
        {item.options && item.options.map((option, index) => {
          return(
            <option
              key={index}
              selected={this.state.values[item.name].indexOf(option.value) >= 0}
              value={option.value}
            >
              {option.text}
            </option>
          )
        })}
      </select>
    )
  }

  buildSwitcher(item){
    let listClass = 'form-list';
    if(item.inline) listClass += ' form-list__inline';
    return(
      <div className={listClass}>
        {item.options ? item.options.map((switcher, index) => {
          let checked = (() => {
              if(item.type === 'checkbox'){
                return this.state.values[item.name] ? this.state.values[item.name].indexOf(switcher.value) >= 0 : false;
              }
              if(item.type === 'radio'){
                return this.state.values[item.name] === switcher.value;
              }
            })(),
            className = 'form-list-item',
            switcherClassName = 'form-switcher form-switcher__'+item.type;
          if(checked) switcherClassName += ' form-switcher__checked'
          return <label key={index} className={className}>
            <input
              name={item.name+'__'+this.state.hash}
              type={item.type}
              onChange={(event) => {
                if(item.type === 'checkbox'){
                  this.checkboxChange(item, switcher, event);
                }
                if(item.type === 'radio')
                  this.radioChange(item, switcher, event);
              }}
              value={switcher.value}
              checked={checked} />
            <div className={switcherClassName}>
              <div className="form-switcher-pointer"></div>
              <div dangerouslySetInnerHTML={{__html: switcher.text}} />
            </div>
          </label>;
        }) :
          (() => {
            let checked = this.state.values[item.name] || false,
              className = 'form-list-item',
              switcherClassName = 'form-switcher form-switcher__'+item.type;
            if(checked) switcherClassName += ' form-switcher__checked'
            return(
              <label className={className}>
                <input
                  name={item.name+'__'+this.state.hash}
                  type={item.type}
                  onChange={(event) => {
                    this.boolChange(item, event);
                  }}
                  value={item.value}
                  checked={checked} />
                <div className={switcherClassName}>
                  <div className="form-switcher-pointer"></div>
                  <div dangerouslySetInnerHTML={{__html: item.text}} />
                </div>
              </label>
            )
          })()
        }
      </div>
    )
  }

  buildSubmit(item){
    return(
      <input
        type={item.type}
        className={item.className}
        value={this.state.values[item.name] || item.value} />
    )
  }

  validation(){
    let {fields} = this.state,
      errors = [];
    fields.forEach((item, index) => {
      if(item.validation){
        let error = item.validation(this.state.values[item.name], this.state.values);
        if(error){
          fields[index]['error'] = error;
          errors.push({
            [item.name]: error
          });
        }
        else{
          delete fields[index]['error'];
        }
      }
    });
    this.setState({
      fields
    });
    return errors;
  }

  submit(e){
    e.preventDefault();
    let errors = this.validation();
    if(errors.length) return false;
    let data = Object.assign({}, this.state.values);
    this.props.onSubmit && this.props.onSubmit(data).then((resp) => {
      this.props.autoReset && this.clearForm();
    });
  }

  switcher(field){
    switch(field.type){
      case 'text':
        return this.buildInput(field);
      case 'password':
        return this.buildInput(field);
      case 'email':
        return this.buildInput(field);
      case 'tel':
        return this.buildInput(field);
      case 'textarea':
        return this.buildTextarea(field);
      case 'select':
        return this.buildSelect(field);
      case 'checkbox':
        return this.buildSwitcher(field);
      case 'radio':
        return this.buildSwitcher(field);
      case 'submit':
        return this.buildSubmit(field);
    }
  }

  buildControl(field){
    return (
      <div className="form-control-wrapper">
        {this.switcher(field)}
      </div>
    )
  }

  buildHtml(data){
    return(
      <div className="form-html">
        {data}
      </div>
    )
  }

  buildField(field, index){
    let className = 'form-field';
    if(field.width) className += ' form-field__'+field.width;
    if(field.type) className += ' form-field__'+field.type;
    if(field.error) className += ' form-field__error';
    if(field.wrapperClassName) className += ' '+field.wrapperClassName;
    return (
      <div
        className={className}
        key={index}
      >
        {field.htmlBefore && this.buildHtml(field.htmlBefore)}
        {this.buildLabel(field)}
        {this.buildControl(field)}
        {this.buildError(field)}
        {field.htmlAfter && this.buildHtml(field.htmlAfter)}
      </div>
    )
  }

  buildCol(col, index){
    let {fields} = this.state,
      className = 'form-col';
    if(col.width) className += ' form-col__'+col.width;
    return(
      <div key={index} className={className}>
        {fields.filter((item, index) => {
          return item.col && item.col === col.name;
        }).map((item, index) => {
          return this.buildField(item, index)
        })}
      </div>
    )
  }

  buildLabel(field){
    if(!field.label) return null;
    return(
      <div className="form-label">
        <label htmlFor={field.name+'__'+this.state.hash}>
          {field.label}
        </label>
      </div>
    )
  }

  buildError(field){
    if(!field.error) return null;
    return(
      <div className="form-error">
        {field.error}
      </div>
    )
  }

  render() {
    let {fields, cols, className = ''} = this.state;
    return (
      <div className={className}>
        <form className="form" onSubmit={this.submit}>
          {cols && cols.length ?
            cols.map((col, index) => {
              return this.buildCol(col, index);
            })
            :
            fields && fields.map((item, index) => {
              let item2 = Object.assign({}, item);
              return this.buildField(item2, index)
            })
          }
        </form>
      </div>
    )
  }
}